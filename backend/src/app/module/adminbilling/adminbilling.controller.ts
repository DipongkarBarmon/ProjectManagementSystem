import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminBillingService } from "./adminbilling.service";
import httpStatus from "http-status";

const getPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminBillingService.getPlans();
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Plans retrieved", data: result });
});

const getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminBillingService.getAllSubscriptions();
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Subscriptions retrieved", data: result });
});

const getPendingPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminBillingService.getPendingPayments();
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Pending payments retrieved", data: result });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminBillingService.getPaymentById(req.params.paymentId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment retrieved", data: result });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminBillingService.getAllPayments();
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "All payments retrieved", data: result });
});



const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  const { paymentID, status } = req.query;
  const result = await AdminBillingService.executeBkashCallback(paymentID as string, status as string);
  // Assuming frontend URL in config
  if (result.success) {
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: result.message, data: result });
  } else {
    sendResponse(res, { success: false, statusCode: httpStatus.BAD_REQUEST, message: result.message, data: result });
  }
});

export const AdminBillingController = {
  getPlans,
  getAllSubscriptions,
  getPendingPayments,
  getAllPayments,
  getPaymentById,
  bkashCallback,
};
