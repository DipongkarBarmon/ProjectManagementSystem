import { Router } from "express";
import rateLimit from "express-rate-limit";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { AuthController } from "./auth.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { AuthValidation } from "./auth.validation";
import { upload } from "../../lib/multer";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP, please try again after 15 minutes",
  }
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    statusCode: 429,
    message: "Too many OTP requests, please try again after an hour",
  }
});

router.post('/register', upload.single('avatar'), validationRequest(AuthValidation.registerZodSchema), AuthController.register);

router.post('/verify-email', otpLimiter, validationRequest(AuthValidation.verifyEmailZodSchema), AuthController.verifyEmail);

router.post('/login', authLimiter, validationRequest(AuthValidation.loginZodSchema), AuthController.userLogin);
router.post('/google', authLimiter, AuthController.googleLogin);
router.post("/refresh-token", AuthController.refreshToken);
router.post('/forget-password', otpLimiter, validationRequest(AuthValidation.forgetPasswordZodSchema), AuthController.forgetPassword);
router.post('/reset-password', authLimiter, validationRequest(AuthValidation.resetPasswordZodSchema), AuthController.resetPassword);
router.post('/logout', AuthController.logout);
router.get('/me', auth(), AuthController.getMe);

export const AuthRouter = router;