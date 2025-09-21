import { PrismaClient } from "@prisma/client";

export const slugifyKey = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

export async function ensureSpecAttribute(
  tx: PrismaClient,
  label: string,
  unit?: string,
) {
  const key = slugifyKey(label); // e.g. "suction_power"
  const existing = await tx.specAttribute.findUnique({ where: { key } });
  if (existing) return existing.id;

  const created = await tx.specAttribute.create({
    data: { key, label, unit: unit || null, type: "STRING" },
  });
  return created.id;
}
