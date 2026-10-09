import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserService } from "./user.service";

const getUserOrganizations = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const result = await UserService.getUserOrganizations(userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User organizations fetched successfully!",
        data: result.data
    });
});

const getAllUsersForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserService.getAllUsersForAdmin(query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users fetched successfully",
        data: result.data,
        meta: result.meta
    });
});

const toggleBlockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.toggleBlockUser(req.params.id, req.body.isBlocked);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User block status updated",
        data: result
    });
});

const softDeleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.softDeleteUser(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User deleted successfully",
        data: result
    });
});

export const UserController = {
    getUserOrganizations,
    getAllUsersForAdmin,
    toggleBlockUser,
    softDeleteUser
};
