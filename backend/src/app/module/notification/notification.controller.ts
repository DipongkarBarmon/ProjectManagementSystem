import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { NotificationService } from "./notification.service";
import httpStatus from "http-status";

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.getMyNotifications(req.params.organizationId as string, req.user!);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Notifications retrieved successfully", data: result });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.markAsRead(req.params.organizationId as string, req.body.notificationIds, req.user!);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Notifications marked as read", data: result });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.markAllAsRead(req.params.organizationId as string, req.user!);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "All notifications marked as read", data: result });
});

export const NotificationController = {
  getMyNotifications,
  markAsRead,
  markAllAsRead
};
