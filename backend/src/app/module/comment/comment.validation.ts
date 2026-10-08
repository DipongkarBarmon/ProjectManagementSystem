import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Content cannot be empty").max(5000),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(5000).optional(),
  }),
});
