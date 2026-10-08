import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { OrganizationRole, SprintStatus, ActivityAction, UserStatus } from "../../../../generated/prisma/enums";
import { ActivityService } from "../activity/activity.service";
import { ICreateSprintPayload, IUpdateSprintPayload } from "./sprint.interface";


const createSprint = async (projectId: string, payload: ICreateSprintPayload, user: RequestUser, organizationId: string) => {
  
  if(!organizationId ){
    throw new Error("Organization ID is required");
  }

  const orgnizationRole = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true }
  });

  if (!orgnizationRole) {
    throw new Error("Organization not found");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId, organizationId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const existUser = await prisma.user.findUnique({ 
     where: { id: user.userId }
  });

  if (!existUser) {
    throw new Error("User not found");
  } 

   if(existUser.status   === UserStatus.BLOCKED){
    throw new Error("User is blocked");
  }

  const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
  let isProjectManager = false;

  if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
     const membership = await prisma.projectMember.findUnique({
       where: { 
        projectId_userId: { 
          projectId, 
          userId:user.userId 
        } }
     });
     if (membership) {
        isProjectManager = true;
     }
  }

  if (!isOrgAdmin && !isProjectManager) {
    // Must be a project member if not admin/manager
    const membership = await prisma.projectMember.findUnique({
      where: {
         projectId_userId: { 
          projectId,
           userId: user.userId 
        } }
    });
    if (!membership) {
      throw new Error("You do not have access to this project");
    }
  } 
  const sprint = await prisma.sprint.create({
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
    entityType: "SPRINT",
    entityId: sprint.id,
    description: `Sprint ${sprint.name} created`,
  });

  return sprint;
};  


const getAllSprints = async (projectId: string, user: RequestUser, organizationId: string) => {
  if(!organizationId ){
    throw new Error("Organization ID is required");
  } 
  
  const project = await prisma.project.findUnique({
    where: { id: projectId, organizationId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const sprints = await prisma.sprint.findMany({
    where: { 
      projectId
     },
    orderBy: { 
      createdAt: 'desc' 
    }
  });

  return sprints;
};


const getSrintById = async (projectId: string, sprintId: string, user: RequestUser, organizationId: string) => {
  if(!organizationId ){
    throw new Error("Organization ID is required");
  }  
  
  const project = await prisma.project.findUnique({
    where: { id: projectId, organizationId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId, projectId },
    include: {
      tasks: true // might need pagination later
    }
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  return sprint;
};

const updateSprint = async (projectId: string, sprintId: string, payload: IUpdateSprintPayload, user: RequestUser, organizationId: string) => {
  if(!organizationId ){
    throw new Error("Organization ID is required");
  }

  const orgnization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true }
  });

  if (!orgnization) {
    throw new Error("Organization not found");
  }

  const existUser = await prisma.user.findUnique({ 
     where: { id: user.userId }
  });

  if (!existUser) {
    throw new Error("User not found");
  } 

    if(existUser.status   === UserStatus.BLOCKED){
      throw new Error("User is blocked");
    } 

  if(existUser.status   === UserStatus.DELETED || existUser.isDeleted === true){
    throw new Error("User is deleted");
  }
  
  if(existUser.isActive === false){
    throw new Error("User is inactive");
  }
  
  const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
  let isProjectManager = false;

  if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
     const membership = await prisma.projectMember.findUnique({
       where: { 
        projectId_userId: { 
          projectId,  
        userId:user.userId 
        } }
     });
     if (membership) {
        isProjectManager = true;
     }
  }

  if (!isOrgAdmin && !isProjectManager) {
    // Must be a project member if not admin/manager
    const membership = await prisma.projectMember.findUnique({
      where: {
         projectId_userId: { 
          projectId,
           userId: user.userId 
        } }
    });
    if (!membership) {
      throw new Error("You do not have access to this project");
    }
  } 
  
  const project = await prisma.project.findUnique({
    where: { 
      id: projectId,
      organizationId 
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const sprint = await prisma.sprint.findUnique({
    where: { 
      id: sprintId, 
      projectId 
    },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }
 
  const updatedSprint = await prisma.sprint.update({
    where: { 
      id: sprintId,
      projectId: projectId 
    },
    data: {
      ...payload,
      projectId:projectId,
      createdById: user.userId,
    }
  });

  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.UPDATED,
    entityType: "SPRINT",
    entityId: updatedSprint.id,
    description: `Sprint ${updatedSprint.name} updated`,
  });

  return updatedSprint;
};

const deleteSprint = async (projectId: string, sprintId: string, user: RequestUser, organizationId: string) => {
  if(!organizationId ){
    throw new Error("Organization ID is required");
  }

  const orgnization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true }
  });

  if (!orgnization) {
    throw new Error("Organization not found");
  }

  const existUser = await prisma.user.findUnique({ 
     where: { id: user.userId }
  });

  if (!existUser) {
    throw new Error("User not found");
  } 

    if(existUser.status   === UserStatus.BLOCKED){
      throw new Error("User is blocked");
    } 

  if(existUser.status   === UserStatus.DELETED || existUser.isDeleted === true){
    throw new Error("User is deleted");
  }
  
  if(existUser.isActive === false){
    throw new Error("User is inactive");
  }
  
  const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
  let isProjectManager = false;

  if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
     const membership = await prisma.projectMember.findUnique({
       where: { 
        projectId_userId: { 
          projectId,  
        userId:user.userId 
        } }
     });
     if (membership) {
        isProjectManager = true;
     }
  }

  if (!isOrgAdmin && !isProjectManager) {
    // Must be a project member if not admin/manager
    const membership = await prisma.projectMember.findUnique({
      where: {
         projectId_userId: { 
          projectId,
           userId: user.userId 
        } }
    });
    if (!membership) {
      throw new Error("You do not have access to this project");
    }
  } 
  
  const project = await prisma.project.findUnique({
    where: { 
      id: projectId,
      organizationId 
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const sprint = await prisma.sprint.findUnique({
    where: { 
      id: sprintId, 
      projectId 
    },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  const result =await prisma.sprint.delete({
    where: { 
      id: sprintId,
      projectId 
    }
  });

  await ActivityService.createActivity({
    organizationId,
    actorId: user.userId,
    action: ActivityAction.DELETED,
    entityType: "SPRINT",
    entityId: sprintId,
    description: `Sprint ${sprint.name} deleted`,
  }); 
  
  return result;
};


// export class SprintService {
//   private static async verifyProjectAccess(projectId: string, organizationId: string, user: RequestUser, requireAdminOrManager: boolean = false) {
//     const project = await prisma.project.findUnique({
//       where: { id: projectId, organizationId },
//     });

//     if (!project) {
//       throw new Error("Project not found");
//     }

//     const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
//     let isProjectManager = false;

//     if (user.organizationRole === OrganizationRole.PROJECT_MANAGER) {
//        const membership = await prisma.projectMember.findUnique({
//          where: { projectId_userId: { projectId, userId: user.userId } }
//        });
//        if (membership) {
//           isProjectManager = true;
//        }
//     }

//     if (requireAdminOrManager && !isOrgAdmin && !isProjectManager) {
//       throw new Error("You do not have permission to manage sprints in this project");
//     }

//     if (!isOrgAdmin && !isProjectManager) {
//       // Must be a project member if not admin/manager
//       const membership = await prisma.projectMember.findUnique({
//         where: { projectId_userId: { projectId, userId: user.userId } }
//       });
//       if (!membership) {
//         throw new Error("You do not have access to this project");
//       }
//     }

//     return project;
//   }

//   static async createSprint(projectId: string, payload: ICreateSprintPayload, user: RequestUser, organizationId: string) {
//     await this.verifyProjectAccess(projectId, organizationId, user, true);

//     const sprint = await prisma.sprint.create({
//       data: {
//         ...payload,
//         projectId,
//         createdById: user.userId,
//       }
//     });

//     await ActivityService.createActivity({
//       organizationId,
//       actorId: user.userId,
//       action: ActivityAction.CREATED,
//       entityType: "SPRINT",
//       entityId: sprint.id,
//       description: `Sprint ${sprint.name} created`,
//     });

//     return sprint;
//   }

//   static async getAllSprints(projectId: string, user: RequestUser, organizationId: string) {
//     await this.verifyProjectAccess(projectId, organizationId, user, false);

//     return await prisma.sprint.findMany({
//       where: { projectId },
//       orderBy: { createdAt: 'desc' }
//     });
//   }

//   static async getSprintById(projectId: string, sprintId: string, user: RequestUser, organizationId: string) {
//     await this.verifyProjectAccess(projectId, organizationId, user, false);

//     const sprint = await prisma.sprint.findUnique({
//       where: { id: sprintId, projectId },
//       include: {
//         tasks: true // might need pagination later
//       }
//     });

//     if (!sprint) {
//       throw new Error("Sprint not found");
//     }

//     return sprint;
//   }

//   static async updateSprint(projectId: string, sprintId: string, payload: IUpdateSprintPayload, user: RequestUser, organizationId: string) {
//     await this.verifyProjectAccess(projectId, organizationId, user, true);

//     const sprint = await prisma.sprint.findUnique({
//       where: { id: sprintId, projectId }
//     });

//     if (!sprint) {
//       throw new Error("Sprint not found");
//     }

//     // Check if activating a sprint when another is already active
//     if (payload.status === SprintStatus.ACTIVE) {
//       const activeSprint = await prisma.sprint.findFirst({
//         where: { projectId, status: SprintStatus.ACTIVE, id: { not: sprintId } }
//       });
//       if (activeSprint) {
//         throw new Error("Another sprint is already active in this project");
//       }
//     }

//     const updatedSprint = await prisma.sprint.update({
//       where: { id: sprintId },
//       data: payload
//     });

//     let action: ActivityAction = ActivityAction.UPDATED;
//     if (payload.status === SprintStatus.ACTIVE && sprint.status !== SprintStatus.ACTIVE) {
//       action = ActivityAction.SPRINT_STARTED;
//     } else if (payload.status === SprintStatus.COMPLETED && sprint.status !== SprintStatus.COMPLETED) {
//       action = ActivityAction.SPRINT_COMPLETED;
//     }

//     await ActivityService.createActivity({
//       organizationId,
//       actorId: user.userId,
//       action: action,
//       entityType: "SPRINT",
//       entityId: sprint.id,
//       description: `Sprint updated`,
//     });

//     return updatedSprint;
//   }

//   static async deleteSprint(projectId: string, sprintId: string, user: RequestUser, organizationId: string) {
//     await this.verifyProjectAccess(projectId, organizationId, user, true);

//     const sprint = await prisma.sprint.findUnique({
//       where: { id: sprintId, projectId }
//     });

//     if (!sprint) {
//       throw new Error("Sprint not found");
//     }

//     await prisma.sprint.delete({
//       where: { id: sprintId }
//     });

//     await ActivityService.createActivity({
//       organizationId,
//       actorId: user.userId,
//       action: ActivityAction.DELETED,
//       entityType: "SPRINT",
//       entityId: sprintId,
//       description: `Sprint ${sprint.name} deleted`,
//     });

//     return sprint;
//   }
// }



export const  SprintService = {
  createSprint,
  getSrintById,
  updateSprint,
  deleteSprint,
  getAllSprints
};
