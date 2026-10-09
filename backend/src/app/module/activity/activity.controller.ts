import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ActivityService } from "./activity.service";
import httpStatus from "http-status";

const getOrganizationActivities = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const result = await ActivityService.getOrganizationActivities(req.params.organizationId as string, req.user!, req.query);

  sendResponse(res, { 
    success: true,
    statusCode: httpStatus.OK,
    message: "Activities retrieved successfully",
    data: result.data,
    meta: result.meta 
  });
});

const getEntityActivities = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const result = await ActivityService.getEntityActivities(req.params.organizationId as string, req.params.entityType as string, req.params.entityId as string, req.user!, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Activities retrieved successfully",
    data: result.data,
    meta: result.meta 
  });
});

const getGlobalActivities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ActivityService.getGlobalActivities(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Global activities retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});

export const ActivityController = {
  getOrganizationActivities,
  getEntityActivities,
  getGlobalActivities
};
