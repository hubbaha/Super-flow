import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth-constants";

type AdminToken = JwtPayload & { email?: string };

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

function parseBearerToken(authHeader: string | null | undefined) {
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export function verifyAdminToken(token: string | null | undefined): AdminToken | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as AdminToken;
  } catch {
    return null;
  }
}

export function getAdminTokenFromRequest(req: NextRequest) {
  const authHeaderToken = parseBearerToken(req.headers.get("authorization"));
  if (authHeaderToken) return authHeaderToken;
  return req.cookies.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

export function verifyAdminRequest(req: NextRequest): AdminToken | null {
  return verifyAdminToken(getAdminTokenFromRequest(req));
}

