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

export const UserController = {
    getUserOrganizations
};
