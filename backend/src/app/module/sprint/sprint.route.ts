import { Router } from "express";
import { SprintController } from "./sprint.controller";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { validationRequest } from "../../middleware/validationRequest";
 
import { SprintValidation } from "./sprint.validation";

const router = Router({ mergeParams: true });


router.post("/organizations/:organizationId/projects/:projectId/create-sprint", auth({ permissions: [Permissions.SPRINT_CREATE] }), validationRequest(SprintValidation.createSprintZodSchema), SprintController.createSprint);


router.get("/organizations/:organizationId/projects/:projectId/get-all-sprints", auth({ permissions: [Permissions.SPRINT_READ] }), SprintController.getAllSprints);

router.get("/organizations/:organizationId/projects/:projectId/get-sprint/:sprintId", auth({ permissions: [Permissions.SPRINT_READ] }), SprintController.getSprintById);

 router.patch("/organizations/:organizationId/projects/:projectId/update-sprint/:sprintId", auth({ permissions: [Permissions.SPRINT_UPDATE] }), validationRequest(SprintValidation.updateSprintZodSchema), SprintController.updateSprint);

router.delete("/organizations/:organizationId/projects/:projectId/delete-sprint/:sprintId", auth({ permissions: [Permissions.SPRINT_UPDATE] }), SprintController.deleteSprint);

export const SprintRoutes = router;
