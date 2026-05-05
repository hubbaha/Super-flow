import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { verifyAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

/** Keeps uploads under typical serverless body limits (e.g. Vercel ~4.5 MB). */
const MAX_BYTES = 4 * 1024 * 1024;

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(req: NextRequest) {
  const admin = verifyAdminRequest(req);
  if (!admin) return Response.json({ message: "Invalid token" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ message: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ message: "No file uploaded" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ message: "Image must be 4 MB or smaller" }, { status: 400 });
  }

  const ext = MIME_EXT[file.type];
  if (!ext) {
    return Response.json(
      { message: "Allowed types: JPEG, PNG, WebP, or GIF" },
      { status: 400 },
    );
  }

  const filename = `${randomUUID()}${ext}`;
  const relativeDir = path.join("public", "uploads", "products");
  const absoluteDir = path.join(process.cwd(), relativeDir);
  await mkdir(absoluteDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(absoluteDir, filename), buffer);

  const url = `/uploads/products/${filename}`;
  return Response.json({ url }, { status: 201 });
}
