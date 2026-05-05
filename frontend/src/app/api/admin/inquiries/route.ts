import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const admin = verifyAdminRequest(req);
  if (!admin) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(inquiries);
}

