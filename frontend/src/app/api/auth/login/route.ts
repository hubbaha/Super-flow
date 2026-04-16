import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

type Body = { email: string; password: string };

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@catalog.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

  if (body.email !== adminEmail || body.password !== adminPassword) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ email: body.email }, JWT_SECRET, { expiresIn: "1d" });
  return Response.json({ token }, { status: 200 });
}

