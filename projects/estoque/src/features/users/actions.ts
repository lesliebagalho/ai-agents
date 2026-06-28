"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canManageUsers, requireSessionContext } from "@/lib/auth/auth";
import { upsertUserForCompany } from "@/lib/store/database";
import { userSchema } from "@/lib/validation";

export async function saveUserAction(formData: FormData) {
  const session = await requireSessionContext();
  const userId = formData.get("id");
  const isEditing = userId && String(userId).trim().length > 0;
  const basePath = isEditing ? `/users/${userId}` : "/users/new";

  if (!canManageUsers(session.activeRole)) {
    redirect(`${basePath}?error=Seu%20perfil%20nao%20pode%20gerenciar%20usuarios.`);
  }

  const parsed = userSchema.safeParse({
    id: userId,
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect(`${basePath}?error=Preencha%20os%20campos%20obrigatorios%20do%20usuario.`);
  }

  try {
    await upsertUserForCompany(session.activeCompany.id, parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar o usuario.";
    redirect(`${basePath}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/users");
  revalidatePath("/dashboard");
  redirect("/users?success=Usuario%20salvo%20com%20sucesso.");
}
