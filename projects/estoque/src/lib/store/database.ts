import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { demoSeed } from "@/lib/store/seed";
import type {
  AuditEntity,
  AuditLog,
  AuditAction,
  Brand,
  Category,
  Company,
  DemoDatabase,
  InventoryBalance,
  InventoryCount,
  InventoryCountItem,
  InventoryMovement,
  InventoryMovementWithRelations,
  Location,
  MovementType,
  Product,
  ProductBatch,
  ProductSerial,
  Supplier,
  User,
  UserRole,
  UserWithMembership,
} from "@/types/domain";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "demo-database.json");

async function ensureDatabaseFile() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(DATA_FILE, "utf-8");
  } catch {
    await writeFile(DATA_FILE, JSON.stringify(demoSeed, null, 2), "utf-8");
  }
}

function normalizeDatabase(raw: Partial<DemoDatabase>): DemoDatabase {
  return {
    companies: raw.companies ?? demoSeed.companies,
    users: raw.users ?? demoSeed.users,
    userCompanies: raw.userCompanies ?? demoSeed.userCompanies,
    categories: raw.categories ?? demoSeed.categories,
    brands: raw.brands ?? demoSeed.brands,
    locations: raw.locations ?? demoSeed.locations,
    suppliers: raw.suppliers ?? demoSeed.suppliers,
    inventoryCounts: raw.inventoryCounts ?? demoSeed.inventoryCounts,
    inventoryCountItems: raw.inventoryCountItems ?? demoSeed.inventoryCountItems,
    products: raw.products ?? demoSeed.products,
    productBatches: raw.productBatches ?? [],
    productSerials: raw.productSerials ?? [],
    inventoryBalances: raw.inventoryBalances ?? demoSeed.inventoryBalances,
    inventoryMovements: raw.inventoryMovements ?? demoSeed.inventoryMovements,
    auditLogs: raw.auditLogs ?? [],
  };
}

export async function readDatabase(): Promise<DemoDatabase> {
  await ensureDatabaseFile();
  const content = await readFile(DATA_FILE, "utf-8");
  return normalizeDatabase(JSON.parse(content) as Partial<DemoDatabase>);
}

export async function writeDatabase(data: DemoDatabase) {
  await ensureDatabaseFile();
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const getUserById = cache(async (userId: string) => {
  const db = await readDatabase();
  return db.users.find((user) => user.id === userId) ?? null;
});

export async function findUserByCredentials(email: string, password: string) {
  const db = await readDatabase();
  return (
    db.users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password &&
        user.status === "ACTIVE",
    ) ?? null
  );
}

export async function getCompaniesForUser(userId: string) {
  const db = await readDatabase();

  return db.userCompanies
    .filter((membership) => membership.userId === userId && membership.isActive)
    .map((membership) => {
      const company = db.companies.find((item) => item.id === membership.companyId);
      return company ? { company, role: membership.role } : null;
    })
    .filter((item): item is { company: Company; role: "ADMIN" | "SUPERVISOR" | "STORAGE_CLERK" | "BUYER" | "VIEWER" } => Boolean(item));
}

export async function listUsersByCompany(companyId: string): Promise<UserWithMembership[]> {
  const db = await readDatabase();

  return db.userCompanies
    .filter((membership) => membership.companyId === companyId)
    .map((membership) => {
      const user = db.users.find((item) => item.id === membership.userId);
      return user ? { ...user, membership } : null;
    })
    .filter((item): item is UserWithMembership => Boolean(item))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getUserMembershipById(companyId: string, userId?: string | null) {
  if (!userId) {
    return null;
  }

  const users = await listUsersByCompany(companyId);
  return users.find((user) => user.id === userId) ?? null;
}

export async function listCategoriesByCompany(companyId: string) {
  const db = await readDatabase();
  return db.categories
    .filter((category) => category.companyId === companyId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCompanyById(companyId: string) {
  const db = await readDatabase();
  return db.companies.find((company) => company.id === companyId) ?? null;
}

export async function getCategoryById(companyId: string, categoryId?: string | null) {
  if (!categoryId) {
    return null;
  }

  const db = await readDatabase();
  return db.categories.find((category) => category.id === categoryId && category.companyId === companyId) ?? null;
}

// -------- Brands --------

export async function listBrandsByCompany(companyId: string) {
  const db = await readDatabase();
  return db.brands
    .filter((brand) => brand.companyId === companyId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBrandById(companyId: string, brandId?: string | null) {
  if (!brandId) {
    return null;
  }

  const db = await readDatabase();
  return db.brands.find((brand) => brand.id === brandId && brand.companyId === companyId) ?? null;
}

type BrandInput = {
  id?: string;
  name: string;
  description?: string;
};

export async function upsertBrand(companyId: string, input: BrandInput) {
  const db = await readDatabase();
  const normalizedName = input.name.trim();

  const duplicate = db.brands.find(
    (brand) =>
      brand.companyId === companyId &&
      brand.name.toLowerCase() === normalizedName.toLowerCase() &&
      brand.id !== input.id,
  );

  if (duplicate) {
    throw new Error("Ja existe uma marca com esse nome na empresa ativa.");
  }

  if (input.id) {
    db.brands = db.brands.map((brand) =>
      brand.id === input.id && brand.companyId === companyId
        ? {
            ...brand,
            name: normalizedName,
            description: input.description?.trim() || undefined,
            updatedAt: new Date().toISOString(),
          }
        : brand,
    );
  } else {
    const now = new Date().toISOString();
    db.brands.push({
      id: crypto.randomUUID(),
      companyId,
      name: normalizedName,
      description: input.description?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });
  }

  await writeDatabase(db);
}

// -------- End Brands --------

// -------- Locations --------

export async function listLocationsByCompany(companyId: string) {
  const db = await readDatabase();
  return db.locations
    .filter((loc) => loc.companyId === companyId)
    .sort((a, b) => a.level - b.level || a.sortOrder - b.sortOrder);
}

export async function getLocationById(companyId: string, locationId?: string | null) {
  if (!locationId) {
    return null;
  }

  const db = await readDatabase();
  return db.locations.find((loc) => loc.id === locationId && loc.companyId === companyId) ?? null;
}

export async function getLocationPath(companyId: string, locationId: string): Promise<string> {
  const db = await readDatabase();
  const parts: string[] = [];
  let current = db.locations.find((loc) => loc.id === locationId && loc.companyId === companyId);

  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? db.locations.find((loc) => loc.id === current!.parentId && loc.companyId === companyId) : undefined;
  }

  return parts.join(" → ");
}

type LocationInput = {
  id?: string;
  name: string;
  parentId?: string;
  level: number;
  sortOrder?: number;
};

export async function upsertLocation(companyId: string, input: LocationInput) {
  const db = await readDatabase();
  const normalizedName = input.name.trim();

  if (input.parentId) {
    const parent = db.locations.find((loc) => loc.id === input.parentId && loc.companyId === companyId);
    if (!parent) {
      throw new Error("Localizacao pai nao encontrada.");
    }
  }

  if (input.id) {
    db.locations = db.locations.map((loc) =>
      loc.id === input.id && loc.companyId === companyId
        ? {
            ...loc,
            name: normalizedName,
            parentId: input.parentId || undefined,
            level: input.level,
            sortOrder: input.sortOrder ?? 0,
            updatedAt: new Date().toISOString(),
          }
        : loc,
    );
  } else {
    const now = new Date().toISOString();
    db.locations.push({
      id: crypto.randomUUID(),
      companyId,
      name: normalizedName,
      parentId: input.parentId || undefined,
      level: input.level,
      sortOrder: input.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  await writeDatabase(db);
}

export async function deleteLocation(companyId: string, locationId: string) {
  const db = await readDatabase();
  const hasChildren = db.locations.some((loc) => loc.parentId === locationId && loc.companyId === companyId);
  if (hasChildren) {
    throw new Error("Remova as sub-localizacoes antes de excluir esta.");
  }

  const hasProducts = db.products.some((p) => p.locationId === locationId && p.companyId === companyId);
  if (hasProducts) {
    throw new Error("Existem produtos vinculados a esta localizacao.");
  }

  db.locations = db.locations.filter((loc) => !(loc.id === locationId && loc.companyId === companyId));
  await writeDatabase(db);
}

// -------- End Locations --------

// -------- Suppliers --------

export async function listSuppliersByCompany(companyId: string) {
  const db = await readDatabase();
  return db.suppliers
    .filter((s) => s.companyId === companyId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getSupplierById(companyId: string, supplierId?: string | null) {
  if (!supplierId) {
    return null;
  }

  const db = await readDatabase();
  return db.suppliers.find((s) => s.id === supplierId && s.companyId === companyId) ?? null;
}

type SupplierInput = {
  id?: string;
  name: string;
  cnpj?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: "ACTIVE" | "INACTIVE";
};

export async function upsertSupplier(companyId: string, input: SupplierInput) {
  const db = await readDatabase();
  const normalizedName = input.name.trim();

  if (input.cnpj) {
    const duplicateCnpj = db.suppliers.find(
      (s) =>
        s.companyId === companyId &&
        s.cnpj === input.cnpj &&
        s.id !== input.id,
    );
    if (duplicateCnpj) {
      throw new Error("Ja existe um fornecedor com esse CNPJ na empresa ativa.");
    }
  }

  if (input.id) {
    db.suppliers = db.suppliers.map((s) =>
      s.id === input.id && s.companyId === companyId
        ? {
            ...s,
            name: normalizedName,
            cnpj: input.cnpj || undefined,
            contact: input.contact?.trim() || undefined,
            phone: input.phone?.trim() || undefined,
            email: input.email?.trim() || undefined,
            address: input.address?.trim() || undefined,
            status: input.status,
            updatedAt: new Date().toISOString(),
          }
        : s,
    );
  } else {
    const now = new Date().toISOString();
    db.suppliers.push({
      id: crypto.randomUUID(),
      companyId,
      name: normalizedName,
      cnpj: input.cnpj || undefined,
      contact: input.contact?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      email: input.email?.trim() || undefined,
      address: input.address?.trim() || undefined,
      status: input.status,
      createdAt: now,
      updatedAt: now,
    });
  }

  await writeDatabase(db);
}

// -------- End Suppliers --------

// -------- Inventory Count --------

export async function listInventoryCountsByCompany(companyId: string) {
  const db = await readDatabase();
  return db.inventoryCounts
    .filter((c) => c.companyId === companyId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getInventoryCountById(companyId: string, countId: string) {
  const db = await readDatabase();
  return db.inventoryCounts.find((c) => c.id === countId && c.companyId === companyId) ?? null;
}

export async function getInventoryCountItems(countId: string) {
  const db = await readDatabase();
  return db.inventoryCountItems.filter((item) => item.inventoryCountId === countId);
}

type StartInventoryCountInput = {
  name: string;
};

export async function startInventoryCount(companyId: string, userId: string, input: StartInventoryCountInput) {
  const db = await readDatabase();
  const now = new Date().toISOString();
  const countId = crypto.randomUUID();

  db.inventoryCounts.push({
    id: countId,
    companyId,
    name: input.name.trim(),
    status: "OPEN",
    createdAt: now,
    createdByUserId: userId,
  });

  // Cria itens para todos os produtos da empresa com saldo atual
  const balances = db.inventoryBalances.filter((b) => b.companyId === companyId);
  const products = db.products.filter((p) => p.companyId === companyId);

  for (const product of products) {
    const balance = balances.find((b) => b.productId === product.id);
    const expected = balance?.currentQuantity ?? 0;
    db.inventoryCountItems.push({
      id: crypto.randomUUID(),
      inventoryCountId: countId,
      productId: product.id,
      expectedQuantity: expected,
      countedQuantity: expected,
      difference: 0,
    });
  }

  await writeDatabase(db);
  return countId;
}

export async function updateInventoryCountItem(
  countId: string,
  itemId: string,
  countedQuantity: number,
  notes?: string,
) {
  const db = await readDatabase();
  const item = db.inventoryCountItems.find((i) => i.id === itemId && i.inventoryCountId === countId);
  if (!item) throw new Error("Item de contagem nao encontrado.");

  item.countedQuantity = countedQuantity;
  item.difference = countedQuantity - item.expectedQuantity;
  item.notes = notes?.trim() || undefined;
  item.countedAt = new Date().toISOString();

  await writeDatabase(db);
}

export async function closeInventoryCount(companyId: string, countId: string, userId: string) {
  const db = await readDatabase();
  const count = db.inventoryCounts.find((c) => c.id === countId && c.companyId === companyId);
  if (!count) throw new Error("Contagem nao encontrada.");
  if (count.status === "CLOSED") throw new Error("Contagem ja esta fechada.");

  count.status = "CLOSED";
  count.closedAt = new Date().toISOString();

  // Gera movimentacoes de ajuste para as divergencias
  const items = db.inventoryCountItems.filter((i) => i.inventoryCountId === countId);
  for (const item of items) {
    if (item.difference === 0) continue;

    const type = item.difference > 0 ? "ADJUSTMENT" : "NEGATIVE_ADJUSTMENT";
    const absDiff = Math.abs(item.difference);

    const balance = db.inventoryBalances.find(
      (b) => b.companyId === companyId && b.productId === item.productId,
    );
    if (!balance) continue;

    const previousQuantity = balance.currentQuantity;
    const resultingQuantity = item.countedQuantity;

    db.inventoryMovements.unshift({
      id: crypto.randomUUID(),
      companyId,
      productId: item.productId,
      performedByUserId: userId,
      type,
      quantity: absDiff,
      previousQuantity,
      resultingQuantity,
      reason: `Ajuste por inventario: ${count.name}`,
      note: item.notes || `Divergencia de ${item.difference > 0 ? "+" : ""}${item.difference}`,
      referenceCode: countId,
      createdAt: new Date().toISOString(),
    });

    balance.currentQuantity = resultingQuantity;
    balance.updatedAt = new Date().toISOString();
  }

  await writeDatabase(db);
}

export async function getInventoryDivergences(companyId: string, countId: string) {
  const db = await readDatabase();
  const count = db.inventoryCounts.find((c) => c.id === countId && c.companyId === companyId);
  if (!count) throw new Error("Contagem nao encontrada.");

  const items = db.inventoryCountItems.filter((i) => i.inventoryCountId === countId);
  const products = db.products.filter((p) => p.companyId === companyId);

  return items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId)!,
    }))
    .filter((item) => item.difference !== 0)
    .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
}

// -------- End Inventory Count --------

// -------- Alerts --------

type AlertsResult = {
  lowStock: Array<{ product: Product; currentQuantity: number }>;
  zeroStock: Array<{ product: Product }>;
  expiringSoon: Array<{ product: Product; daysUntilExpiry: number }>;
  noMovement: Array<{ product: Product; currentQuantity: number; lastMovementAt: string | null }>;
};

export async function getAlerts(companyId: string): Promise<AlertsResult> {
  const db = await readDatabase();
  const products = db.products.filter((p) => p.companyId === companyId && p.status === "ACTIVE");
  const balances = db.inventoryBalances.filter((b) => b.companyId === companyId);
  const movements = db.inventoryMovements.filter((m) => m.companyId === companyId);

  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const latestMovementPerProduct = new Map<string, string>();
  for (const m of movements) {
    const existing = latestMovementPerProduct.get(m.productId);
    if (!existing || new Date(m.createdAt) > new Date(existing)) {
      latestMovementPerProduct.set(m.productId, m.createdAt);
    }
  }

  const lowStock: AlertsResult["lowStock"] = [];
  const zeroStock: AlertsResult["zeroStock"] = [];
  const expiringSoon: AlertsResult["expiringSoon"] = [];
  const noMovement: AlertsResult["noMovement"] = [];

  for (const product of products) {
    const balance = balances.find((b) => b.productId === product.id);
    const qty = balance?.currentQuantity ?? 0;

    // Estoque baixo: abaixo ou igual ao minimo
    if (typeof product.minimumStock === "number" && qty > 0 && qty <= product.minimumStock) {
      lowStock.push({ product, currentQuantity: qty });
    }

    // Estoque zerado
    if (qty === 0) {
      zeroStock.push({ product });
    }

    // Proximo do vencimento (30 dias)
    if (product.expiryDate) {
      const expiry = new Date(product.expiryDate);
      if (expiry > now && expiry <= thirtyDaysFromNow) {
        const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        expiringSoon.push({ product, daysUntilExpiry });
      }
    }

    // Sem movimentacao nos ultimos 60 dias
    const lastMove = latestMovementPerProduct.get(product.id);
    if (!lastMove || new Date(lastMove) < sixtyDaysAgo) {
      noMovement.push({ product, currentQuantity: qty, lastMovementAt: lastMove || null });
    }
  }

  lowStock.sort((a, b) => a.currentQuantity - b.currentQuantity);
  zeroStock.sort((a, b) => a.product.name.localeCompare(b.product.name));
  expiringSoon.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  noMovement.sort((a, b) => {
    const aDate = a.lastMovementAt || "";
    const bDate = b.lastMovementAt || "";
    return aDate.localeCompare(bDate);
  });

  return { lowStock, zeroStock, expiringSoon, noMovement };
}

// -------- End Alerts --------

// -------- Validity --------

type ValidityResult = {
  expiringSoon: Array<{
    product: Product;
    currentQuantity: number;
    daysUntilExpiry: number;
    costPrice?: number;
    totalValue?: number;
  }>;
  expired: Array<{
    product: Product;
    currentQuantity: number;
    daysOverdue: number;
    costPrice?: number;
    totalValue?: number;
  }>;
};

export async function getValidityAlerts(companyId: string): Promise<ValidityResult> {
  const db = await readDatabase();
  const products = db.products.filter((p) => p.companyId === companyId && p.status === "ACTIVE" && p.expiryDate);
  const balances = db.inventoryBalances.filter((b) => b.companyId === companyId);

  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const expiringSoon: ValidityResult["expiringSoon"] = [];
  const expired: ValidityResult["expired"] = [];

  for (const product of products) {
    const balance = balances.find((b) => b.productId === product.id);
    const qty = balance?.currentQuantity ?? 0;

    const expiryDate = new Date(product.expiryDate!);

    // Vencido
    if (expiryDate < now) {
      const daysOverdue = Math.ceil((now.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24));
      expired.push({
        product,
        currentQuantity: qty,
        daysOverdue,
        costPrice: product.costPrice ?? undefined,
        totalValue: product.costPrice ? product.costPrice * qty : undefined,
      });
      continue;
    }

    // A vencer nos proximos 30 dias
    if (expiryDate <= thirtyDaysFromNow) {
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      expiringSoon.push({
        product,
        currentQuantity: qty,
        daysUntilExpiry,
        costPrice: product.costPrice ?? undefined,
        totalValue: product.costPrice ? product.costPrice * qty : undefined,
      });
    }
  }

  expired.sort((a, b) => a.daysOverdue - b.daysOverdue);
  expiringSoon.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  return { expiringSoon, expired };
}

export async function getValiditySummaryByMonth(companyId: string) {
  const db = await readDatabase();
  const products = db.products.filter((p) => p.companyId === companyId && p.status === "ACTIVE" && p.expiryDate);
  const balances = db.inventoryBalances.filter((b) => b.companyId === companyId);

  const now = new Date();
  const summary = new Map<string, { count: number; quantity: number; totalValue: number }>();

  for (const product of products) {
    const balance = balances.find((b) => b.productId === product.id);
    const qty = balance?.currentQuantity ?? 0;

    const expiry = new Date(product.expiryDate!);
    const monthKey = `${expiry.getFullYear()}-${String(expiry.getMonth() + 1).padStart(2, "0")}`;

    const existing = summary.get(monthKey) || { count: 0, quantity: 0, totalValue: 0 };
    existing.count++;
    existing.quantity += qty;
    if (product.costPrice) existing.totalValue += product.costPrice * qty;
    summary.set(monthKey, existing);
  }

  return Array.from(summary.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// -------- End Validity --------

// -------- Reports --------

type ReportStockItem = {
  product: Product;
  currentQuantity: number;
  costPrice: number | undefined;
  totalValue: number;
  categoryName: string;
  brandName: string;
};

export async function getCurrentStockReport(companyId: string): Promise<ReportStockItem[]> {
  const db = await readDatabase();
  const products = db.products.filter((p) => p.companyId === companyId && p.status === "ACTIVE");
  const balances = db.inventoryBalances.filter((b) => b.companyId === companyId);
  const categories = db.categories.filter((c) => c.companyId === companyId);
  const brands = db.brands.filter((b) => b.companyId === companyId);
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.name]));

  return products
    .map((product) => {
      const balance = balances.find((b) => b.productId === product.id);
      const qty = balance?.currentQuantity ?? 0;
      return {
        product,
        currentQuantity: qty,
        costPrice: product.costPrice ?? undefined,
        totalValue: product.costPrice ? product.costPrice * qty : 0,
        categoryName: product.categoryId ? categoryMap[product.categoryId] || "-" : "-",
        brandName: product.brandId ? brandMap[product.brandId] || "-" : "-",
      };
    })
    .sort((a, b) => b.totalValue - a.totalValue);
}

export async function getAbcCurve(companyId: string) {
  const stock = await getCurrentStockReport(companyId);
  const totalValue = stock.reduce((acc, item) => acc + item.totalValue, 0);

  let cumulative = 0;
  return stock.map((item) => {
    cumulative += item.totalValue;
    const pct = totalValue > 0 ? (item.totalValue / totalValue) * 100 : 0;
    const cumulativePct = totalValue > 0 ? (cumulative / totalValue) * 100 : 0;
    let classification: "A" | "B" | "C";
    if (cumulativePct <= 80) classification = "A";
    else if (cumulativePct <= 95) classification = "B";
    else classification = "C";

    return { ...item, pct, cumulativePct, classification, totalValue };
  });
}

export async function getInventoryTurnover(companyId: string) {
  const db = await readDatabase();
  const products = db.products.filter((p) => p.companyId === companyId && p.status === "ACTIVE");
  const balances = db.inventoryBalances.filter((b) => b.companyId === companyId);
  const movements = db.inventoryMovements.filter((m) => m.companyId === companyId);

  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  return products.map((product) => {
    const balance = balances.find((b) => b.productId === product.id);
    const qty = balance?.currentQuantity ?? 0;

    // Saidas nos ultimos 6 meses
    const exits = movements.filter(
      (m) => m.productId === product.id && m.createdAt >= sixMonthsAgo.toISOString() && ["EXIT", "SALE", "INTERNAL_CONSUMPTION", "LOSS", "BREAKAGE", "NEGATIVE_ADJUSTMENT"].includes(m.type),
    );
    const totalExits = exits.reduce((acc, m) => acc + m.quantity, 0);

    // Giro = total saidas / saldo medio (saldo atual como aproximacao)
    const turnover = qty > 0 ? totalExits / qty : 0;

    // Dias para zerar = saldo / saidas diarias
    const dailyExitRate = totalExits / 180;
    const daysToZero = dailyExitRate > 0 ? qty / dailyExitRate : Infinity;

    return { product, currentQuantity: qty, totalExits, turnover, daysToZero };
  });
}

export async function getStagnantProducts(companyId: string, daysThreshold = 60) {
  const db = await readDatabase();
  const products = db.products.filter((p) => p.companyId === companyId && p.status === "ACTIVE");
  const balances = db.inventoryBalances.filter((b) => b.companyId === companyId);
  const movements = db.inventoryMovements.filter((m) => m.companyId === companyId);

  const threshold = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);

  const latestMovementPerProduct = new Map<string, string>();
  for (const m of movements) {
    const existing = latestMovementPerProduct.get(m.productId);
    if (!existing || new Date(m.createdAt) > new Date(existing)) {
      latestMovementPerProduct.set(m.productId, m.createdAt);
    }
  }

  return products
    .map((product) => {
      const balance = balances.find((b) => b.productId === product.id);
      const qty = balance?.currentQuantity ?? 0;
      const lastMoveAt = latestMovementPerProduct.get(product.id) || null;
      const daysSinceLastMove = lastMoveAt
        ? Math.floor((Date.now() - new Date(lastMoveAt).getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;

      return { product, currentQuantity: qty, lastMovementAt: lastMoveAt, daysSinceLastMove };
    })
    .filter((item) => item.daysSinceLastMove >= daysThreshold)
    .sort((a, b) => b.daysSinceLastMove - a.daysSinceLastMove);
}

export async function getFinancialSummary(companyId: string) {
  const stock = await getCurrentStockReport(companyId);
  const products = await listProductsByCompany(companyId);
  const activeProducts = products.filter((p) => p.status === "ACTIVE");

  const totalStockValue = stock.reduce((acc, item) => acc + item.totalValue, 0);
  const productsWithCost = activeProducts.filter((p) => p.costPrice);
  const avgCostPrice = productsWithCost.length > 0
    ? productsWithCost.reduce((acc, p) => acc + (p.costPrice ?? 0), 0) / productsWithCost.length
    : 0;

  return { totalStockValue, totalProducts: stock.length, productsWithCost: productsWithCost.length, avgCostPrice };
}

// -------- End Reports --------

// -------- Audit --------

type AuditInput = {
  companyId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string;
  entityName: string;
  description: string;
  details?: string;
  ipAddress?: string;
};

export async function registerAudit(input: AuditInput): Promise<string> {
  const db = await readDatabase();
  const id = crypto.randomUUID();

  const log: AuditLog = {
    id,
    companyId: input.companyId,
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    userRole: input.userRole as UserRole,
    action: input.action as AuditAction,
    entity: input.entity as AuditEntity,
    entityId: input.entityId,
    entityName: input.entityName,
    description: input.description,
    details: input.details || undefined,
    ipAddress: input.ipAddress || undefined,
    createdAt: new Date().toISOString(),
  };

  db.auditLogs.unshift(log);
  await writeDatabase(db);
  return id;
}

export async function listAuditLogs(
  companyId: string,
  filters: {
    entity?: string;
    action?: string;
    userId?: string;
    days?: number;
    limit?: number;
  } = {},
): Promise<AuditLog[]> {
  const db = await readDatabase();
  const now = new Date();
  const daysAgo = filters.days
    ? new Date(now.getTime() - filters.days * 24 * 60 * 60 * 1000)
    : null;

  let logs = db.auditLogs.filter((log) => {
    if (log.companyId !== companyId) return false;
    if (filters.entity && log.entity !== filters.entity) return false;
    if (filters.action && log.action !== filters.action) return false;
    if (filters.userId && log.userId !== filters.userId) return false;
    if (daysAgo && new Date(log.createdAt) < daysAgo) return false;
    return true;
  });

  logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (filters.limit && filters.limit > 0) {
    logs = logs.slice(0, filters.limit);
  }

  return logs;
}

export async function getAuditSummary(companyId: string) {
  const db = await readDatabase();
  const logs = db.auditLogs.filter((l) => l.companyId === companyId);

  const byAction: Record<string, number> = {};
  const byEntity: Record<string, number> = {};
  const byUser: Record<string, { count: number; name: string }> = {};
  const byDate: Record<string, number> = {};

  for (const log of logs) {
    byAction[log.action] = (byAction[log.action] || 0) + 1;
    byEntity[log.entity] = (byEntity[log.entity] || 0) + 1;
    if (!byUser[log.userId]) {
      byUser[log.userId] = { count: 0, name: log.userName };
    }
    byUser[log.userId].count++;

    const day = log.createdAt.slice(0, 10);
    byDate[day] = (byDate[day] || 0) + 1;
  }

  return { total: logs.length, byAction, byEntity, byUser, byDate };
}

// -------- End Audit --------

export async function upsertCategory(companyId: string, input: CategoryInput) {
  const db = await readDatabase();
  const normalizedName = input.name.trim();

  const duplicate = db.categories.find(
    (category) =>
      category.companyId === companyId &&
      category.name.toLowerCase() === normalizedName.toLowerCase() &&
      category.id !== input.id,
  );

  if (duplicate) {
    throw new Error("Ja existe uma categoria com esse nome na empresa ativa.");
  }

  if (input.id) {
    db.categories = db.categories.map((category) =>
      category.id === input.id && category.companyId === companyId
        ? {
            ...category,
            name: normalizedName,
            description: input.description?.trim() || undefined,
            updatedAt: new Date().toISOString(),
          }
        : category,
    );
  } else {
    const now = new Date().toISOString();
    db.categories.push({
      id: crypto.randomUUID(),
      companyId,
      name: normalizedName,
      description: input.description?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });
  }

  await writeDatabase(db);
}

type CategoryInput = {
  id?: string;
  name: string;
  description?: string;
};

type UserInput = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "SUPERVISOR" | "STORAGE_CLERK" | "BUYER" | "VIEWER";
  status: "ACTIVE" | "INVITED" | "INACTIVE";
};

export async function upsertUserForCompany(companyId: string, input: UserInput) {
  const db = await readDatabase();
  const email = input.email.trim().toLowerCase();

  const duplicateEmail = db.users.find((user) => user.email.toLowerCase() === email && user.id !== input.id);
  if (duplicateEmail) {
    throw new Error("Ja existe um usuario com esse email.");
  }

  if (input.id) {
    const existingUser = db.users.find((user) => user.id === input.id);
    const existingMembership = db.userCompanies.find(
      (membership) => membership.userId === input.id && membership.companyId === companyId,
    );

    if (!existingUser || !existingMembership) {
      throw new Error("Usuario nao encontrado na empresa ativa.");
    }

    existingUser.name = input.name.trim();
    existingUser.email = email;
    existingUser.status = input.status;
    if (input.password) {
      existingUser.password = input.password;
    }

    existingMembership.role = input.role;
    existingMembership.isActive = input.status !== "INACTIVE";
  } else {
    const userId = crypto.randomUUID();
    db.users.push({
      id: userId,
      name: input.name.trim(),
      email,
      password: input.password || "123456",
      status: input.status,
    });
    db.userCompanies.push({
      id: crypto.randomUUID(),
      userId,
      companyId,
      role: input.role,
      isActive: input.status !== "INACTIVE",
    });
  }

  await writeDatabase(db);
}

type ProductFilters = {
  query?: string;
  categoryId?: string;
  status?: string;
};

export async function listProductsByCompany(companyId: string, filters: ProductFilters = {}) {
  const db = await readDatabase();
  const query = filters.query?.trim().toLowerCase();

  return db.products
    .filter((product) => product.companyId === companyId)
    .filter((product) => {
      if (filters.categoryId && product.categoryId !== filters.categoryId) {
        return false;
      }

      if (filters.status && filters.status !== "ALL" && product.status !== filters.status) {
        return false;
      }

      if (query) {
        const haystack = `${product.name} ${product.sku ?? ""}`.toLowerCase();
        return haystack.includes(query);
      }

      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getInventoryBalanceMap(companyId: string) {
  const db = await readDatabase();

  return db.inventoryBalances
    .filter((balance) => balance.companyId === companyId)
    .reduce<Record<string, InventoryBalance>>((acc, balance) => {
      acc[balance.productId] = balance;
      return acc;
    }, {});
}

export async function listProductsWithBalance(companyId: string, filters: ProductFilters = {}) {
  const [products, balanceMap] = await Promise.all([
    listProductsByCompany(companyId, filters),
    getInventoryBalanceMap(companyId),
  ]);

  return products.map((product) => ({
    ...product,
    currentQuantity: balanceMap[product.id]?.currentQuantity ?? 0,
  }));
}

export async function getProductById(companyId: string, productId?: string | null) {
  if (!productId) {
    return null;
  }

  const db = await readDatabase();
  return db.products.find((product) => product.id === productId && product.companyId === companyId) ?? null;
}

type ProductInput = {
  id?: string;
  name: string;
  description?: string;
  code?: string;
  sku?: string;
  barcode?: string;
  brandId?: string;
  categoryId?: string;
  locationId?: string;
  costPrice?: number;
  unit: Product["unit"];
  minimumStock?: number;
  maximumStock?: number;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  expiryDate?: string;
  status: Product["status"];
  trackBatch?: boolean;
  trackSerial?: boolean;
};

export async function upsertProduct(companyId: string, input: ProductInput) {
  const db = await readDatabase();
  const sku = input.sku?.trim() || undefined;

  if (sku) {
    const duplicateSku = db.products.find(
      (product) =>
        product.companyId === companyId &&
        (product.sku ?? "").toLowerCase() === sku.toLowerCase() &&
        product.id !== input.id,
    );

    if (duplicateSku) {
      throw new Error("Ja existe um produto com esse SKU na empresa ativa.");
    }
  }

  if (input.categoryId) {
    const categoryExists = db.categories.some(
      (category) => category.companyId === companyId && category.id === input.categoryId,
    );

    if (!categoryExists) {
      throw new Error("A categoria selecionada nao pertence a empresa ativa.");
    }
  }

  if (input.id) {
    db.products = db.products.map((product) =>
      product.id === input.id && product.companyId === companyId
        ? {
            ...product,
            name: input.name.trim(),
            description: input.description?.trim() || undefined,
            code: input.code?.trim() || undefined,
            sku,
            barcode: input.barcode?.trim() || undefined,
            brandId: input.brandId || undefined,
            categoryId: input.categoryId || undefined,
            costPrice: input.costPrice,
            unit: input.unit,
            minimumStock: input.minimumStock,
            maximumStock: input.maximumStock,
            locationId: input.locationId || undefined,
            weight: input.weight,
            dimensions: input.dimensions?.trim() || undefined,
            imageUrl: input.imageUrl?.trim() || undefined,
            expiryDate: input.expiryDate || undefined,
            status: input.status,
            trackBatch: input.trackBatch ?? false,
            trackSerial: input.trackSerial ?? false,
            updatedAt: new Date().toISOString(),
          }
        : product,
    );
  } else {
    const now = new Date().toISOString();
    const productId = crypto.randomUUID();
    db.products.push({
      id: productId,
      companyId,
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
      code: input.code?.trim() || undefined,
      sku,
      barcode: input.barcode?.trim() || undefined,
      brandId: input.brandId || undefined,
      categoryId: input.categoryId || undefined,
      costPrice: input.costPrice,
      unit: input.unit,
      minimumStock: input.minimumStock,
      maximumStock: input.maximumStock,
      locationId: input.locationId || undefined,
      weight: input.weight,
      dimensions: input.dimensions?.trim() || undefined,
      imageUrl: input.imageUrl?.trim() || undefined,
      expiryDate: input.expiryDate || undefined,
      status: input.status,
      trackBatch: input.trackBatch ?? false,
      trackSerial: input.trackSerial ?? false,
      createdAt: now,
      updatedAt: now,
    });
    db.inventoryBalances.push({
      id: crypto.randomUUID(),
      companyId,
      productId,
      currentQuantity: 0,
      updatedAt: now,
    });
  }

  await writeDatabase(db);
}

type InventoryMovementFilters = {
  productId?: string;
  type?: string;
};

type InventoryMovementInput = {
  type: MovementType;
  productId: string;
  quantity: number;
  reason?: string;
  note?: string;
  referenceCode?: string;
};

function getOrCreateBalance(db: DemoDatabase, companyId: string, productId: string) {
  let balance = db.inventoryBalances.find(
    (item) => item.companyId === companyId && item.productId === productId,
  );

  if (!balance) {
    balance = {
      id: crypto.randomUUID(),
      companyId,
      productId,
      currentQuantity: 0,
      updatedAt: new Date().toISOString(),
    };
    db.inventoryBalances.push(balance);
  }

  return balance;
}

export async function registerInventoryMovement(
  companyId: string,
  performedByUserId: string,
  input: InventoryMovementInput,
) {
  const db = await readDatabase();
  const product = db.products.find((item) => item.companyId === companyId && item.id === input.productId);

  if (!product) {
    throw new Error("O produto informado nao pertence a empresa ativa.");
  }

  const balance = getOrCreateBalance(db, companyId, product.id);
  const previousQuantity = balance.currentQuantity;
  let resultingQuantity = previousQuantity;

  if (input.type === "ENTRY") {
    resultingQuantity = previousQuantity + input.quantity;
  }

  if (input.type === "EXIT") {
    resultingQuantity = previousQuantity - input.quantity;
    if (resultingQuantity < 0) {
      throw new Error("Saldo insuficiente para concluir a saida.");
    }
  }

  if (input.type === "ADJUSTMENT") {
    resultingQuantity = input.quantity;
  }

  const quantityForHistory =
    input.type === "ADJUSTMENT" ? Math.abs(resultingQuantity - previousQuantity) : input.quantity;

  const movement: InventoryMovement = {
    id: crypto.randomUUID(),
    companyId,
    productId: product.id,
    performedByUserId,
    type: input.type,
    quantity: quantityForHistory,
    previousQuantity,
    resultingQuantity,
    reason: input.reason?.trim() || undefined,
    note: input.note?.trim() || undefined,
    referenceCode: input.referenceCode?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  balance.currentQuantity = resultingQuantity;
  balance.updatedAt = movement.createdAt;
  db.inventoryMovements.unshift(movement);

  await writeDatabase(db);

  return {
    movement,
    balance,
    product,
  };
}

export async function listInventoryMovementsByCompany(
  companyId: string,
  filters: InventoryMovementFilters = {},
): Promise<InventoryMovementWithRelations[]> {
  const db = await readDatabase();

  return db.inventoryMovements
    .filter((movement) => movement.companyId === companyId)
    .filter((movement) => {
      if (filters.productId && movement.productId !== filters.productId) {
        return false;
      }

      if (filters.type && filters.type !== "ALL" && movement.type !== filters.type) {
        return false;
      }

      return true;
    })
    .map((movement) => {
      const product = db.products.find((item) => item.id === movement.productId);
      const user = db.users.find((item) => item.id === movement.performedByUserId);

      if (!product || !user) {
        return null;
      }

      return {
        ...movement,
        product,
        user,
      };
    })
    .filter((item): item is InventoryMovementWithRelations => Boolean(item))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getInventorySummary(companyId: string) {
  const [products, movements, balances] = await Promise.all([
    listProductsWithBalance(companyId),
    listInventoryMovementsByCompany(companyId),
    getInventoryBalanceMap(companyId),
  ]);

  const lowStockCount = products.filter((product) => {
    if (typeof product.minimumStock !== "number") {
      return false;
    }

    return product.currentQuantity <= product.minimumStock;
  }).length;
  const totalQuantity = products.reduce((acc, product) => acc + product.currentQuantity, 0);

  return {
    productsCount: products.length,
    lowStockCount,
    movementsToday: movements.filter((movement) => {
      const today = new Date().toISOString().slice(0, 10);
      return movement.createdAt.slice(0, 10) === today;
    }).length,
    totalTrackedItems: Object.keys(balances).length,
    totalQuantity,
  };
}

// -------- Product Batches --------

export async function listBatchesByProduct(companyId: string, productId: string) {
  const db = await readDatabase();
  return db.productBatches
    .filter((b) => b.companyId === companyId && b.productId === productId)
    .sort((a, b) => a.batchCode.localeCompare(b.batchCode));
}

export async function getBatchById(companyId: string, batchId: string) {
  const db = await readDatabase();
  return db.productBatches.find((b) => b.id === batchId && b.companyId === companyId) ?? null;
}

type BatchInput = {
  id?: string;
  productId: string;
  batchCode: string;
  quantity: number;
  expiryDate?: string;
  manufacturingDate?: string;
  notes?: string;
};

export async function upsertProductBatch(companyId: string, input: BatchInput) {
  const db = await readDatabase();

  if (input.id) {
    const idx = db.productBatches.findIndex((b) => b.id === input.id && b.companyId === companyId);
    if (idx === -1) throw new Error("Lote nao encontrado.");
    db.productBatches[idx] = {
      ...db.productBatches[idx],
      batchCode: input.batchCode.trim(),
      quantity: input.quantity,
      expiryDate: input.expiryDate || undefined,
      manufacturingDate: input.manufacturingDate || undefined,
      notes: input.notes?.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
  } else {
    const now = new Date().toISOString();
    db.productBatches.push({
      id: crypto.randomUUID(),
      companyId,
      productId: input.productId,
      batchCode: input.batchCode.trim(),
      quantity: input.quantity,
      expiryDate: input.expiryDate || undefined,
      manufacturingDate: input.manufacturingDate || undefined,
      notes: input.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });
  }

  await writeDatabase(db);
}

export async function addBatchQuantity(companyId: string, batchId: string, quantity: number) {
  const db = await readDatabase();
  const batch = db.productBatches.find((b) => b.id === batchId && b.companyId === companyId);
  if (!batch) throw new Error("Lote nao encontrado.");
  batch.quantity += quantity;
  batch.updatedAt = new Date().toISOString();
  await writeDatabase(db);
  return batch;
}

export async function removeBatchQuantity(companyId: string, batchId: string, quantity: number) {
  const db = await readDatabase();
  const batch = db.productBatches.find((b) => b.id === batchId && b.companyId === companyId);
  if (!batch) throw new Error("Lote nao encontrado.");
  if (batch.quantity < quantity) throw new Error("Quantidade insuficiente no lote.");
  batch.quantity -= quantity;
  batch.updatedAt = new Date().toISOString();
  await writeDatabase(db);
  return batch;
}

// -------- Product Serials --------

export async function listSerialsByProduct(companyId: string, productId: string) {
  const db = await readDatabase();
  return db.productSerials
    .filter((s) => s.companyId === companyId && s.productId === productId)
    .sort((a, b) => a.serialNumber.localeCompare(b.serialNumber));
}

export async function getSerialById(companyId: string, serialId: string) {
  const db = await readDatabase();
  return db.productSerials.find((s) => s.id === serialId && s.companyId === companyId) ?? null;
}

type SerialInput = {
  id?: string;
  productId: string;
  serialNumber: string;
  batchId?: string;
  notes?: string;
};

export async function registerProductSerial(companyId: string, input: SerialInput) {
  const db = await readDatabase();

  const duplicate = db.productSerials.find(
    (s) => s.companyId === companyId && s.serialNumber.toLowerCase() === input.serialNumber.trim().toLowerCase(),
  );
  if (duplicate) throw new Error("Numero de serie ja registrado.");

  const now = new Date().toISOString();
  db.productSerials.push({
    id: crypto.randomUUID(),
    companyId,
    productId: input.productId,
    serialNumber: input.serialNumber.trim(),
    batchId: input.batchId || undefined,
    status: "IN_STOCK",
    movementId: undefined,
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  });

  await writeDatabase(db);
}

export async function updateSerialStatus(
  companyId: string,
  serialId: string,
  status: "IN_STOCK" | "SOLD" | "RETURNED" | "LOST",
  movementId?: string,
) {
  const db = await readDatabase();
  const serial = db.productSerials.find((s) => s.id === serialId && s.companyId === companyId);
  if (!serial) throw new Error("Serial nao encontrado.");
  serial.status = status;
  serial.movementId = movementId || undefined;
  serial.updatedAt = new Date().toISOString();
  await writeDatabase(db);
  return serial;
}

export async function getAvailableSerials(companyId: string, productId: string) {
  const db = await readDatabase();
  return db.productSerials.filter(
    (s) => s.companyId === companyId && s.productId === productId && s.status === "IN_STOCK",
  );
}
