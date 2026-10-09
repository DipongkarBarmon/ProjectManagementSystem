import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { OrganizationRole, ActivityAction } from "../../../../generated/prisma/enums";
import { ActivityService } from "../activity/activity.service";
import { NotificationService } from "../notification/notification.service";
import { ICreateTaskPayload, IUpdateTaskPayload } from "./task.interface";

export class TaskService {
  private static async verifyProjectAccess(projectId: string, organizationId: string, user: RequestUser) {
    const project = await prisma.project.findUnique({
      where: { id: projectId, organizationId },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    let isProjectManager = false;

    if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
       const membership = await prisma.projectMember.findUnique({
         where: { projectId_userId: { projectId, userId: user.userId } }
       });
       if (membership) {
          isProjectManager = true;
       }
    }

    if (!isOrgAdmin && !isProjectManager) {
      const membership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: user.userId } }
      });
      if (!membership) {
        throw new Error("You do not have access to this project");
      }
    }

    return { project, isOrgAdmin, isProjectManager };
  }

  static async createTask(projectId: string, payload: ICreateTaskPayload, user: RequestUser, organizationId: string) {
    const { isOrgAdmin, isProjectManager } = await this.verifyProjectAccess(projectId, organizationId, user);

    if (!isOrgAdmin && !isProjectManager) {
       throw new Error("Only organization admins and project managers can create tasks");
    }

    if (payload.assigneeId) {
       const assigneeMembership = await prisma.projectMember.findUnique({
         where: { projectId_userId: { projectId, userId: payload.assigneeId } }
       });
       if (!assigneeMembership) {
         throw new Error("Assignee is not a member of this project");
       }
    }

    if (payload.sprintId) {
      const sprint = await prisma.sprint.findUnique({
        where: { id: payload.sprintId, projectId }
      });
      if (!sprint) {
        throw new Error("Sprint not found in this project");
      }
    }

    const task = await prisma.task.create({
      data: {
        ...payload,
        projectId,
        createdById: user.userId,
      }
    });

    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.CREATED,
      entityType: "TASK",
      entityId: task.id,
      description: `Task created`,
    });

    if (payload.assigneeId) {
      await ActivityService.createActivity({
        organizationId,
        actorId: user.userId,
        action: ActivityAction.ASSIGNED,
        entityType: "TASK",
        entityId: task.id,
        metadata: { assigneeId: payload.assigneeId },
        description: `Task assigned upon creation`,
      });

      await NotificationService.createNotification({
        userId: payload.assigneeId,
        organizationId,
        title: "New Task Assigned",
        content: `You have been assigned to task: ${task.title}`,
        link: `/projects/${projectId}/tasks/${task.id}`
      });
    }

    return task;
  }

  static async getAllTasks(projectId: string, user: RequestUser, organizationId: string, query: any) {
    await this.verifyProjectAccess(projectId, organizationId, user);

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const total = await prisma.task.count({ where: { projectId } });

    const tasks = await prisma.task.findMany({
      where: { projectId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      data: tasks,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  static async getAllTasksForOrganization(organizationId: string, user: RequestUser, query: any) {
    // Basic org member check (this assumes caller already verified basic auth/org membership via middleware)
    const limit = query.limit ? Number(query.limit) : 50;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const total = await prisma.task.count({ where: { organizationId } });

    const tasks = await prisma.task.findMany({
      where: { organizationId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      data: tasks,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  static async getTaskById(projectId: string, taskId: string, user: RequestUser, organizationId: string) {
    await this.verifyProjectAccess(projectId, organizationId, user);

    const task = await prisma.task.findUnique({
      where: { id: taskId, projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        subtasks: true
      }
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  static async getTaskByIdForOrganization(taskId: string, user: RequestUser, organizationId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId, organizationId },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        subtasks: true
      }
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  static async updateTask(projectId: string, taskId: string, payload: IUpdateTaskPayload, user: RequestUser, organizationId: string) {
    const { isOrgAdmin, isProjectManager } = await this.verifyProjectAccess(projectId, organizationId, user);

    const task = await prisma.task.findUnique({
      where: { id: taskId, projectId }
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (payload.status && payload.status !== task.status) {
      const allowedTransitions: Record<string, string[]> = {
        'TODO': ['IN_PROGRESS', 'CANCELLED'],
        'IN_PROGRESS': ['IN_REVIEW', 'BLOCKED', 'CANCELLED'],
        'IN_REVIEW': ['DONE', 'IN_PROGRESS', 'CANCELLED'],
        'BLOCKED': ['IN_PROGRESS', 'CANCELLED'],
        'DONE': [] // Terminal state
      };

      const validNextStates = allowedTransitions[task.status] || [];
      if (!validNextStates.includes(payload.status)) {
        throw new Error(`Invalid status transition from ${task.status} to ${payload.status}`);
      }
    }

    const isAssignee = task.assigneeId === user.userId;
    const canManage = isOrgAdmin || isProjectManager;

    if (!canManage && !isAssignee) {
      throw new Error("You don't have permission to update this task");
    }

    if (!canManage) {
      // Members can only update certain fields, like status, description.
      // They cannot reassign, change sprint, change project etc.
      if (payload.assigneeId !== undefined && payload.assigneeId !== task.assigneeId) {
         throw new Error("You don't have permission to reassign this task");
      }
      if (payload.sprintId !== undefined && payload.sprintId !== task.sprintId) {
         throw new Error("You don't have permission to move this task to a different sprint");
      }
    } else {
       // It's a manager/admin. Validate assignee/sprint updates
       if (payload.assigneeId && payload.assigneeId !== task.assigneeId) {
          const assigneeMembership = await prisma.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId: payload.assigneeId } }
          });
          if (!assigneeMembership) {
            throw new Error("Assignee is not a member of this project");
          }
       }
       if (payload.sprintId && payload.sprintId !== task.sprintId) {
         const sprint = await prisma.sprint.findUnique({
           where: { id: payload.sprintId, projectId }
         });
         if (!sprint) {
           throw new Error("Sprint not found in this project");
         }
       }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: payload
    });

    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.UPDATED,
      entityType: "TASK",
      entityId: task.id,
      description: `Task updated`,
    });

    if (payload.status !== undefined && payload.status !== task.status) {
       await ActivityService.createActivity({
        organizationId,
        actorId: user.userId,
        action: ActivityAction.STATUS_CHANGED,
        entityType: "TASK",
        entityId: task.id,
        metadata: { oldStatus: task.status, newStatus: payload.status },
        description: `Task status changed`,
      });
    }

    if (payload.assigneeId !== undefined && payload.assigneeId !== task.assigneeId) {
       await ActivityService.createActivity({
        organizationId,
        actorId: user.userId,
        action: payload.assigneeId ? ActivityAction.ASSIGNED : ActivityAction.UNASSIGNED,
        entityType: "TASK",
        entityId: task.id,
        metadata: { newAssigneeId: payload.assigneeId, oldAssigneeId: task.assigneeId },
        description: `Task assignment changed`,
      });

      if (payload.assigneeId) {
        await NotificationService.createNotification({
          userId: payload.assigneeId,
          organizationId,
          title: "Task Assigned",
          content: `You have been assigned to task: ${task.title}`,
          link: `/projects/${projectId}/tasks/${task.id}`
        });
      }
    }

    return updatedTask;
  }

  static async deleteTask(projectId: string, taskId: string, user: RequestUser, organizationId: string) {
    const { isOrgAdmin, isProjectManager } = await this.verifyProjectAccess(projectId, organizationId, user);

    if (!isOrgAdmin && !isProjectManager) {
       throw new Error("Only organization admins and project managers can delete tasks");
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId, projectId }
    });

    if (!task) {
      throw new Error("Task not found");
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.DELETED,
      entityType: "TASK",
      entityId: taskId,
      description: `Task ${task.title} deleted`,
    });

    return task;
  }
}
