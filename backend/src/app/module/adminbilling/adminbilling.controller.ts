import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminBillingService } from "./adminbilling.service";
import httpStatus from "http-status";
import config from "../../config";

const getPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminBillingService.getPlans();
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Plans retrieved", data: result });
});

const createPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminBillingService.createPlan(req.body);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Plan created", data: result });
});

const updatePlan = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminBillingService.updatePlan(String(req.params.planId), req.body);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Plan updated", data: result });
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
  const destination = result.success
    ? "payment/success"
    : result.outcome === "cancelled"
      ? "payment/cancelled"
      : "payment/failed";
  const query = new URLSearchParams({
    paymentID: paymentID as string,
    message: result.message,
  });
  if (result.success) query.set("plan", result.planName || "Pro");

  res.redirect(`${config.frontend_url}/${destination}?${query.toString()}`);
});

export const AdminBillingController = {
  getPlans,
  createPlan,
  updatePlan,
  getAllSubscriptions,
  getPendingPayments,
  getAllPayments,
  getPaymentById,
  bkashCallback,
};
