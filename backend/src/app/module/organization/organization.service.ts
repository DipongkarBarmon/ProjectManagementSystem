
import { prisma } from "../../lib/prisma";
import { ICreateOrganization, IOrganizationQuery, IUpdateOrganizationInfo } from "./organization.interface";
import { deleteFromCloudinary, uploadToCloudinary } from "../../lib/cloudinary";
import { OrganizationRole, ActivityAction } from "../../../../generated/prisma/enums";
import { OrganizationWhereInput } from "../../../../generated/prisma/models";
import { ActivityService } from "../activity/activity.service";
import { UploadApiResponse } from "cloudinary";

const createOrganization = async (payload : ICreateOrganization,fileBuffer : Buffer , userId : string) => {
  const {name,slug,description} = payload
  
  if(!slug){
    throw new Error("Slug is required")
  }
  
  if(!name){
     throw new Error("Name is required")
  }
  
  if(!userId){
    throw new Error("Plaese login to create an organization")
  }
  const user = await prisma.user.findUnique({
    where : {
      id : userId
    }
  })

  if(!user){
    throw new Error("User not found")
  }

  if(user.emailVerified === false){
    throw new Error("Please verify your email before creating an organization")
  }
  
  if(user.status === "BLOCKED"){
    throw new Error("Your account has been blocked. Please contact support.")
  }
  
  if(user.status === "DELETED" || user.isDeleted === true){
    throw new Error("Your account has been deleted. Please contact support.")
  }

  if(user.isActive === false){
    throw new Error("Your account is not active. Please contact support.")
  }

  const isEexistOrganization = await prisma.organization.findFirst({
    where : {
      OR: [
        {name : name},
        {slug:slug}
      ]
    }
  })

  if(isEexistOrganization){
    throw new Error("Organization already exists")
  }

  let cloudinaryResult: UploadApiResponse;
  if (fileBuffer) {
    try {
       cloudinaryResult = await uploadToCloudinary(fileBuffer,'organization-logo')
    } catch (error) {
       throw new Error('Fail to upload logo in cloudinary!')
    }

    if(!cloudinaryResult) {
       throw new Error("Does not upload logo in cloudinary,Please try again")
    }
  }

  const freePlan = await prisma.plan.findUnique({ where: { name: 'FREE' } });
  if (!freePlan) {
    throw new Error("Free plan not found in the system. Contact support.");
  }

  const { organization, organizationMember } = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name,
        slug,
        description,
        logo: cloudinaryResult?.secure_url,
        logoPublicId: cloudinaryResult?.public_id
      }
    });

    const member = await tx.organizationMember.create({
      data: {
        userId,
        organizationId: org.id,
        organizationRole: OrganizationRole.ORG_ADMIN
      }
    });

    await tx.subscription.create({
      data: {
        organizationId: org.id,
        planId: freePlan.id,
        status: 'ACTIVE',
        interval: 'MONTHLY',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 120)), // 10 years for Free by default
      }
    });

    return { organization: org, organizationMember: member };
  });

  if (!organization || !organizationMember) {
    throw new Error("Fail to create organization and member. Please try again.");
  }

  const organizationWithMembers = await prisma.organization.findUnique({
    where : {
      id : organization.id
    },
    include : {
      members : true
    }
  })  

  if(!organizationWithMembers){
    throw new Error("Fail to fetch organization with members,Please try again")
  }

  await ActivityService.createActivity({
    organizationId: organization.id,
    actorId: userId,
    action: ActivityAction.CREATED,
    entityType: "ORGANIZATION",
    entityId: organization.id,
    description: `Organization ${organization.name} created`,
  });

   return {organizationWithMembers}

}


const updateLogo = async(fileBuffer:Buffer,userId : string,organizationId : string)=> {
    const user = await prisma.user.findUnique({
        where : {
            id : userId
        }
    })

    const currentOrganization = await prisma.organization.findUnique({
        where : {
            id : organizationId
        }
    }) 
    if(!currentOrganization){
        throw new Error("Organization not found")
    }

    if(!user){
        throw new Error("User not found")
    }
    if(user.emailVerified === false){
        throw new Error("Please verify your email before updating organization logo")
    }
    if(user.status === "BLOCKED"){
        throw new Error("Your account has been blocked. Please contact support.")
    }

    if(user.status === "DELETED" || user.isDeleted === true){
        throw new Error("Your account has been deleted. Please contact support.")
    }

    if(user.isActive === false){
        throw new Error("Your account is not active. Please contact support.")
    }

    let cloudinaryResult;
    try {
       cloudinaryResult = await uploadToCloudinary(fileBuffer,'organization-logo')
    } catch (error) {
       throw new Error('Fail to upload logo in cloudinary!')
    } 
    
    if(!cloudinaryResult) { 
      throw new Error("Does not upload logo in cloudinary,Please try again")
    }

    const organization = await prisma.organization.update({
        where : {
            id : organizationId
        },
        data : {
            logo : cloudinaryResult.secure_url,
            logoPublicId: cloudinaryResult.public_id
        },
        include : {
            members : true
        }
    })
    if(currentOrganization.logoPublicId && currentOrganization.logo){
        try {
           await deleteFromCloudinary(currentOrganization.logoPublicId)
        } catch (error) {
            console.error("Failed to delete old logo from Cloudinary:", error);
        }
    }

    await ActivityService.createActivity({
        organizationId: organization.id,
        actorId: userId,
        action: ActivityAction.UPDATED,
        entityType: "ORGANIZATION",
        entityId: organization.id,
        description: `Organization logo updated`,
    });

    return {
      data : organization
    }
}



const updateOrganizationInfo = async(payload:IUpdateOrganizationInfo,userId : string,organizationId : string)=>{
   const user = await prisma.user.findUnique({
        where : {
            id : userId
        }
    })

    if(!user){
        throw new Error("User not found")
    }
    if(user.emailVerified === false){
        throw new Error("Please verify your email before updating organization info")
    }
    if(user.status === "BLOCKED"){
        throw new Error("Your account has been blocked. Please contact support.")
    }

    if(user.status === "DELETED" || user.isDeleted === true){
        throw new Error("Your account has been deleted. Please contact support.")
    }

    if(user.isActive === false){
        throw new Error("Your account is not active. Please contact support.")
    }
   const organization = await prisma.organization.update({
        where : {
            id : organizationId
        },
        data : {
            ...payload
        },
        include : {
            members : true
        }
    })

    await ActivityService.createActivity({
        organizationId: organization.id,
        actorId: userId,
        action: ActivityAction.UPDATED,
        entityType: "ORGANIZATION",
        entityId: organization.id,
        description: `Organization info updated`,
    });

    return {organization}

}



const getOrganizationById = async(organizationId: string, userId?: string)=> {
    if (userId) {
        const membership = await prisma.organizationMember.findUnique({
            where: { organizationId_userId: { organizationId, userId } },
        });
        if (!membership) throw new Error("Organization not found");
    }
    const organization = await prisma.organization.findUnique({
        where : {
            id : organizationId,
            deletedAt: null,
        },
        include : {
            members : true,
            subscription: {
                include: { plan: true }
            }
        }
    })
    if(!organization){
        throw new Error("Organization not found")
    }
     
    return {
      data: organization
    } 
}
const getAllOrganizations = async(query: IOrganizationQuery, userId?: string)=> {
     // Implement the logic to fetch all organizations with the given query
     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";
     
     const addConditions : OrganizationWhereInput[] = []

     if(query.searchTerm){
        addConditions.push({
            OR : [
                {
                    name : {
                        contains : query.searchTerm,
                        mode : "insensitive"
                    }
                },
                {
                    slug : {
                        contains : query.searchTerm,
                        mode : "insensitive"
                    }
                },
                {
                    description : {
                        contains : query.searchTerm,
                        mode : "insensitive"
                    }
                }
            ]
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
 
     const where: OrganizationWhereInput = {
          AND : [
           { deletedAt: null },
           ...addConditions,
            ...(userId ? [{ members: { some: { userId } } }] : []),
          ],
        };

     const organizations = await prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            [sortBy] : sortOrder
        },
        include: {
            subscription: {
                include: { plan: true }
            },
            ...(userId ? {
                members: {
                    where: { userId },
                    select: { organizationRole: true },
                },
            } : {}),
        }
     })
    
     const totalOrganizations = await prisma.organization.count({
        where
     })

     const totalPages = Math.ceil(totalOrganizations/limit)

     return {
        data : organizations,
        meta : {
            page,
            limit,
            total : totalOrganizations,
            totalPages
        }  
     }

}

const getAllOrganizationsForAdmin = async () => {
    return await prisma.organization.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: {
            subscription: { include: { plan: true } },
            _count: { select: { members: true, projects: true } }
        }
    });
};

const deleteOrganization = async(organizationId: string, userId: string)=> {
    const organization = await prisma.organization.findUnique({
        where : {
            id : organizationId,
            deletedAt: null,
        }
    })
    if(!organization){
        throw new Error("Organization not found")
    }
    const deletedOrganization = await prisma.organization.update({
        where : {
            id : organizationId
        },
        data: {
            deletedAt: new Date()
        }
    })

    await ActivityService.createActivity({
        organizationId: organizationId,
        actorId: userId,
        action: ActivityAction.DELETED,
        entityType: "ORGANIZATION",
        entityId: organizationId,
        description: `Organization ${organization.name} deleted`,
    });

    return {
         data : deletedOrganization
    }
} 
const getMembers = async (organizationId: string, query: any) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const members = await prisma.organizationMember.findMany({
        where: { organizationId },
        skip,
        take: limit,
        include: {
            user: {
                select: { id: true, name: true, email: true, avatar: true, status: true, teamMembers: true }
            }
        },
        orderBy: { joinedAt: 'desc' }
    });

    const total = await prisma.organizationMember.count({ where: { organizationId } });

    return {
        data: members,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
};

const updateMemberRole = async (organizationId: string, memberId: string, role: OrganizationRole, userId: string) => {
    const member = await prisma.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId, userId: memberId } }
    });

    if (!member) {
        throw new Error("Member not found in organization");
    }

    if (member.organizationRole === OrganizationRole.OWNER) {
        throw new Error("Cannot change the role of an OWNER");
    }

    const updatedMember = await prisma.organizationMember.update({
        where: { organizationId_userId: { organizationId, userId: memberId } },
        data: { organizationRole: role }
    });

    await ActivityService.createActivity({
        organizationId,
        actorId: userId,
        action: ActivityAction.UPDATED,
        entityType: "ORGANIZATION_MEMBER",
        entityId: memberId,
        description: `Member role updated to ${role}`
    });

    return { data: updatedMember };
};

const removeMember = async (organizationId: string, memberId: string, userId: string) => {
    const member = await prisma.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId, userId: memberId } }
    });

    if (!member) {
        throw new Error("Member not found in organization");
    }

    if (member.organizationRole === OrganizationRole.OWNER) {
        throw new Error("Cannot remove the OWNER of the organization");
    }

    const removedMember = await prisma.organizationMember.delete({
        where: { organizationId_userId: { organizationId, userId: memberId } }
    });

    await ActivityService.createActivity({
        organizationId,
        actorId: userId,
        action: ActivityAction.MEMBER_REMOVED,
        entityType: "ORGANIZATION",
        entityId: organizationId,
        metadata: { removedUserId: memberId },
        description: `Member removed from organization`
    });

    return { data: removedMember };
};

export const OrganizationService = {
  createOrganization,
  updateLogo,
  updateOrganizationInfo,
  getOrganizationById,
  getAllOrganizations,
  getAllOrganizationsForAdmin,
  deleteOrganization,
  getMembers,
  updateMemberRole,
  removeMember
}