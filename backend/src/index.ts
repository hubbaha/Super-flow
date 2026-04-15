import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 4000);
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

type JwtPayload = { email: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  try {
    jwt.verify(token, JWT_SECRET) as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

app.get("/api/categories", async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });
  res.json(categories);
});

app.get("/api/categories/:slug/products", async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { slug: req.params.slug },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  res.json({ category, products });
});

app.get("/api/products/:category/:slug", async (req, res) => {
  const product = await prisma.product.findFirst({
    where: {
      slug: req.params.slug,
      category: { slug: req.params.category },
    },
    include: {
      category: true,
      specs: true,
      tables: true,
    },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.post("/api/inquiries", async (req, res) => {
  const { name, email, message, buyerType } = req.body as {
    name: string;
    email: string;
    message: string;
    buyerType: string;
  };

  const inquiry = await prisma.inquiry.create({
    data: { name, email, message, buyerType },
  });

  res.status(201).json(inquiry);
});

app.get("/api/admin/inquiries", requireAdmin, async (_req, res) => {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(inquiries);
});

app.get("/api/admin/products", requireAdmin, async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true, specs: true, tables: true },
    orderBy: { id: "desc" },
  });
  res.json(products);
});

app.post("/api/admin/products", requireAdmin, async (req, res) => {
  const {
    name,
    description,
    image,
    categoryId,
    specs,
    tables,
  }: {
    name: string;
    description: string;
    image?: string;
    categoryId: number;
    specs: { key: string; value: string }[];
    tables: { size: string; diameter: string; thickness: string }[];
  } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      slug: slugify(name),
      description,
      image,
      categoryId: Number(categoryId),
      specs: { create: specs ?? [] },
      tables: { create: tables ?? [] },
    },
    include: { specs: true, tables: true, category: true },
  });

  res.status(201).json(product);
});

app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, image, categoryId, specs, tables } = req.body;

  await prisma.specification.deleteMany({ where: { productId: id } });
  await prisma.technicalTable.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      description,
      image,
      categoryId: Number(categoryId),
      specs: { create: specs ?? [] },
      tables: { create: tables ?? [] },
    },
    include: { specs: true, tables: true, category: true },
  });

  res.json(product);
});

app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
