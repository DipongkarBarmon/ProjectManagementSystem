import { Router } from "express";
import { ActivityController } from "./activity.controller";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { PlatformRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });


router.get("/organizations/:organizationId/get-activities", auth({ permissions: [Permissions.ACTIVITY_READ] }), ActivityController.getOrganizationActivities);
router.get("/organizations/:organizationId/activities/:entityType/:entityId", auth({ permissions: [Permissions.ACTIVITY_READ] }), ActivityController.getEntityActivities);

router.get("/admin/global", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), ActivityController.getGlobalActivities);

export const ActivityRoutes = router;
