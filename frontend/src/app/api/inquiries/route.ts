import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend"; // ← add this

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const inquiryTo = process.env.INQUIRY_TO_EMAIL;
  if (process.env.RESEND_API_KEY && inquiryTo) {
    // Best-effort email notification. Inquiry creation should not fail
    // if email provider is misconfigured or temporarily unavailable.
    await resend.emails
      .send({
        from: "Inquiries <onboarding@resend.dev>",
        to: inquiryTo,
        replyTo: body.email,
        subject: `New Inquiry from ${body.name}`,
        html: `
          <h2>New Inquiry</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Buyer Type:</strong> ${body.buyerType}</p>
          <p><strong>Message:</strong><br/>${body.message}</p>
        `,
      })
      .catch((error) => {
        console.error("Failed to send inquiry email", error);
      });
  }

  return Response.json(inquiry, { status: 201 });
}