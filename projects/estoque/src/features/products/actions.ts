"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canManageCatalog, canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import { closeInventoryCount, deleteLocation, listBrandsByCompany, listProductsByCompany, registerInventoryMovement, startInventoryCount, updateInventoryCountItem, upsertBrand, upsertCategory, upsertLocation, upsertProduct, upsertSupplier } from "@/lib/store/database";
import { brandSchema, categorySchema, inventoryMovementSchema, locationSchema, productSchema, supplierSchema } from "@/lib/validation";

export async function saveCategoryAction(formData: FormData) {
  const session = await requireSessionContext();
  const categoryId = formData.get("id");
  const isEditing = categoryId && String(categoryId).trim().length > 0;
  const basePath = isEditing ? `/categories/${categoryId}` : "/categories/new";

  if (!canManageCatalog(session.activeRole)) {
    redirect(`${basePath}?error=Seu%20perfil%20nao%20pode%20alterar%20categorias.`);
  }

  const parsed = categorySchema.safeParse({
    id: categoryId,
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirect(`${basePath}?error=Preencha%20os%20campos%20obrigatorios%20da%20categoria.`);
  }

  try {
    await upsertCategory(session.activeCompany.id, parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar a categoria.";
    redirect(`${basePath}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/categories");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/categories?success=Categoria%20salva%20com%20sucesso.");
}

export async function saveProductAction(formData: FormData) {
  const session = await requireSessionContext();
  if (!canManageCatalog(session.activeRole)) {
    redirect("/products?error=Seu%20perfil%20nao%20pode%20alterar%20produtos.");
  }

  const parsed = productSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    code: formData.get("code"),
    sku: formData.get("sku"),
    barcode: formData.get("barcode"),
    brandId: formData.get("brandId"),
    categoryId: formData.get("categoryId"),
    costPrice: formData.get("costPrice"),
    unit: formData.get("unit"),
    minimumStock: formData.get("minimumStock"),
    maximumStock: formData.get("maximumStock"),
    locationId: formData.get("locationId"),
    weight: formData.get("weight"),
    dimensions: formData.get("dimensions"),
    imageUrl: formData.get("imageUrl"),
    expiryDate: formData.get("expiryDate"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    const productId = formData.get("id");
    const basePath = productId ? `/products/${productId}` : "/products/new";
    redirect(`${basePath}?error=Preencha%20todos%20os%20campos%20obrigatorios%20do%20produto.`);
  }

  try {
    await upsertProduct(session.activeCompany.id, parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar o produto.";
    redirect(`/products?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products?success=Produto%20salvo%20com%20sucesso.");
}

export async function saveInventoryMovementAction(formData: FormData) {
  const session = await requireSessionContext();
  if (!canRegisterMovements(session.activeRole)) {
    redirect("/inventory/new?error=Seu%20perfil%20nao%20pode%20registrar%20movimentacoes.");
  }

  const parsed = inventoryMovementSchema.safeParse({
    type: formData.get("type"),
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason"),
    note: formData.get("note"),
    referenceCode: formData.get("referenceCode"),
  });

  if (!parsed.success) {
    redirect(`/inventory/new?error=Preencha%20os%20dados%20da%20movimentacao%20corretamente.`);
  }

  try {
    await registerInventoryMovement(session.activeCompany.id, session.user.id, parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel registrar a movimentacao.";
    redirect(`/inventory/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/inventory");
  revalidatePath("/inventory/new");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/inventory?success=Movimentacao%20registrada%20com%20sucesso.");
}

export async function exportProductsCsvAction() {
  const session = await requireSessionContext();

  if (!canManageCatalog(session.activeRole)) {
    return { error: "Sem permissao para exportar produtos." };
  }

  const [products, brands] = await Promise.all([
    listProductsByCompany(session.activeCompany.id),
    listBrandsByCompany(session.activeCompany.id),
  ]);

  const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.name]));

  const headers = [
    "Codigo",
    "SKU",
    "Codigo de Barras",
    "Nome",
    "Descricao",
    "Categoria",
    "Marca",
    "Unidade",
    "Preco de Custo",
    "Estoque Minimo",
    "Estoque Maximo",
    "Localizacao",
    "Peso",
    "Dimensoes",
    "Status",
  ];

  const rows = products.map((product) => [
    product.code || "",
    product.sku || "",
    product.barcode || "",
    product.name,
    product.description || "",
    product.categoryId || "",
    product.brandId ? brandMap[product.brandId] || "" : "",
    product.unit,
    product.costPrice != null ? String(product.costPrice) : "",
    product.minimumStock != null ? String(product.minimumStock) : "",
    product.maximumStock != null ? String(product.maximumStock) : "",
    product.locationId || "",
    product.weight != null ? String(product.weight) : "",
    product.dimensions || "",
    product.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  const bom = "\uFEFF";
  return { csv: bom + csvContent, filename: `produtos-${session.activeCompany.slug}.csv` };
}

export async function importProductsFromCsvAction(formData: FormData) {
  const session = await requireSessionContext();

  if (!canManageCatalog(session.activeRole)) {
    return { imported: 0, errors: ["Sem permissao para importar produtos."] };
  }

  const csv = String(formData.get("csv") ?? "").trim();
  if (!csv) {
    return { imported: 0, errors: ["Arquivo vazio."] };
  }

  const lines = csv.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    return { imported: 0, errors: ["Arquivo sem dados alem do cabecalho."] };
  }

  // Remove BOM se presente
  lines[0] = lines[0].replace(/^\uFEFF/, "");

  const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim());

  const nameIdx = headers.findIndex((h) => h.toLowerCase().includes("nome"));
  const unitIdx = headers.findIndex((h) => h.toLowerCase().includes("unidade"));
  const skuIdx = headers.findIndex((h) => h.toLowerCase().includes("sku"));
  const codeIdx = headers.findIndex((h) => h.toLowerCase().includes("codigo"));
  const statusIdx = headers.findIndex((h) => h.toLowerCase().includes("status"));

  if (nameIdx === -1) {
    return { imported: 0, errors: ["Cabecalho 'Nome' nao encontrado no CSV."] };
  }

  let imported = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.replace(/^"|"$/g, "").trim());

    const name = cols[nameIdx]?.trim();
    if (!name) {
      errors.push(`Linha ${i + 1}: Nome vazio, ignorado.`);
      continue;
    }

    const unit = (unitIdx !== -1 ? cols[unitIdx] : "UNIT") || "UNIT";
    const validUnits = ["UNIT", "BOX", "KG", "LITER", "METER"];
    const finalUnit = validUnits.includes(unit.toUpperCase()) ? unit.toUpperCase() : "UNIT";

    const status = (statusIdx !== -1 ? cols[statusIdx] : "ACTIVE") || "ACTIVE";
    const finalStatus = status.toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await upsertProduct(session.activeCompany.id, {
        name,
        sku: skuIdx !== -1 ? cols[skuIdx] : undefined,
        code: codeIdx !== -1 ? cols[codeIdx] : undefined,
        unit: finalUnit as any,
        status: finalStatus as any,
      });
      imported++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      errors.push(`Linha ${i + 1} (${name}): ${msg}`);
    }
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");

  return { imported, errors };
}

export async function saveBrandAction(formData: FormData) {
  const session = await requireSessionContext();
  const brandId = formData.get("id");
  const isEditing = brandId && String(brandId).trim().length > 0;
  const basePath = isEditing ? `/brands/${brandId}` : "/brands/new";

  if (!canManageCatalog(session.activeRole)) {
    redirect(`${basePath}?error=Seu%20perfil%20nao%20pode%20alterar%20marcas.`);
  }

  const parsed = brandSchema.safeParse({
    id: brandId,
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirect(`${basePath}?error=Preencha%20os%20campos%20obrigatorios%20da%20marca.`);
  }

  try {
    await upsertBrand(session.activeCompany.id, parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar a marca.";
    redirect(`${basePath}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/brands");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/brands?success=Marca%20salva%20com%20sucesso.");
}

export async function saveLocationAction(formData: FormData) {
  const session = await requireSessionContext();
  const locationId = formData.get("id");
  const isEditing = locationId && String(locationId).trim().length > 0;
  const basePath = isEditing ? `/locations/${locationId}` : "/locations/new";

  if (!canManageCatalog(session.activeRole)) {
    redirect(`${basePath}?error=Seu%20perfil%20nao%20pode%20alterar%20localizacoes.`);
  }

  const parsed = locationSchema.safeParse({
    id: locationId,
    name: formData.get("name"),
    parentId: formData.get("parentId"),
    level: formData.get("level"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    redirect(`${basePath}?error=Preencha%20os%20campos%20obrigatorios%20da%20localizacao.`);
  }

  try {
    await upsertLocation(session.activeCompany.id, parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar a localizacao.";
    redirect(`${basePath}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/locations");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/locations?success=Localizacao%20salva%20com%20sucesso.");
}

export async function deleteLocationAction(formData: FormData) {
  const session = await requireSessionContext();
  const locationId = formData.get("id");

  if (!canManageCatalog(session.activeRole)) {
    redirect(`/locations?error=Sem%20permissao.`);
  }

  if (!locationId || String(locationId).trim().length === 0) {
    redirect(`/locations?error=ID%20invalido.`);
  }

  try {
    await deleteLocation(session.activeCompany.id, String(locationId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel excluir.";
    redirect(`/locations?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/locations");
  revalidatePath("/products");
  redirect("/locations?success=Localizacao%20excluida.");
}

export async function saveSupplierAction(formData: FormData) {
  const session = await requireSessionContext();
  const supplierId = formData.get("id");
  const isEditing = supplierId && String(supplierId).trim().length > 0;
  const basePath = isEditing ? `/suppliers/${supplierId}` : "/suppliers/new";

  if (!canManageCatalog(session.activeRole)) {
    redirect(`${basePath}?error=Seu%20perfil%20nao%20pode%20alterar%20fornecedores.`);
  }

  const parsed = supplierSchema.safeParse({
    id: supplierId,
    name: formData.get("name"),
    cnpj: formData.get("cnpj"),
    contact: formData.get("contact"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect(`${basePath}?error=Preencha%20os%20campos%20obrigatorios%20do%20fornecedor.`);
  }

  try {
    await upsertSupplier(session.activeCompany.id, parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar o fornecedor.";
    redirect(`${basePath}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/suppliers");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/suppliers?success=Fornecedor%20salvo%20com%20sucesso.");
}

const EXIT_TYPES = ["EXIT", "SALE", "INTERNAL_CONSUMPTION", "LOSS", "BREAKAGE", "NEGATIVE_ADJUSTMENT"] as const;

export async function saveExitMovementAction(formData: FormData) {
  const session = await requireSessionContext();
  if (!canRegisterMovements(session.activeRole)) {
    redirect("/exits/new?error=Seu%20perfil%20nao%20pode%20registrar%20saidas.");
  }

  const rawType = formData.get("type");
  if (!EXIT_TYPES.includes(rawType as any)) {
    redirect("/exits/new?error=Tipo%20de%20saida%20invalido.");
  }

  const parsed = inventoryMovementSchema.safeParse({
    type: rawType,
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason"),
    note: formData.get("note"),
    referenceCode: formData.get("referenceCode"),
  });

  if (!parsed.success) {
    redirect("/exits/new?error=Preencha%20os%20dados%20da%20saida%20corretamente.");
  }

  try {
    await registerInventoryMovement(session.activeCompany.id, session.user.id, parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel registrar a saida.";
    redirect(`/exits/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/exits");
  revalidatePath("/exits/new");
  revalidatePath("/inventory");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/exits?success=Saida%20registrada%20com%20sucesso.");
}

export async function startInventoryCountAction(formData: FormData) {
  const session = await requireSessionContext();
  if (!canManageCatalog(session.activeRole)) {
    redirect("/inventory-counts?error=Sem%20permissao%20para%20iniciar%20inventario.");
  }

  const name = formData.get("name");
  if (!name || String(name).trim().length < 2) {
    redirect("/inventory-counts/new?error=Informe%20um%20nome%20para%20o%20inventario.");
  }

  try {
    await startInventoryCount(session.activeCompany.id, session.user.id, { name: String(name) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao iniciar inventario.";
    redirect(`/inventory-counts/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/inventory-counts");
  redirect("/inventory-counts?success=Inventario%20iniciado%20com%20sucesso.");
}

export async function updateInventoryCountItemAction(formData: FormData) {
  const session = await requireSessionContext();
  if (!canManageCatalog(session.activeRole)) {
    redirect("/inventory-counts?error=Sem%20permissao.");
  }

  const countId = formData.get("countId");
  const itemId = formData.get("itemId");
  const countedQuantity = formData.get("countedQuantity");
  const notes = formData.get("notes");

  if (!countId || !itemId || countedQuantity === null || countedQuantity === undefined) {
    redirect(`/inventory-counts/${countId}?error=Dados%20incompletos.`);
  }

  const qty = Number(String(countedQuantity).replace(",", "."));
  if (!Number.isFinite(qty) || qty < 0) {
    redirect(`/inventory-counts/${countId}?error=Quantidade%20invalida.`);
  }

  try {
    await updateInventoryCountItem(String(countId), String(itemId), qty, String(notes || ""));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar contagem.";
    redirect(`/inventory-counts/${countId}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath(`/inventory-counts/${countId}`);
  redirect(`/inventory-counts/${countId}?success=Item%20atualizado.`);
}

export async function closeInventoryCountAction(formData: FormData) {
  const session = await requireSessionContext();
  if (!canManageCatalog(session.activeRole)) {
    redirect("/inventory-counts?error=Sem%20permissao.");
  }

  const countId = formData.get("countId");
  if (!countId) {
    redirect("/inventory-counts?error=ID%20invalido.");
  }

  try {
    await closeInventoryCount(session.activeCompany.id, String(countId), session.user.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao fechar inventario.";
    redirect(`/inventory-counts/${countId}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/inventory-counts");
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  redirect("/inventory-counts?success=Inventario%20fechado%20e%20ajustes%20aplicados.");
}

