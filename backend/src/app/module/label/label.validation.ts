import { z } from "zod";

export const createLabelSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50),
    color: z.string().max(20).optional(),
  }),
});

export const updateLabelSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    color: z.string().max(20).optional(),
  }),
});

export const assignLabelSchema = z.object({
  body: z.object({
    taskId: z.string().uuid(),
  }),
});
