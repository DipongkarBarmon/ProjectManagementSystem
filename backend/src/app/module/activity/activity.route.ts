import { Router } from "express";
import { ActivityController } from "./activity.controller";
import { auth } from "../../middleware/checkAuth";
import { OrganizationRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });

const ALL_ROLES = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];

router.get("/organizations/:organizationId/get-activities", auth({ organizationRoles: ALL_ROLES }), ActivityController.getOrganizationActivities);
router.get("/organizations/:organizationId/activities/:entityType/:entityId", auth({ organizationRoles: ALL_ROLES }), ActivityController.getEntityActivities);

export const ActivityRoutes = router;
