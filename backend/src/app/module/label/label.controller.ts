import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { LabelService } from "./label.service";
import httpStatus from "http-status";

const createLabel = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.createLabel(req.params.organizationId as string, req.body, req.user!);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Label created successfully", data: result });
});

const getAllLabels = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.getAllLabels(req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Labels retrieved successfully", data: result });
});

const updateLabel = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.updateLabel(req.params.organizationId as string, req.params.labelId as string, req.body, req.user!);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Label updated successfully", data: result });
});

const deleteLabel = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.deleteLabel(req.params.organizationId as string, req.params.labelId as string, req.user!);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Label deleted successfully", data: result });
});

const assignLabel = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.assignLabelToTask(req.params.organizationId as string, req.params.labelId as string, req.body, req.user!);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Label assigned successfully", data: result });
});

const removeLabel = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.removeLabelFromTask(req.params.organizationId as string, req.params.labelId as string, req.params.taskId as string, req.user!);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Label removed successfully", data: result });
});

export const LabelController = {
  createLabel,
  getAllLabels,
  updateLabel,
  deleteLabel,
  assignLabel,
  removeLabel
};
