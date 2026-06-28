"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canManageCatalog, canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import { registerInventoryMovement, upsertCategory, upsertProduct } from "@/lib/store/database";
import { categorySchema, inventoryMovementSchema, productSchema } from "@/lib/validation";

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
    sku: formData.get("sku"),
    categoryId: formData.get("categoryId"),
    unit: formData.get("unit"),
    minimumStock: formData.get("minimumStock"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect(`/products/new?error=Preencha%20todos%20os%20campos%20obrigatorios%20do%20produto.`);
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

