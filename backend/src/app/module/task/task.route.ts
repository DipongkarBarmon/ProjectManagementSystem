import { Router } from "express";
import { TaskController } from "./task.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { createTaskSchema, updateTaskSchema } from "./task.validation";
import { OrganizationRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });

const ALL_ROLES = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];

router.post("/organizations/:organizationId/projects/:projectId/create-tasks", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), validationRequest(createTaskSchema), TaskController.createTask);
router.get("/organizations/:organizationId/projects/:projectId/get-all-tasks", auth({ organizationRoles: ALL_ROLES }), TaskController.getAllTasks);
router.get("/organizations/:organizationId/projects/:projectId/get-task/:taskId", auth({ organizationRoles: ALL_ROLES }), TaskController.getTaskById);
router.patch("/organizations/:organizationId/projects/:projectId/update-task/:taskId", auth({ organizationRoles: ALL_ROLES }), validationRequest(updateTaskSchema), TaskController.updateTask);
router.delete("/organizations/:organizationId/projects/:projectId/delete-task/:taskId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), TaskController.deleteTask);

export const TaskRoutes = router;
