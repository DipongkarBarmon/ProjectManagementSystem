import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AttachmentService } from "./attachment.service";
import httpStatus from "http-status";

const uploadAttachments = catchAsync(async (req: Request, res: Response) => {
  try {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new Error("Files are required");
  }
  const result = await AttachmentService.uploadAttachments(req.params.taskId as string, req.files as Express.Multer.File[], req.user!, req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Attachments uploaded successfully", data: result });
  } catch (err) {
    console.error('Upload error:', err);
    sendResponse(res, { success: false, statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: (err as Error).message || 'Upload failed', data: null });
  }
});

const getAttachments = catchAsync(async (req: Request, res: Response) => {
  const result = await AttachmentService.getAttachments(req.params.taskId as string, req.user!, req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Attachments retrieved successfully", data: result });
});

const deleteAttachment = catchAsync(async (req: Request, res: Response) => {
  const result = await AttachmentService.deleteAttachment(req.params.attachmentId as string, req.user!, req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Attachment deleted successfully", data: result });
});

export const AttachmentController = {
  uploadAttachments,
  getAttachments,
  deleteAttachment
};
