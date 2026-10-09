import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { markReadSchema } from "./notification.validation";

const router = Router({ mergeParams: true });

router.get("/", auth(), NotificationController.getMyNotifications);
router.patch("/read", auth(), validationRequest(markReadSchema), NotificationController.markAsRead);
router.patch("/read-all", auth(), NotificationController.markAllAsRead);

export const NotificationRoutes = router;
