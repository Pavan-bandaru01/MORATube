import { Category as PrismaCategory } from "@prisma/client";

const SLUG_TO_ENUM: Record<string, PrismaCategory> = {
  "money-awareness": PrismaCategory.MONEY_AWARENESS,
  "ai-tools": PrismaCategory.AI_TOOLS,
  finance: PrismaCategory.FINANCE,
  investing: PrismaCategory.INVESTING,
  "debt-escape": PrismaCategory.DEBT_ESCAPE,
  "student-growth": PrismaCategory.STUDENT_GROWTH,
  technology: PrismaCategory.TECHNOLOGY,
  motivation: PrismaCategory.MOTIVATION,
  "wealth-habits": PrismaCategory.MOTIVATION,
  "money-behavior": PrismaCategory.MONEY_AWARENESS,
};

const CATEGORY_GRADIENTS: Record<PrismaCategory, string> = {
  [PrismaCategory.ALL]: "from-zinc-800 to-black",
  [PrismaCategory.MONEY_AWARENESS]: "from-amber-900 to-black",
  [PrismaCategory.AI_TOOLS]: "from-blue-900 to-black",
  [PrismaCategory.FINANCE]: "from-red-900 to-black",
  [PrismaCategory.INVESTING]: "from-emerald-900 to-black",
  [PrismaCategory.DEBT_ESCAPE]: "from-orange-900 to-black",
  [PrismaCategory.STUDENT_GROWTH]: "from-purple-900 to-black",
  [PrismaCategory.TECHNOLOGY]: "from-cyan-900 to-black",
  [PrismaCategory.MOTIVATION]: "from-pink-900 to-black",
};

export function resolveCategoryParam(
  param?: string | null
): PrismaCategory | undefined {
  if (!param || param.toLowerCase() === "all") return undefined;

  const normalized = param.toUpperCase().replace(/-/g, "_");
  if (Object.values(PrismaCategory).includes(normalized as PrismaCategory)) {
    return normalized as PrismaCategory;
  }

  return SLUG_TO_ENUM[param.toLowerCase()];
}

export function categoryToGradient(category: PrismaCategory): string {
  return CATEGORY_GRADIENTS[category] ?? "from-zinc-800 to-black";
}

export function categoryToSlug(category: PrismaCategory): string {
  return category.toLowerCase().replace(/_/g, "-");
}
