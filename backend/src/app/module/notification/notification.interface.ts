import { NotificationType } from "../../../../generated/prisma/enums";

export interface ICreateNotificationPayload {
  userId: string;
  organizationId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  metadata?: any;
}
