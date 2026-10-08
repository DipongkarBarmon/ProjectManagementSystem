import { Router } from "express";
import { TaskController } from "./task.controller";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { validationRequest } from "../../middleware/validationRequest";
import { createTaskSchema, updateTaskSchema } from "./task.validation";

const router = Router({ mergeParams: true });


router.post("/organizations/:organizationId/projects/:projectId/create-tasks", auth({ permissions: [Permissions.TASK_CREATE] }), validationRequest(createTaskSchema), TaskController.createTask);
router.get("/organizations/:organizationId/projects/:projectId/get-all-tasks", auth({ permissions: [Permissions.TASK_READ] }), TaskController.getAllTasks);
router.get("/organizations/:organizationId/projects/:projectId/get-task/:taskId", auth({ permissions: [Permissions.TASK_READ] }), TaskController.getTaskById);
router.patch("/organizations/:organizationId/projects/:projectId/update-task/:taskId", auth({ permissions: [Permissions.TASK_UPDATE] }), validationRequest(updateTaskSchema), TaskController.updateTask);
router.delete("/organizations/:organizationId/projects/:projectId/delete-task/:taskId", auth({ permissions: [Permissions.TASK_DELETE] }), TaskController.deleteTask);

export const TaskRoutes = router;
