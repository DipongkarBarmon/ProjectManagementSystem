import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { ICreateNotificationPayload } from "./notification.interface";

export class NotificationService {
  static async createNotification(payload: ICreateNotificationPayload) {
    try {
      return await prisma.notification.create({
        data: {
          ...payload,
          metadata: payload.metadata ? JSON.parse(JSON.stringify(payload.metadata)) : undefined,
        }
      });
    } catch (error) {
      console.error("Failed to create notification", error);
    }
  }

  static async getMyNotifications(organizationId: string, user: RequestUser) {
    return await prisma.notification.findMany({
      where: { organizationId, userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  static async markAsRead(organizationId: string, notificationIds: string[], user: RequestUser) {
    return await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: user.userId,
        organizationId
      },
      data: {
        readAt: new Date(),
      }
    });
  }

  static async markAllAsRead(organizationId: string, user: RequestUser) {
    return await prisma.notification.updateMany({
      where: {
        userId: user.userId,
        organizationId,
        readAt: null
      },
      data: {
        readAt: new Date(),
      }
    });
  }
}
