import { Router } from "express";
import { AttachmentController } from "./attachment.controller";
import { auth } from "../../middleware/checkAuth";
import { OrganizationRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });

import { upload } from "../../utils/cloudinary";
import { validationRequest } from "../../middleware/validationRequest";
import { AttachmentValidation } from "./attachment.validation";

const ALL_ROLES = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];

router.post(
  "/organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments",
  auth({ organizationRoles: ALL_ROLES }),
  upload.array("files"),validationRequest(AttachmentValidation.createAttachmentSchema),
  AttachmentController.uploadAttachments
);

router.get("/organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments", auth({ organizationRoles: ALL_ROLES }), AttachmentController.getAttachments);

router.delete("/organizations/:organizationId/projects/:projectId/tasks/attachments/:attachmentId", auth({ organizationRoles: ALL_ROLES }), AttachmentController.deleteAttachment);

export const AttachmentRoutes = router;
