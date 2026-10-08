import { z } from "zod";
import { TaskStatus, Priority } from "../../../../generated/prisma/enums";

export const createTaskSchema = z.object({
  body: z.object({
    sprintId: z.string().uuid().optional(),
    parentTaskId: z.string().uuid().optional(),
    title: z.string().min(1).max(255),
    description: z.string().max(2000).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    assigneeId: z.string().uuid().optional(),
    position: z.number().optional(),
    dueDate: z.string().datetime().optional(),
    estimatedHours: z.number().min(0).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    sprintId: z.string().uuid().optional().nullable(),
    parentTaskId: z.string().uuid().optional().nullable(),
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(2000).optional().nullable(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    assigneeId: z.string().uuid().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    position: z.number().optional(),
    estimatedHours: z.number().min(0).optional().nullable(),
  }),
});
