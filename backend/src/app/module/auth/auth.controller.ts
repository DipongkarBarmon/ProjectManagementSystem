import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import config from "../../config";

const register = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const body = req.body
    const payload = req.file
    if (!payload) {
        return res.status(httpStatus.BAD_REQUEST).json({ success: false, statusCode: httpStatus.BAD_REQUEST, message: "Profile image is required.", data: null });
    }
    
    await AuthService.registerIntoDB(body, payload.buffer)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.CREATED,
       message : "Email verification otp sent successfully!",
       data : null
    })
})

const verifyEmail =catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const body = req.body
    const result = await AuthService.verifyEmail(body)
    const {accessToken,refreshToken} = result

    
    res.cookie("accessToken", accessToken, {
       httpOnly: true,
       sameSite: config.node_env === "production" ? 'none' : 'lax',
       secure: config.node_env === "production",
       maxAge: 1000 * 60 * 60 * 24 // 1 day
    });
    
    res.cookie("refreshToken", refreshToken, {
       httpOnly: true,
       sameSite: config.node_env === "production" ? 'none' : 'lax',
       secure: config.node_env === "production",
       maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    sendResponse(res,{
       success: true,
       statusCode : httpStatus.OK,
       message : "Email verified successfully!",
       data : { user: result.user }
    })
})

const userLogin = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const body = req.body

    const result = await AuthService.userloginFromBD(body)
    
    const {accessToken,refreshToken} = result
    
    res.cookie("accessToken", accessToken, {
       httpOnly: true,
       sameSite: config.node_env === "production" ? 'none' : 'lax',
       secure: config.node_env === "production",
       maxAge: 1000 * 60 * 60 * 24 // 1 day
    });
    
    res.cookie("refreshToken", refreshToken, {
       httpOnly: true,
       sameSite: config.node_env === "production" ? 'none' : 'lax',
       secure: config.node_env === "production",
       maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    sendResponse(res,{
       success: true,
       statusCode : httpStatus.OK,
       message : "User logged in successfully!",
       data : { user: result.user }
    })
})

const googleLogin =catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const idToken = req.body

    const result = await AuthService.googleLogin(idToken)
    
    const {accessToken,refreshToken} = result
    
    res.cookie("accessToken", accessToken, {
       httpOnly: true,
       sameSite: config.node_env === "production" ? 'none' : 'lax',
       secure: config.node_env === "production",
       maxAge: 1000 * 60 * 60 * 24 // 1 day
    });
    
    res.cookie("refreshToken", refreshToken, {
       httpOnly: true,
       sameSite: config.node_env === "production" ? 'none' : 'lax',
       secure: config.node_env === "production",
       maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    sendResponse(res,{
       success: true,
       statusCode : httpStatus.OK,
       message : "User logged in successfully!",
       data : { user: result.user }
    })
})


const refreshToken = catchAsync(async (req: Request, res: Response) => {
	if (!req.cookies.refreshToken) {
		throw new Error("Refresh token is missing");
	}
	const result = await AuthService.refreshToken(req.cookies.refreshToken);
	const { accessToken, refreshToken: newRefreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: config.node_env === "production",
		sameSite: config.node_env === "production" ? "none" : "lax",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", newRefreshToken, {
		httpOnly: true,
		secure: config.node_env === "production",
		sameSite: config.node_env === "production" ? "none" : "lax",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "New tokens generated successfully",
		data: {
			user: result.user
		},
	});
});

const forgetPassword =catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const body = req.body

    await AuthService.forgetPassword(body)
    sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: `Otp sent to Email :${body.email}`,
		data:null
	});
     
})

const resetPassword =catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const body = req.body

    await AuthService.resetPassword(body)
    sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Reset password successfully",
		data:null,
	});
     
})

const logout = catchAsync(async (req: Request, res: Response) => {
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: config.node_env === "production",
		sameSite: config.node_env === "production" ? "none" : "lax",
	});
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: config.node_env === "production",
		sameSite: config.node_env === "production" ? "none" : "lax",
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Logged out successfully",
		data: null,
	});
});

const getMe = catchAsync(async (req: Request, res: Response) => {
	const user = req.user; // populated by checkAuth middleware
	
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User fetched successfully",
		data: { user },
	});
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthService.updateProfile(req.user!.userId, req.body);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile updated successfully",
		data: { user: result },
	});
});

export const AuthController = {
   register,
   verifyEmail,
   userLogin,
   googleLogin,
   refreshToken,
   forgetPassword,
   resetPassword,
   logout,
   getMe,
   updateMe
}