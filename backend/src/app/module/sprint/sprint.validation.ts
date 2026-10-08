import { z } from "zod";
import { SprintStatus } from "../../../../generated/prisma/enums";

 const createSprintZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name must be at least 1 character").max(255),
    goal: z.string().max(1000).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

const updateSprintZodSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    goal: z.string().max(1000).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.nativeEnum(SprintStatus).optional(),
  }),
});


export const SprintValidation = {
     createSprintZodSchema,
      updateSprintZodSchema
};