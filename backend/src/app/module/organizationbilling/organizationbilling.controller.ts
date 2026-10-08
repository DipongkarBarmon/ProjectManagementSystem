import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OrganizationBillingService } from "./organizationbilling.service";
import httpStatus from "http-status";

const getBillingOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationBillingService.getBillingOverview(req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Billing overview retrieved", data: result });
});

const getUsage = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationBillingService.getUsage(req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Usage retrieved", data: result });
});

const getInvoices = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationBillingService.getInvoices(req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Invoices retrieved", data: result });
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationBillingService.getPayments(req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payments retrieved", data: result });
});



const requestUpgrade = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationBillingService.requestUpgrade(req.params.organizationId as string, req.body, req.user!.userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Upgrade requested", data: result });
});

const requestDowngrade = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationBillingService.requestDowngrade(req.params.organizationId as string, req.body, req.user!.userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Downgrade requested", data: result });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationBillingService.cancelSubscription(req.params.organizationId as string, req.user!.userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Subscription cancelled", data: result });
});

const resumeSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationBillingService.resumeSubscription(req.params.organizationId as string, req.user!.userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Subscription resumed", data: result });
});

export const OrganizationBillingController = {
  getBillingOverview,
  getUsage,
  getInvoices,
  getPayments,
  requestUpgrade,
  requestDowngrade,
  cancelSubscription,
  resumeSubscription,
};
