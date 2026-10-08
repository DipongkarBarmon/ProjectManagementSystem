import { z } from "zod";
import { BillingInterval } from "../../../../generated/prisma/enums";



export const upgradePlanSchema = z.object({
  body: z.object({
    planId: z.string().min(1, "Plan ID is required"),
    interval: z.nativeEnum(BillingInterval).optional(),
  }),
});
