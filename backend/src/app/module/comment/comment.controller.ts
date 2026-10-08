import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CommentService } from "./comment.service";
import httpStatus from "http-status";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentService.createComment(req.params.taskId as string, req.body, req.user!, req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Comment created successfully", data: result });
});

const getComments = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentService.getComments(req.params.taskId as string, req.user!, req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Comments retrieved successfully", data: result });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentService.updateComment(req.params.commentId as string, req.body, req.user!, req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Comment updated successfully", data: result });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentService.deleteComment(req.params.commentId as string, req.user!, req.params.organizationId as string);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Comment deleted successfully", data: result });
});

export const CommentController = {
  createComment,
  getComments,
  updateComment,
  deleteComment
};
