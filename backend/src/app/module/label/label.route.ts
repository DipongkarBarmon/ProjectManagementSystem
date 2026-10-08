import { Router } from "express";
import { LabelController } from "./label.controller";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { validationRequest } from "../../middleware/validationRequest";
import { createLabelSchema, updateLabelSchema, assignLabelSchema } from "./label.validation";

const router = Router({ mergeParams: true });


router.post("/organizations/:organizationId/create-labels", auth({ permissions: [Permissions.PROJECT_UPDATE] }), validationRequest(createLabelSchema), LabelController.createLabel);

router.get("/organizations/:organizationId/get-all-labels", auth({ permissions: [Permissions.PROJECT_READ] }), LabelController.getAllLabels);

router.patch("/organizations/:organizationId/update-label/:labelId", auth({ permissions: [Permissions.PROJECT_UPDATE] }), validationRequest(updateLabelSchema), LabelController.updateLabel);

router.delete("/organizations/:organizationId/labels/:labelId", auth({ permissions: [Permissions.PROJECT_UPDATE] }), LabelController.deleteLabel);

// Assignment routes
router.post("/organizations/:organizationId/labels/:labelId/assign", auth({ permissions: [Permissions.TASK_UPDATE] }), validationRequest(assignLabelSchema), LabelController.assignLabel);

router.delete("/organizations/:organizationId/labels/:labelId/tasks/:taskId/remove", auth({ permissions: [Permissions.TASK_UPDATE] }), LabelController.removeLabel);

export const LabelRoutes = router;
