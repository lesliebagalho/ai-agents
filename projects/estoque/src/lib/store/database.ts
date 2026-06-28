import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { demoSeed } from "@/lib/store/seed";
import type {
  Category,
  Company,
  DemoDatabase,
  InventoryBalance,
  InventoryMovement,
  InventoryMovementWithRelations,
  MovementType,
  Product,
  User,
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
    products: raw.products ?? demoSeed.products,
    inventoryBalances: raw.inventoryBalances ?? demoSeed.inventoryBalances,
    inventoryMovements: raw.inventoryMovements ?? demoSeed.inventoryMovements,
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
    .filter((item): item is { company: Company; role: "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER" } => Boolean(item));
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
  role: "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER";
  status: "ACTIVE" | "INVITED" | "INACTIVE";
};

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
  brand?: string;
  categoryId?: string;
  costPrice?: number;
  unit: Product["unit"];
  minimumStock?: number;
  maximumStock?: number;
  location?: string;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  status: Product["status"];
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
            brand: input.brand?.trim() || undefined,
            categoryId: input.categoryId || undefined,
            costPrice: input.costPrice,
            unit: input.unit,
            minimumStock: input.minimumStock,
            maximumStock: input.maximumStock,
            location: input.location?.trim() || undefined,
            weight: input.weight,
            dimensions: input.dimensions?.trim() || undefined,
            imageUrl: input.imageUrl?.trim() || undefined,
            status: input.status,
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
      brand: input.brand?.trim() || undefined,
      categoryId: input.categoryId || undefined,
      costPrice: input.costPrice,
      unit: input.unit,
      minimumStock: input.minimumStock,
      maximumStock: input.maximumStock,
      location: input.location?.trim() || undefined,
      weight: input.weight,
      dimensions: input.dimensions?.trim() || undefined,
      imageUrl: input.imageUrl?.trim() || undefined,
      status: input.status,
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
