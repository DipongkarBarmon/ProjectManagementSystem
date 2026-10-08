import { SprintStatus } from "../../../../generated/prisma/enums";

export interface ICreateSprintPayload {
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
}

export interface IUpdateSprintPayload {
  name?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  status?: SprintStatus;
}
