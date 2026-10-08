import { TaskStatus, Priority } from "../../../../generated/prisma/enums";

export interface ICreateTaskPayload {
  sprintId?: string;
  parentTaskId?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  dueDate?: string;
  estimatedHours?: number;
}

export interface IUpdateTaskPayload extends Partial<ICreateTaskPayload> {}
