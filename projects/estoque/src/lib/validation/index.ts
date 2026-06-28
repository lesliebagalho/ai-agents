import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(6),
});

export const categorySchema = z.object({
  id: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || undefined),
  name: z.string().trim().min(2, "Informe o nome da categoria."),
  description: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || undefined),
});

export const productSchema = z.object({
  id: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || undefined),
  name: z.string().trim().min(2, "Informe o nome do produto."),
  sku: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || undefined),
  categoryId: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || undefined),
  unit: z.enum(["UNIT", "BOX", "KG", "LITER", "METER"]),
  minimumStock: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((value) => {
      if (value === null || value === undefined || value === "") {
        return undefined;
      }

      const numeric = typeof value === "number" ? value : Number(String(value).replace(",", "."));
      return Number.isFinite(numeric) ? numeric : NaN;
    })
    .refine((value) => value === undefined || value >= 0, "Estoque minimo invalido."),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const inventoryMovementSchema = z
  .object({
    type: z.enum(["ENTRY", "EXIT", "ADJUSTMENT"]),
    productId: z.string().trim().min(1, "Selecione um produto."),
    quantity: z
      .union([z.string(), z.number()])
      .transform((value) => {
        const numeric = typeof value === "number" ? value : Number(String(value).replace(",", "."));
        return numeric;
      })
      .refine((value) => Number.isFinite(value) && value >= 0, "Quantidade invalida."),
    reason: z
      .string()
      .trim()
      .nullish()
      .transform((value) => value || undefined),
    note: z
      .string()
      .trim()
      .nullish()
      .transform((value) => value || undefined),
    referenceCode: z
      .string()
      .trim()
      .nullish()
      .transform((value) => value || undefined),
  })
  .superRefine((value, ctx) => {
    if (value.type === "ADJUSTMENT" && !value.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reason"],
        message: "Informe o motivo do ajuste.",
      });
    }

    if (value.quantity <= 0 && value.type !== "ADJUSTMENT") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quantity"],
        message: "Informe uma quantidade maior que zero.",
      });
    }
  });

export const userSchema = z.object({
  id: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || undefined),
  name: z.string().trim().min(2, "Informe o nome do usuario."),
  email: z.string().trim().email("Informe um email valido."),
  password: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || undefined),
  role: z.enum(["ADMIN", "MANAGER", "OPERATOR", "VIEWER"]),
  status: z.enum(["ACTIVE", "INVITED", "INACTIVE"]),
});
