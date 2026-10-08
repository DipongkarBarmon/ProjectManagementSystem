import { ActivityAction } from "../../../../generated/prisma/enums";

export interface ICreateActivityPayload {
  organizationId: string;
  actorId: string;
  action: ActivityAction;
  entityType: string;
  entityId: string;
  description?: string;
  metadata?: any;
}
