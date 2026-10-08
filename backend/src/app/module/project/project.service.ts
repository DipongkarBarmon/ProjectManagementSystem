import { OrganizationRole, UserStatus, ActivityAction } from "../../../../generated/prisma/enums"
import { ProjectWhereInput } from "../../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { ActivityService } from "../activity/activity.service"
import { OrganizationBillingService } from "../organizationbilling/organizationbilling.service"
import {
    ICreateProjectPayload,
    IProjectQuery,
    IUpdateProjectPayload,
} from "./project.interface"



const createProjectSlug = (name: string) => {
    const slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    return slug
}

const createProject = async (organizationId: string,userId: string, payload: ICreateProjectPayload) => {
  
    if(!organizationId){
        throw new Error("Organization ID is required")
    }

    const organization = await prisma.organization.findUnique({
        where: {
            id: organizationId,
        },
    })

    if (!organization) {
        throw new Error("Organization not found")
    }

    const member = await prisma.organizationMember.findUnique({
        where: {
            organizationId_userId: {
                organizationId,
                userId,
            },
        },
    })

    if (!member) {
        throw new Error("You are not a member of this organization")
    }

    await OrganizationBillingService.checkLimit(organizationId, "PROJECT");
 
    const result = await prisma.$transaction(async (transaction) => {
        const project = await transaction.project.create({
            data: {
                organizationId,
                createdById: userId,
                name: payload.name,
                slug: payload.slug || createProjectSlug(payload.name),
                description: payload.description,
                startDate: payload.startDate ? new Date(payload.startDate) : null,
                endDate: payload.endDate ? new Date(payload.endDate) : null,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })
 
        return project
    })

    await ActivityService.createActivity({
        organizationId,
        actorId: userId,
        action: ActivityAction.CREATED,
        entityType: "PROJECT",
        entityId: result.id,
        description: `Project ${result.name} created`,
    });

    return result
}


const getAllProjects = async (organizationId: string,query: IProjectQuery) => {
    

     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";
    const addConditions : ProjectWhereInput[] = []
  
    if (query.searchTerm) {
        addConditions.push({
            OR: [
                {
                    name: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    slug: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        })
    }
    

    if(query.name){
        addConditions.push({
            name : query.name
        })
    }

    if(query.slug){
        addConditions.push({
            slug : query.slug
        })
    }

     if(query.description){
        addConditions.push({
            description : query.description
        })
    }

    if(query.startDate){
        addConditions.push({
            startDate : new Date(query.startDate)
        })
    }
    if(query.endDate){
        addConditions.push({
            endDate : new Date(query.endDate)
        })
    }

    addConditions.push({
        organizationId : organizationId
    })
 

    const projects = await prisma.project.findMany({
        where: {
            AND: addConditions
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include:{
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            projectMembers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        }
    })

    const total = await prisma.project.count({
        where: {
            AND: addConditions
        },
    })

    const totalPages = Math.ceil(total / limit)

    return {
        data :projects,
        meta: {
            page,
            limit,
            total,
            totalPages,
        },
    }
}

const getProject = async (organizationId: string,projectId: string) => {

    if(!organizationId){
        throw new Error("Organization ID is required")
    }

    if(!projectId){
        throw new Error("Project ID is required")
    }
    
    const organization = await prisma.organization.findUnique({
        where: {
            id: organizationId,
        },
    })

    if (!organization) {
        throw new Error("Organization not found")
    }

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            organizationId,
            deletedAt: null,
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            projectMembers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    })

    if (!project) {
        throw new Error("Project not found")
    }

    return project
}

const updateProject = async (organizationId: string,projectId: string,userId: string,payload:IUpdateProjectPayload) => {
    
    if(!organizationId) {
        throw new Error("Organization ID is required")
    }

    if(!projectId){
        throw new Error("Project ID is required")
    }

    const organization = await prisma.organization.findUnique({
        where: {
            id: organizationId,
        },
    })

    if (!organization) {
        throw new Error("Organization not found")
    }

    const isxistingProject = await prisma.project.findUnique({
        where: {
            id: projectId
        },
    })

    if (!isxistingProject) {
        throw new Error("Project not found")
    } 

    const updateData: any = {}

    if (payload.name !== undefined) {
        updateData.name = payload.name
    }

    if (payload.description !== undefined) {
        updateData.description = payload.description
    }

    if (payload.status !== undefined) {
        updateData.status = payload.status
    }

    if (payload.startDate !== undefined) {
        updateData.startDate = payload.startDate
            ? new Date(payload.startDate)
            : null
    }

    if (payload.endDate !== undefined) {
        updateData.endDate = payload.endDate
            ? new Date(payload.endDate)
            : null
    }

    const project = await prisma.project.update({
        where: {
            id: projectId,
        },
        data: updateData,
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },    
            projectMembers: true,
        },
    })

    await ActivityService.createActivity({
        organizationId,
        actorId: userId,
        action: ActivityAction.UPDATED,
        entityType: "PROJECT",
        entityId: project.id,
        description: `Project updated`,
    });

    return project
}


const deleteProject = async (organizationId: string, projectId: string, userId: string) => {
    if(!projectId){
        throw new Error("Project ID is required")
    }

    const existingProject = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
    })

    if (!existingProject) {
        throw new Error("Project not found")
    }

     
    const project = await prisma.project.delete({
        where: {
            id: projectId,
        } 
    })

    await ActivityService.createActivity({
        organizationId,
        actorId: userId,
        action: ActivityAction.DELETED,
        entityType: "PROJECT",
        entityId: projectId,
        description: `Project ${existingProject.name} deleted`,
    });

    return project
}



const assignProjectManager = async (organizationId: string,projectId: string,memberId: string, userId: string) => {
    
    if(!organizationId) {
        throw new Error("Organization ID is required")
    }

    if(!projectId){
        throw new Error("Project ID is required")
    }

    if(!memberId){
        throw new Error("Member ID is required")
    }
    const user = await prisma.user.findUnique({
        where: {
            id: memberId,
        },
    })

    if (!user) {
        throw new Error("User not found")
    }

    if(user.status === UserStatus.BLOCKED){
        throw new Error("User is blocked")
    }
    
    if(user.status === UserStatus.DELETED || user.isDeleted === true){
        throw new Error("User is deleted")
    }
    if(user.emailVerified === false){
        throw new Error("User email is not verified")
    }

    const isExistingProject = await prisma.project.findUnique({
        where: {
            id: projectId,
            organizationId,
        },
    })

    if (!isExistingProject) {
        throw new Error("Project not found")
    }
    
    const manager = await prisma.organizationMember.findUnique({ 
        where: {
            organizationId_userId: {
                organizationId,
                userId: memberId,
            },
        },
    })   
    if (!manager) { 
         throw new Error("Member not found in the organization")   
    }
    
    const updateOrganizationMember = await prisma.organizationMember.update({
        where: {
            organizationId_userId: {
                organizationId,
                userId: memberId,
            },
        },
        data: {
            organizationRole: OrganizationRole.PROJECT_MANAGER,
        },
    })  
    
    const projectManager = await prisma.projectMember.upsert({
        where: {
            projectId_userId: {
                projectId,
                userId: manager.userId,
            },
        },
        update: {
           projectId,
           userId: manager.userId,
        },
        create: {
            projectId,
            userId: manager.userId,
        },
    })

    await ActivityService.createActivity({
        organizationId,
        actorId: userId,
        action: ActivityAction.UPDATED,
        entityType: "PROJECT",
        entityId: projectId,
        metadata: { targetUserId: memberId },
        description: `Assigned project manager`,
    });

    return projectManager
}




const addMember = async ( organizationId: string, projectId: string, memberId: string, userId: string) => {
    if(!organizationId) {
        throw new Error("Organization ID is required")
    }

    if(!projectId){
        throw new Error("Project ID is required")
    }

    if(!memberId){
        throw new Error("Member ID is required")
    }
    const user = await prisma.user.findUnique({
        where: {
            id: memberId,
        },
    })

    if (!user) {
        throw new Error("User not found")
    }

    if(user.status === UserStatus.BLOCKED){
        throw new Error("User is blocked")
    }
    
    if(user.status === UserStatus.DELETED || user.isDeleted === true){
        throw new Error("User is deleted")
    }
    if(user.emailVerified === false){
        throw new Error("User email is not verified")
    }

    const isExistingProject = await prisma.project.findUnique({
        where: {
            id: projectId,
            organizationId,
        },
    })

    if (!isExistingProject) {
        throw new Error("Project not found")
    }
    
    const manager = await prisma.organizationMember.findUnique({ 
        where: {
            organizationId_userId: {
                organizationId,
                userId: memberId,
            },
        },
    })   
    if (!manager) { 
         throw new Error("Member not found in the organization")   
    }
    
    const updateOrganizationMember = await prisma.organizationMember.update({
        where: {
            organizationId_userId: {
                organizationId,
                userId: memberId,
            },
        },
        data: {
            organizationRole: OrganizationRole.MEMBER,
        },
    })  
    
    const projectMember = await prisma.projectMember.upsert({
        where: {
            projectId_userId: {
                projectId,
                userId: manager.userId,
            },
        },
        update: {
           projectId,
           userId: manager.userId,
        },
        create: {
            projectId,
            userId: manager.userId,
        },
    })

    await ActivityService.createActivity({
        organizationId,
        actorId: userId,
        action: ActivityAction.MEMBER_ADDED,
        entityType: "PROJECT",
        entityId: projectId,
        metadata: { targetUserId: memberId },
        description: `Added member to project`,
    });

    return projectMember
}



const removeMember = async ( organizationId: string, projectId: string,memberId: string, userId: string) => {
 
    if(!organizationId) {
        throw new Error("Organization ID is required")
    }

    if(!projectId){
        throw new Error("Project ID is required")
    }

    if(!memberId){
        throw new Error("Member ID is required")
    }
    const isExistingProject = await prisma.project.findUnique({
        where: {
            id: projectId,
            organizationId,
        },
    })

    if (!isExistingProject) {
        throw new Error("Project not found")
    }

    const isExistingMember = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId: memberId,
            },
        },
    })

    if (!isExistingMember) {
        throw new Error("Member not found in the project")
    }
    
    const projectMember = await prisma.projectMember.delete({
        where: {
            projectId_userId: {
                projectId,
                userId: memberId,
            },
        },
    })

    await ActivityService.createActivity({
        organizationId,
        actorId: userId,
        action: ActivityAction.MEMBER_REMOVED,
        entityType: "PROJECT",
        entityId: projectId,
        metadata: { targetUserId: memberId },
        description: `Removed member from project`,
    });

    return projectMember
}

export const ProjectService = {
    createProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject,
    assignProjectManager,
    addMember,
    removeMember,
}
