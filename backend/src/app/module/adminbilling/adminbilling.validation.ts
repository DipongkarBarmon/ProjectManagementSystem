import { z } from "zod";

const nullableLimit = z.number().int().nonnegative().nullable().optional();

export const createPlanSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(80),
    description: z.string().trim().max(500).optional(),
    priceMonthly: z.number().nonnegative(),
    priceYearly: z.number().nonnegative(),
    currency: z.literal("BDT").default("BDT"),
    maxMembers: nullableLimit,
    maxTeams: nullableLimit,
    maxProjects: nullableLimit,
    maxStorageBytes: z.coerce.bigint().nonnegative().nullable().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updatePlanSchema = z.object({
  body: createPlanSchema.shape.body.partial().refine(
    (value) => value.currency === undefined || value.currency === "BDT",
    "Only BDT plans are supported by the bKash checkout",
  ),
});
