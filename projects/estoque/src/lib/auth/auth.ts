import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByCredentials, getCompanyById, getCompaniesForUser, getUserById, listUsersByCompany } from "@/lib/store/database";
import type { Company, User, UserCompany } from "@/types/domain";

const SESSION_COOKIE = "estoque_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  companyId: string;
};

export type SessionContext = {
  user: User;
  activeCompany: Company;
  activeRole: UserCompany["role"];
};

function encodeSession(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodeSession(value?: string | null): SessionPayload | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf-8")) as SessionPayload;
    if (!parsed.userId || !parsed.companyId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function createSession(email: string, password: string) {
  const user = await findUserByCredentials(email, password);

  if (!user) {
    return null;
  }

  // Busca a empresa do usuario atraves da relacao userCompanies
  const companies = await getCompaniesForUser(user.id);
  const membership = companies[0];

  if (!membership) {
    return null;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession({
    userId: user.id,
    companyId: membership.company.id,
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return {
    user,
    activeCompany: membership.company,
  };
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionContext(): Promise<SessionContext | null> {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return null;
  }

  const user = await getUserById(session.userId);
  if (!user) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  const company = await getCompanyById(session.companyId);
  if (!company) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  // Busca o role do usuario na empresa
  const users = await listUsersByCompany(company.id);
  const membership = users.find((u) => u.id === user.id);

  if (!membership) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return {
    user,
    activeCompany: company,
    activeRole: membership.membership.role,
  };
}

export async function requireSessionContext() {
  const session = await getSessionContext();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export function canManageCatalog(role: UserCompany["role"]) {
  return role === "ADMIN" || role === "SUPERVISOR";
}

export function canRegisterMovements(role: UserCompany["role"]) {
  return role === "ADMIN" || role === "SUPERVISOR" || role === "STORAGE_CLERK";
}

export function canManageUsers(role: UserCompany["role"]) {
  return role === "ADMIN";
}
