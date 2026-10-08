import { z } from "zod";

export const markReadSchema = z.object({
  body: z.object({
    notificationIds: z.array(z.string().uuid()),
  }),
});
