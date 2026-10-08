import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { markReadSchema } from "./notification.validation";
import { OrganizationRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });

const ALL_ROLES = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];

router.get("/", auth({ organizationRoles: ALL_ROLES }), NotificationController.getMyNotifications);
router.patch("/read", auth({ organizationRoles: ALL_ROLES }), validationRequest(markReadSchema), NotificationController.markAsRead);
router.patch("/read-all", auth({ organizationRoles: ALL_ROLES }), NotificationController.markAllAsRead);

export const NotificationRoutes = router;
