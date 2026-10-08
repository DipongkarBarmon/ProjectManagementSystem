import { Router } from "express";
import { LabelController } from "./label.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { createLabelSchema, updateLabelSchema, assignLabelSchema } from "./label.validation";
import { OrganizationRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });

const ALL_ROLES = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];

router.post("/organizations/:organizationId/create-labels", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(createLabelSchema), LabelController.createLabel);

router.get("/organizations/:organizationId/get-all-labels", auth({ organizationRoles: ALL_ROLES }), LabelController.getAllLabels);

router.patch("/organizations/:organizationId/update-label/:labelId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(updateLabelSchema), LabelController.updateLabel);

router.delete("/organizations/:organizationId/labels/:labelId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), LabelController.deleteLabel);

// Assignment routes
router.post("/organizations/:organizationId/labels/:labelId/assign", auth({ organizationRoles: ALL_ROLES }), validationRequest(assignLabelSchema), LabelController.assignLabel);

router.delete("/organizations/:organizationId/labels/:labelId/tasks/:taskId/remove", auth({ organizationRoles: ALL_ROLES }), LabelController.removeLabel);

export const LabelRoutes = router;
