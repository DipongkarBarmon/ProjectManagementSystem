import { prisma } from "../../lib/prisma";
import { ICreateActivityPayload } from "./activity.interface";
import { RequestUser } from "../../middleware/checkAuth";


const createActivity = async (payload: ICreateActivityPayload) => {
  try {
    return await prisma.activity.create({
      data: {
        organizationId: payload.organizationId,
        actorId: payload.actorId,
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId,
        description: payload.description,
        metadata: payload.metadata ? JSON.parse(JSON.stringify(payload.metadata)) : undefined,
      }
    });
  } catch (error) {
    console.error("Failed to create activity log", error);
  }
};

const getOrganizationActivities = async (organizationId: string, user: RequestUser, query: Record<string, any>) => {
  if (user.organizationId !== organizationId) {
    throw new Error("User does not belong to this organization");
  }

  const organizationExists = await prisma.organization.findUnique({
    where: { id: organizationId }
  });

  if (!organizationExists) {
    throw new Error("Organization not found");
  } 

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        actor: { select: { id: true, name: true, avatar: true } }
      }
    }),
    prisma.activity.count({
      where: { organizationId }
    })
  ]);

  const enrichedActivities = await Promise.all(
    activities.map(async (activity) => {
      let details: any = {};
      
      // We know it belongs to this organization
      details.organization = { id: organizationId, name: organizationExists.name };
      
      if (activity.entityType === "TASK") {
        const task = await prisma.task.findUnique({
          where: { id: activity.entityId },
          include: { 
            project: true,
            sprint: true 
          }
        });
        if (task) {
          details.task = { id: task.id, title: task.title };
          details.project = { id: task.project.id, name: task.project.name };
          if (task.sprint) {
            details.sprint = { id: task.sprint.id, name: task.sprint.name };
          }
        }
      } else if (activity.entityType === "PROJECT") {
        const project = await prisma.project.findUnique({ where: { id: activity.entityId } });
        if (project) {
          details.project = { id: project.id, name: project.name };
        }
      } else if (activity.entityType === "SPRINT") {
        const sprint = await prisma.sprint.findUnique({ 
          where: { id: activity.entityId },
          include: { project: true }
        });
        if (sprint) {
          details.sprint = { id: sprint.id, name: sprint.name };
          details.project = { id: sprint.project.id, name: sprint.project.name };
        }
      }
      
      return {
        ...activity,
        details
      };
    })
  );

  return {
    data: enrichedActivities,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};

const getEntityActivities = async (organizationId: string, entityType: string, entityId: string, user: RequestUser, query: Record<string, any>) => {
  if (user.organizationId !== organizationId) {
    throw new Error("User does not belong to this organization");
  }

  const organizationExists = await prisma.organization.findUnique({
    where: { id: organizationId }
  });

  if (!organizationExists) {
    throw new Error("Organization not found");
  }  
  
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereClause = { organizationId, entityType, entityId };

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        actor: { select: { id: true, name: true, avatar: true } }
      }
    }),
    prisma.activity.count({ where: whereClause })
  ]);

  return {
    data: activities,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};

const getGlobalActivities = async (query: Record<string, any>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        actor: { select: { id: true, name: true, avatar: true, email: true } },
        organization: { select: { id: true, name: true } }
      }
    }),
    prisma.activity.count()
  ]);

  return {
    data: activities,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};

 

export const ActivityService = {
  createActivity,
  getOrganizationActivities,
  getEntityActivities,
  getGlobalActivities
};