import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { OrganizationRole, ActivityAction } from "../../../../generated/prisma/enums";
import { ActivityService } from "../activity/activity.service";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary";

export class AttachmentService {
  /**
   * Verify if the user has view/upload access to the task's attachments.
   * Enforces: Task access -> Project access -> Organization membership
   */
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
    
    // Check if user has access to the project
    const projectMembership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId: user.userId } }
    });

    if (!isOrgAdmin && !projectMembership) {
      throw new Error("You do not have access to this project's tasks");
    }

    const isProjectManager = user.organizationRole === OrganizationRole.PROJECT_MANAGER && !!projectMembership;
    const isTeamLead = user.organizationRole === OrganizationRole.TEAM_LEAD;

    return { task, isOrgAdmin, isProjectManager, isTeamLead };
  }

  static async uploadAttachments(taskId: string, files: Express.Multer.File[], user: RequestUser, organizationId: string) {
    await this.verifyTaskAccess(taskId, organizationId, user);

    const attachments = await Promise.all(
      files.map(async (file) => {
        const cloudinaryResult = await uploadToCloudinary(file.buffer);
        
        return prisma.attachment.create({
          data: {
            originalName: file.originalname,
            fileName: cloudinaryResult.original_filename || file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: cloudinaryResult.secure_url,
            storageKey: cloudinaryResult.public_id,
            taskId,
            organizationId,
            uploadedById: user.userId,
          }
        });
      })
    );

    const fileNames = attachments.map(a => a.originalName).join(", ");
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.ATTACHED,
      entityType: "TASK",
      entityId: taskId,
      description: `Uploaded attachments: ${fileNames}`,
    });

    return attachments;
  }

  static async getAttachments(taskId: string, user: RequestUser, organizationId: string) {
    await this.verifyTaskAccess(taskId, organizationId, user);

    return await prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: { select: { id: true, name: true, avatar: true } }
      }
    });
  }

  static async deleteAttachment(attachmentId: string, user: RequestUser, organizationId: string) {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId, organizationId }
    });

    if (!attachment) throw new Error("Attachment not found");

    const { isOrgAdmin, isProjectManager, isTeamLead } = await this.verifyTaskAccess(attachment.taskId, organizationId, user);

    let canDelete = false;

    if (attachment.uploadedById === user.userId) {
      canDelete = true;
    } else if (isOrgAdmin) {
      canDelete = true;
    } else if (isProjectManager) {
      canDelete = true;
    } else if (isTeamLead) {
      // Check if the current user is the teamLead of any team that the uploader is a member of.
      const uploaderTeams = await prisma.teamMember.findMany({
        where: { userId: attachment.uploadedById },
        include: { team: true }
      });
      
      const leadsUploaderTeam = uploaderTeams.some(tm => tm.team.teamLeadId === user.userId);
      if (leadsUploaderTeam) {
        canDelete = true;
      }
    }

    if (!canDelete) {
      throw new Error("You do not have permission to delete this attachment");
    }

    if (attachment.storageKey) {
      await deleteFromCloudinary(attachment.storageKey);
    }

    const deleted = await prisma.attachment.delete({
      where: { id: attachmentId }
    });
    
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.DETACHED,
      entityType: "TASK",
      entityId: attachment.taskId,
      description: `Deleted attachment ${attachment.originalName}`,
    });
    
    return deleted;
  }
}
