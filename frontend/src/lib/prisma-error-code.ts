/** Prisma throws objects with a string `code` (e.g. P2002). Avoid importing `Prisma` when tooling cannot resolve it. */
export function prismaErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("code" in error)) return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}
