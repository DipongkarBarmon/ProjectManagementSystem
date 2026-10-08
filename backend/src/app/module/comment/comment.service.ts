import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { OrganizationRole, ActivityAction } from "../../../../generated/prisma/enums";
import { ActivityService } from "../activity/activity.service";
import { ICreateCommentPayload, IUpdateCommentPayload } from "./comment.interface";

export class CommentService {
  private static async verifyTaskAccess(taskId: string, organizationId: string, user: RequestUser) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task) throw new Error("Task not found");
    if (task.project.organizationId !== organizationId) {
      throw new Error("Task does not belong to this organization");
    }

    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    
    let isProjectManager = false;
    if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
       const membership = await prisma.projectMember.findUnique({
         where: { projectId_userId: { projectId: task.projectId, userId: user.userId } }
       });
       if (membership) {
          isProjectManager = true;
       }
    }

    if (!isOrgAdmin && !isProjectManager) {
      const membership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId: user.userId } }
      });
      if (!membership) {
        throw new Error("You do not have access to this project's tasks");
      }
    }

    return { task, isOrgAdmin, isProjectManager };
  }

  static async createComment(taskId: string, payload: ICreateCommentPayload, user: RequestUser, organizationId: string) {
    const { task } = await this.verifyTaskAccess(taskId, organizationId, user);

    const comment = await prisma.comment.create({
      data: {
        content: payload.content,
        taskId,
        userId: user.userId,
      }
    });

    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.COMMENTED,
      entityType: "TASK",
      entityId: taskId,
      metadata: { commentId: comment.id },
      description: `Added a comment to task`,
    });

    return comment;
  }

  static async getComments(taskId: string, user: RequestUser, organizationId: string) {
    await this.verifyTaskAccess(taskId, organizationId, user);

    return await prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });
  }

  static async updateComment(commentId: string, payload: IUpdateCommentPayload, user: RequestUser, organizationId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { task: true }
    });

    if (!comment) throw new Error("Comment not found");

    await this.verifyTaskAccess(comment.taskId, organizationId, user);

    if (comment.userId !== user.userId) {
      throw new Error("You can only edit your own comments");
    }

    return await prisma.comment.update({
      where: { id: commentId },
      data: payload
    });
  }

  static async deleteComment(commentId: string, user: RequestUser, organizationId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { task: true }
    });

    if (!comment) throw new Error("Comment not found");

    const { isOrgAdmin, isProjectManager } = await this.verifyTaskAccess(comment.taskId, organizationId, user);

    const canDelete = comment.userId === user.userId || isOrgAdmin || isProjectManager;

    if (!canDelete) {
      throw new Error("You do not have permission to delete this comment");
    }

    return await prisma.comment.delete({
      where: { id: commentId }
    });
  }
}
