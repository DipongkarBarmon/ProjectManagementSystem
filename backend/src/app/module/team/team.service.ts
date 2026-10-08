import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { OrganizationRole, ActivityAction, UserStatus } from "../../../../generated/prisma/enums";
import { ActivityService } from "../activity/activity.service";
import { ICreateTeamPayload, IUpdateTeamPayload, IAssignTeamLeadPayload, IAddTeamMemberPayload, IGetAllTeamsPayload } from "./team.interface";
import { TeamWhereInput } from "../../../../generated/prisma/models";
 
const createTeam =async (payload: ICreateTeamPayload, user: RequestUser, organizationId: string) => {
    if (user.organizationRole !== OrganizationRole.ORG_ADMIN) {
      throw new Error("Only organization admins can create teams.");
    }
    
    const existingTeam = await prisma.team.findUnique({
       where: {
        organizationId_name: {
          organizationId,
          name: payload.name
        }
      }
    });

    if (existingTeam) {
      throw new Error("A team with this name already exists in the organization.");
    }

    const  existingUser  = await prisma.user.findUnique({
      where: {
        id: user.userId
      }
    });

    if (!existingUser) {
      throw new Error("User not found");
    }
    
    if(existingUser.status === UserStatus.BLOCKED){
      throw new Error("Blocked users cannot create teams.");
    } 

    if(existingUser.status === UserStatus.DELETED|| existingUser.isDeleted === true){
      throw new Error("Deleted users cannot create teams.");
    }

    if(existingUser.emailVerified === false){
      throw new Error("Email not verified. Please verify your email to create a team.");
    }

    const existingOrgMember = await prisma.organizationMember.findFirst({
      where: {
        userId: user.userId,
        organizationId
      }
    });

    if (!existingOrgMember) {
      throw new Error("User is not a member of this organization.");
    }

    const existOrganization = await prisma.organization.findUnique({
      where: {
        id: organizationId
      }
    });

    if (!existOrganization) {
      throw new Error("Organization not found.");
    } 

    const team = await prisma.team.create({
      data: {
        ...payload,
        organizationId,
        createdById: user.userId,
      },
    });

    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.CREATED,
      entityType: "TEAM",
      entityId: team.id,
      description: `Team ${team.name} created`,
    });

    return team;
  }



const getAllTeams = async (query: IGetAllTeamsPayload, user: RequestUser, organizationId: string) => {

    const limit = query.limit?Number(query.limit) : 10;
    const page = query.page?Number(query.page): 1;
    const skip = (page -1)*limit;
    const sortBy = query.sortBy? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder? query.sortOrder : "desc";
    const addConditions : TeamWhereInput[] = []
    
    if(query.searchTerm){
      addConditions.push({
        OR: [
          { name: {
             contains: query.searchTerm, 
             mode: "insensitive"
             } },
          { 
            description: { 
              contains: query.searchTerm,
               mode: "insensitive" 
            } }
        ]
      }); 
    }

    if(query.name){
      addConditions.push({
        name: query.name
      });
    }
    if(query.description){
      addConditions.push({
        description: query.description
      });
    }
    if(query.organizationId){
      addConditions.push({
        organizationId: query.organizationId
      });
    }

    const whereCondition : TeamWhereInput = {
      organizationId,
      AND: addConditions.length > 0 ? addConditions : undefined
    }

    const totalTeams = await prisma.team.count({
      where: whereCondition
    });

    const teams = await prisma.team.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        teamLead: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true } }
      }
    });

    return {
      data :teams,
      meta :{
        total: totalTeams,
        page,
        limit
      }, 
    };
  }       
     

 const getTeamById = async (teamId: string, user: RequestUser, organizationId: string) => {
    const team = await prisma.team.findUnique({
      where: { id: teamId, organizationId },
      include: {
        teamLead: { 
          select: { 
             id: true,
             name: true, 
             email: true 
            } },
        members: {
          include: {
            user: { 
              select: {
                 id: true,
                 name: true, 
                 email: true 
              } }
          }
        }
      }
    });

    if (!team) {
      throw new Error("Team not found");
    }

    const isManagerOrAdmin = 
      user.organizationRole === OrganizationRole.ORG_ADMIN || 
      user.organizationRole === OrganizationRole.PROJECT_MANAGER;

    if (!isManagerOrAdmin) {
      const isMember = team.members.some(m => m.userId === user.userId);
      if (!isMember) {
        throw new Error("You don't have permission to view this team");
      }
    }

    return team;
  }   
 
   const updateTeam = async (teamId: string, payload: IUpdateTeamPayload, user: RequestUser, organizationId: string) => {
    const team = await prisma.team.findUnique({
      where: { id: teamId, organizationId }
    });

    if (!team) {
      throw new Error("Team not found");
    }
    
    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    const isTeamLead = user.organizationRole === OrganizationRole.TEAM_LEAD && team.teamLeadId === user.userId;   
    
    if (!isOrgAdmin && !isTeamLead) { 
        
      throw new Error("You don't have permission to update this team");
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: payload
    });

    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.UPDATED,
      entityType: "TEAM",
      entityId: team.id,
      description: `Team updated`,
    });

    return updatedTeam;
  }           
 const deleteTeam = async (teamId: string, user: RequestUser, organizationId: string) => {
    if (user.organizationRole !== OrganizationRole.ORG_ADMIN) {
      throw new Error("Only organization admins can delete teams.");
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId, organizationId }
    });

    if (!team) throw new Error("Team not found");

    await prisma.team.delete({
      where: { id: teamId }
    });

    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.DELETED,
      entityType: "TEAM",
      entityId: teamId,
      description: `Team ${team.name} deleted`,
    });

    return team;
  }         
   
  const assignTeamLead = async (teamId: string, payload: IAssignTeamLeadPayload, user: RequestUser, organizationId: string) => {
    if (user.organizationRole !== OrganizationRole.ORG_ADMIN) {
      throw new Error("Only organization admins can assign team leads.");
    }
    
    const team = await prisma.team.findUnique({
      where: { id: teamId, organizationId }
    });

    if (!team) throw new Error("Team not found");
    
    // Verify target user is in the organization
    // console.log("Assigning team lead to userId:", payload.userId, "in organizationId:", organizationId);
    
    const orgMember = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: payload.userId
        }
      }
    });
    // console.log("Organization member found:", orgMember);

    if (!orgMember) {
      throw new Error("Target user is not a member of this organization");
    }

    if (orgMember.organizationRole === OrganizationRole.MEMBER) {
      throw new Error("Target user must have at least TEAM_LEAD organization role.");
    }

    // Check if they are in the team, if not add them
    const existingMember = await prisma.teamMember.findUnique({
      where: { 
        teamId_userId: { 
          teamId, 
          userId: payload.userId 
        } }
    });

    if (!existingMember) {
      const teamMember = await prisma.teamMember.create({
        data: {
          teamId,
          userId: payload.userId
        }
      });

      await ActivityService.createActivity({
        organizationId,
        actorId: user.userId,
        action: ActivityAction.MEMBER_ADDED,
        entityType: "TEAM",
        entityId: team.id,
        metadata: { targetUserId: payload.userId },
        description: `Added a new member to team`,
      });

      return teamMember;
    }

    return existingMember;
  }   
   
  const addTeamMember = async (teamId: string, payload: IAddTeamMemberPayload, user: RequestUser, organizationId: string) => {
    const team = await prisma.team.findUnique({
      where: { id: teamId, organizationId }
    });

    if (!team) throw new Error("Team not found");

    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    const isTeamLead = user.organizationRole === OrganizationRole.TEAM_LEAD && team.teamLeadId === user.userId;

    if (!isOrgAdmin && !isTeamLead) {
      throw new Error("You don't have permission to add members to this team");
    }

    // Verify target user is in the organization
    const orgMember = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: payload.userId
        }
      }
    });

    if (!orgMember) {
      throw new Error("Target user is not a member of this organization");
    }

    const existingMember = await prisma.teamMember.findUnique({
      where: { 
        teamId_userId: 
        {
           teamId, 
           userId: payload.userId 
        } }
    });

    if (existingMember) {
      throw new Error("User is already a member of this team");
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: payload.userId
      }
    });

    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.MEMBER_ADDED,
      entityType: "TEAM",
      entityId: team.id,
      metadata: { targetUserId: payload.userId },
      description: `Added a new member to team`,
    });

    return teamMember;
  }     
  
  const removeTeamMember = async (teamId: string, targetUserId: string, user: RequestUser, organizationId: string) => {
    const team = await prisma.team.findUnique({
      where: { id: teamId, organizationId }
    });

    if (!team) throw new Error("Team not found");

    const isOrgAdmin = user.organizationRole === OrganizationRole.ORG_ADMIN;
    const isTeamLead = user.organizationRole === OrganizationRole.TEAM_LEAD && team.teamLeadId === user.userId;

    if (!isOrgAdmin && !isTeamLead) {
      throw new Error("You don't have permission to remove members from this team");
    }

    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId
        }
      }
    });

    if (!existingMember) {
      throw new Error("User is not a member of this team");
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId
        }
      }
    }); 
    
    await ActivityService.createActivity({
      organizationId,
      actorId: user.userId,
      action: ActivityAction.MEMBER_REMOVED,
      entityType: "TEAM",
      entityId: team.id,
      metadata: { targetUserId },
      description: `Removed a member from team`,
    });
    
    return existingMember;
  } 

  const viewTeamMembers = async (teamId: string, organizationId: string) => {
    if (!teamId || !organizationId) {
      throw new Error("Team ID and Organization ID are required");
    }
    const existingOrganization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!existingOrganization) {
      throw new Error("Organization not found");
    } 
    const team = await prisma.team.findUnique({
      where: { id: teamId, organizationId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!team) throw new Error("Team not found");

     

    return team.members.map(member => member.user);
  } 
  
 export const TeamService = {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
    assignTeamLead,
    addTeamMember,
    removeTeamMember,
    viewTeamMembers
  };
  
 
