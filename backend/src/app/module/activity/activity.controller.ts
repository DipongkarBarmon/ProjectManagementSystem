import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ActivityService } from "./activity.service";
import httpStatus from "http-status";

const getOrganizationActivities = catchAsync(async (req: Request, res: Response,next:NextFunction) => {

  const result = await ActivityService.getOrganizationActivities(req.params.organizationId as string, req.user!);

  sendResponse(res, { 
    success: true,
    statusCode: httpStatus.OK,
    message: "Activities retrieved successfully",
    data: result 
  });
});

const getEntityActivities = catchAsync(async (req: Request, res: Response,next:NextFunction) => {

  const result = await ActivityService.getEntityActivities(req.params.organizationId as string, req.params.entityType as string, req.params.entityId as string, req.user!);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Activities retrieved successfully",
    data: result });
});

export const ActivityController = {
  getOrganizationActivities,
  getEntityActivities
};
