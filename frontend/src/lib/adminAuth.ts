import jwt, { JwtPayload } from "jsonwebtoken";

type AdminToken = JwtPayload & { email?: string };

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

function parseBearerToken(authHeader: string | null | undefined) {
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export function verifyAdminToken(authHeader: string | null | undefined): AdminToken | null {
  const token = parseBearerToken(authHeader);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as AdminToken;
  } catch {
    return null;
  }
}

