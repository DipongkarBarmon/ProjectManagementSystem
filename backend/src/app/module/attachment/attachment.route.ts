import { Router } from "express";
import { AttachmentController } from "./attachment.controller";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";

const router = Router({ mergeParams: true });

import { upload } from "../../utils/cloudinary";
import { validationRequest } from "../../middleware/validationRequest";
import { AttachmentValidation } from "./attachment.validation";


router.post(
  "/organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments",
  auth({ permissions: [Permissions.PROJECT_READ] }),
  upload.array("files"),
  AttachmentController.uploadAttachments
);

router.get("/organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments", auth({ permissions: [Permissions.PROJECT_READ] }), AttachmentController.getAttachments);

router.delete("/organizations/:organizationId/projects/:projectId/tasks/attachments/:attachmentId", auth({ permissions: [Permissions.PROJECT_READ] }), AttachmentController.deleteAttachment);

export const AttachmentRoutes = router;
