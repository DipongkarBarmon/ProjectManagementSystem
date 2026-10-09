import { Router } from "express";
import { CommentController } from "./comment.controller";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { validationRequest } from "../../middleware/validationRequest";
import { createCommentSchema, updateCommentSchema } from "./comment.validation";

const router = Router({ mergeParams: true });


router.post("/organizations/:organizationId/projects/:projectId/tasks/:taskId/create-comments", auth({ permissions: [Permissions.COMMENT_CREATE] }), validationRequest(createCommentSchema), CommentController.createComment);

router.get("/organizations/:organizationId/projects/:projectId/tasks/:taskId/get-comments", auth({ permissions: [Permissions.PROJECT_READ] }), CommentController.getComments);

router.get("/organizations/:organizationId/comments", auth({ permissions: [Permissions.PROJECT_READ] }), CommentController.getOrgComments);

router.patch("/organizations/:organizationId/projects/:projectId/update-comments/:commentId", auth({ permissions: [Permissions.COMMENT_UPDATE] }), validationRequest(updateCommentSchema), CommentController.updateComment);

router.delete("/organizations/:organizationId/projects/:projectId/delete-comments/:commentId", auth({ permissions: [Permissions.COMMENT_DELETE] }), CommentController.deleteComment);

export const CommentRoutes = router;
