import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByCredentials, getCompaniesForUser, getUserById } from "@/lib/store/database";
import type { Company, User, UserCompany } from "@/types/domain";

const SESSION_COOKIE = "estoque_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  activeCompanyId: string;
};

export type SessionContext = {
  user: User;
  activeCompany: Company;
  activeRole: UserCompany["role"];
  memberships: Array<{
    company: Company;
    role: UserCompany["role"];
  }>;
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
    if (!parsed.userId || !parsed.activeCompanyId) {
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

  const companies = await getCompaniesForUser(user.id);
  const firstMembership = companies[0];

  if (!firstMembership) {
    return null;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession({
    userId: user.id,
    activeCompanyId: firstMembership.company.id,
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return {
    user,
    activeCompany: firstMembership.company,
  };
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function setActiveCompany(companyId: string) {
  const cookieStore = await cookies();
  const current = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!current) {
    return false;
  }

  const memberships = await getCompaniesForUser(current.userId);
  const allowed = memberships.some((item) => item.company.id === companyId);

  if (!allowed) {
    return false;
  }

  cookieStore.set(SESSION_COOKIE, encodeSession({
    userId: current.userId,
    activeCompanyId: companyId,
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return true;
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

  const memberships = await getCompaniesForUser(user.id);
  if (memberships.length === 0) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  const activeMembership = memberships.find((item) => item.company.id === session.activeCompanyId) ?? memberships[0];

  if (activeMembership.company.id !== session.activeCompanyId) {
    cookieStore.set(SESSION_COOKIE, encodeSession({
      userId: user.id,
      activeCompanyId: activeMembership.company.id,
    }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }

  return {
    user,
    activeCompany: activeMembership.company,
    activeRole: activeMembership.role,
    memberships: memberships.map((item) => ({
      company: item.company,
      role: item.role,
    })),
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
  return role === "ADMIN" || role === "MANAGER";
}

export function canRegisterMovements(role: UserCompany["role"]) {
  return role === "ADMIN" || role === "MANAGER" || role === "OPERATOR";
}

export function canManageUsers(role: UserCompany["role"]) {
  return role === "ADMIN" || role === "MANAGER";
}
