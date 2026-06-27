"use server";

import { redirect } from "next/navigation";
import { setActiveCompany } from "@/lib/auth/auth";

export async function switchCompanyAction(formData: FormData) {
  const companyId = String(formData.get("companyId") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "/dashboard");
  const changed = await setActiveCompany(companyId);

  if (!changed) {
    redirect("/dashboard?error=Empresa%20invalida%20para%20o%20usuario.");
  }

  redirect(returnTo);
}
