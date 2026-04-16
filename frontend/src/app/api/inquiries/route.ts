import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type InquiryInput = {
  name: string;
  email: string;
  message: string;
  buyerType: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as InquiryInput | null;
  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.message !== "string" ||
    typeof body.buyerType !== "string"
  ) {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (!body.name.trim() || !body.email.trim() || !body.message.trim() || !body.buyerType.trim()) {
    return Response.json({ message: "Missing required fields" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: body.name,
      email: body.email,
      message: body.message,
      buyerType: body.buyerType,
    },
  });

  return Response.json(inquiry, { status: 201 });
}

