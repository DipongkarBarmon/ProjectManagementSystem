import { Router } from "express";
import { SprintController } from "./sprint.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
 
import { OrganizationRole } from "../../../../generated/prisma/enums";
import { SprintValidation } from "./sprint.validation";

const router = Router({ mergeParams: true });

const ALL_ROLES = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];

router.post("/organizations/:organizationId/projects/:projectId/create-sprint", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(SprintValidation.createSprintZodSchema), SprintController.createSprint);


router.get("/organizations/:organizationId/projects/:projectId/get-all-sprints", auth({ organizationRoles: ALL_ROLES }), SprintController.getAllSprints);

router.get("/organizations/:organizationId/projects/:projectId/get-sprint/:sprintId", auth({ organizationRoles: ALL_ROLES }), SprintController.getSprintById);

 router.patch("/organizations/:organizationId/projects/:projectId/update-sprint/:sprintId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(SprintValidation.updateSprintZodSchema), SprintController.updateSprint);

router.delete("/organizations/:organizationId/projects/:projectId/delete-sprint/:sprintId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), SprintController.deleteSprint);

export const SprintRoutes = router;
