import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { AuthValidation } from "./auth.validation";
import { upload } from "../../lib/multer";

const router = Router()


router.post('/register',upload.single('avatar'),
  validationRequest(AuthValidation.registerZodSchema),
  AuthController.register)

router.post('/verify-email',validationRequest(AuthValidation.verifyEmailZodSchema),AuthController.verifyEmail)

router.post('/login',validationRequest(AuthValidation.loginZodSchema),AuthController.userLogin)
router.post('/google',AuthController.googleLogin)
router.post("/refresh-token", AuthController.refreshToken);
router.post('/forget-password',validationRequest(AuthValidation.forgetPasswordZodSchema),AuthController.forgetPassword)
router.post('/reset-password',validationRequest(AuthValidation.resetPasswordZodSchema),AuthController.resetPassword)
export const AuthRouter = router