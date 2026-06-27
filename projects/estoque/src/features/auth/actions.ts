"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/auth";
import { loginSchema } from "@/lib/validation";

export async function loginAction(formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    redirect("/login?error=Preencha%20email%20e%20senha%20validos.");
  }

  const session = await createSession(result.data.email, result.data.password);

  if (!session) {
    redirect("/login?error=Credenciais%20invalidas.");
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login?success=Sessao%20encerrada.");
}
