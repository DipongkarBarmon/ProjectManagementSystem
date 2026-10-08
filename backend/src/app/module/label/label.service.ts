import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { OrganizationRole } from "../../../../generated/prisma/enums";
import { ICreateLabelPayload, IUpdateLabelPayload, IAssignLabelPayload } from "./label.interface";

export class LabelService {
  static async createLabel(organizationId: string, payload: ICreateLabelPayload, user: RequestUser) {
    if (user.organizationRole !== OrganizationRole.ORG_ADMIN && user.organizationRole !== OrganizationRole.PROJECT_MANAGER) {
      throw new Error("Only admins and project managers can create labels");
    }

    const existingLabel = await prisma.label.findUnique({
      where: { organizationId_name: { organizationId, name: payload.name } }
    });

    if (existingLabel) {
      throw new Error("Label with this name already exists in the organization");
    }

    return await prisma.label.create({
      data: {
        ...payload,
        organizationId,
      }
    });
  }

  static async getAllLabels(organizationId: string) {
    return await prisma.label.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' }
    });
  }

  static async updateLabel(organizationId: string, labelId: string, payload: IUpdateLabelPayload, user: RequestUser) {
    if (user.organizationRole !== OrganizationRole.ORG_ADMIN && user.organizationRole !== OrganizationRole.PROJECT_MANAGER) {
      throw new Error("Only admins and project managers can update labels");
    }

    const label = await prisma.label.findUnique({
      where: { id: labelId, organizationId }
    });

    if (!label) throw new Error("Label not found");

    if (payload.name && payload.name !== label.name) {
      const existingLabel = await prisma.label.findUnique({
        where: { organizationId_name: { organizationId, name: payload.name } }
      });
      if (existingLabel) {
        throw new Error("Label with this name already exists");
      }
    }

    return await prisma.label.update({
      where: { id: labelId },
      data: payload
    });
  }

  static async deleteLabel(organizationId: string, labelId: string, user: RequestUser) {
    if (user.organizationRole !== OrganizationRole.ORG_ADMIN && user.organizationRole !== OrganizationRole.PROJECT_MANAGER) {
      throw new Error("Only admins and project managers can delete labels");
    }

    const label = await prisma.label.findUnique({
      where: { id: labelId, organizationId }
    });

    if (!label) throw new Error("Label not found");

    return await prisma.label.delete({
      where: { id: labelId }
    });
  }

  static async assignLabelToTask(organizationId: string, labelId: string, payload: IAssignLabelPayload, user: RequestUser) {
    const label = await prisma.label.findUnique({
      where: { id: labelId, organizationId }
    });

    if (!label) throw new Error("Label not found");

    const task = await prisma.task.findUnique({
      where: { id: payload.taskId },
      include: { project: true }
    });

    if (!task) throw new Error("Task not found");
    if (task.project.organizationId !== organizationId) {
      throw new Error("Task does not belong to this organization");
    }

    // Verify user can edit the task
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

    const canManage = isOrgAdmin || isProjectManager;
    const isAssignee = task.assigneeId === user.userId;

    if (!canManage && !isAssignee) {
      throw new Error("You do not have permission to assign labels to this task");
    }

    const existingTaskLabel = await prisma.taskLabel.findUnique({
      where: { taskId_labelId: { taskId: task.id, labelId } }
    });

    if (existingTaskLabel) return existingTaskLabel;

    return await prisma.taskLabel.create({
      data: {
        taskId: task.id,
        labelId
      }
    });
  }

  static async removeLabelFromTask(organizationId: string, labelId: string, taskId: string, user: RequestUser) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task) throw new Error("Task not found");
    if (task.project.organizationId !== organizationId) {
      throw new Error("Task does not belong to this organization");
    }

    // Verify user can edit the task
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

    const canManage = isOrgAdmin || isProjectManager;
    const isAssignee = task.assigneeId === user.userId;

    if (!canManage && !isAssignee) {
      throw new Error("You do not have permission to remove labels from this task");
    }

    const existingTaskLabel = await prisma.taskLabel.findUnique({
      where: { taskId_labelId: { taskId, labelId } }
    });

    if (!existingTaskLabel) {
      throw new Error("Label is not assigned to this task");
    }

    return await prisma.taskLabel.delete({
      where: { taskId_labelId: { taskId, labelId } }
    });
  }
}
