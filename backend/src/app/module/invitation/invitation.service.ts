import path from "path"
import { prisma } from "../../lib/prisma"
import { IGetAllInvitationsPayload, ISentInvitationPayload } from "./invitation.interface"
import crypto from "crypto"
import ejs from "ejs"
import { transporter } from "../../lib/nodemailer"
import config from "../../config"
import { InvitationStatus, ActivityAction } from "../../../../generated/prisma/enums"
import { InvitationWhereInput } from "../../../../generated/prisma/models"
import { ActivityService } from "../activity/activity.service"


const hashInvitationToken = (token: string) =>
    crypto.createHash("sha256").update(token).digest("hex")


const sentInvitations = async (payload :ISentInvitationPayload,organizationId : string,userId : string ) => {
    if(!payload.email || !payload.organizationRole){
        throw new Error("Email and organization role are required")
    }
    if(!organizationId){
        throw new Error("Organization ID is required")
    }
    if(!userId){
        throw new Error("User ID is required")
    }

    const organization = await prisma.organization.findUnique({
        where : {
            id :organizationId
        }
    })

    if(!organization){
        throw new Error("Organization not found")
    }
    
    const user = await prisma.user.findUnique({
        where : {
            email : payload.email
        }
    })
    
    if(user){
       const existingMembership = await prisma.organizationMember.findUnique({
        where : {
            organizationId_userId : {
                organizationId,
                userId :user.id
            }
        }

      })

      if(existingMembership){
        throw new Error("You are already a member of this organization")
      }
    }
    

    // Here you can implement the logic to send the invitation, e.g., save it to the database, send an email, etc.
    
     const token = crypto.randomBytes(32).toString("hex")
     console.log("Generated token:", token)

     const tokenHash = hashInvitationToken(token)
     
     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000*7) // 24 hours from now

      const invitation = await prisma.invitation.create({
        data : {
            email : payload.email,
            organizationRole : payload.organizationRole,
            invitedById : userId,
            organizationId : organizationId,
            token : tokenHash,
            expiresAt : expiresAt
        }
      })

      if(!invitation){
        throw new Error("Fail to create invitation,Please try again")
      }
      
      const invitatedUser = await prisma.user.findUnique({
        where : {
            id : userId
        }
      })
      if(!invitatedUser){
        throw new Error("Invitated user not found")
      }


      const templatePath = path.join(process.cwd(),'src/app/templates/invitation-mail.ejs')
      const templateData = {
        organizationName : organization.name,
        invitedByName : invitatedUser.name,
        roleName: payload.organizationRole,
        invitationUrl : `${config.frontend_url}/invitation/accept/${token}`,
        expiresAt,
        year: new Date().getFullYear(),
      }
      
      const html = await ejs.renderFile(templatePath, templateData)
      
      await transporter.sendMail({
         from: `TaskFlow <${config.smtp_sender}>`,
         to: payload.email,
         subject: `${invitatedUser.name} invited you to join ${organization.name} on TaskFlow`,
         html
      });

      await ActivityService.createActivity({
          organizationId: organizationId,
          actorId: userId,
          action: ActivityAction.INVITED,
          entityType: "ORGANIZATION",
          entityId: organizationId,
          metadata: { invitedEmail: payload.email, role: payload.organizationRole },
          description: `Sent invitation to ${payload.email}`,
      });
} 


const getInvitationByToken = async (token: string) => {
      if (!token) {
        throw new Error("Invitation token is required")
      }

      const invitation = await prisma.invitation.findUnique({
        where: { 
          token: hashInvitationToken(token)
         },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          invitedBy: {
            select: {
              name: true,
            },
          },
        },
      })

      if (!invitation) {
        throw new Error("Invalid invitation")
      }
      if (invitation.status !== InvitationStatus.PENDING) {
        throw new Error(`Invitation is ${invitation.status.toLowerCase()}`)
      }
      if (invitation.expiresAt < new Date()) {
        await prisma.invitation.update({
          where: { 
            id: invitation.id 
          },
          data: { 
            status: InvitationStatus.EXPIRED
           },
        })
        throw new Error("Invitation expired")
      }

      return {
        email: invitation.email,
        organizationId: invitation.organizationId,
        organizationRole: invitation.organizationRole,
        expiresAt: invitation.expiresAt,
        organization: invitation.organization,
        invitedBy: invitation.invitedBy,
      }
}

const acceptInvitation = async (token: string, userId: string) => {
      if (!userId) {
        throw new Error("User ID is required")
      }

      const invitation = await prisma.invitation.findUnique({
        where: { 
          token: hashInvitationToken(token) 
        },
      })

      if (!invitation) {
        throw new Error("Invalid invitation")
      }
      if (invitation.status !== InvitationStatus.PENDING) {
        throw new Error(`Invitation is ${invitation.status.toLowerCase()}`)
      }
      if (invitation.expiresAt < new Date()) {
        throw new Error("Invitation expired")
      }

      const user = await prisma.user.findUnique({
        where: { 
          id: userId 
        },
      })

      if (!user) {
        throw new Error("User not found")
      }
      if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
        throw new Error("This invitation belongs to a different email address")
      }

      const result = await prisma.$transaction(async (tx) => {
        const membership = await tx.organizationMember.upsert({
          where: {
            organizationId_userId: {
              organizationId: invitation.organizationId,
              userId,
            },
          },
          update: {
            organizationRole: invitation.organizationRole,
          },
          create: {
            organizationId: invitation.organizationId,
            userId,
            organizationRole: invitation.organizationRole,
          },
        })

        await tx.invitation.update({
          where: { id: invitation.id },
          data: {
            status: InvitationStatus.ACCEPTED,
            acceptedAt: new Date(),
          },
        })

        return membership
      })

      await ActivityService.createActivity({
          organizationId: invitation.organizationId,
          actorId: userId,
          action: ActivityAction.MEMBER_ADDED,
          entityType: "ORGANIZATION",
          entityId: invitation.organizationId,
          description: `Accepted invitation and joined organization`,
      });

      return result
}


const getAllInvitations = async (query : IGetAllInvitationsPayload)=>{
        const limit = query.limit?Number(query.limit) : 10;
        const page = query.page?Number(query.page): 1;
        const skip = (page -1)*limit;
        const sortBy = query.sortBy? query.sortBy : "createdAt";
        const sortOrder = query.sortOrder? query.sortOrder : "desc";
        
        const addConditions : InvitationWhereInput[] = []

        if(query.searchTerm){
            addConditions.push({
                OR : [
                    {
                        email : {
                            contains : query.searchTerm,
                            mode : "insensitive"
                        }
                    }
                ]
            })
        }

      if (query.email) {
          addConditions.push({
            email: query.email,
          });
        }

        if (query.organizationRole) {
          addConditions.push({
            organizationRole: {
              equals: query.organizationRole,
            },
          });
        }

        if (query.status) {
          addConditions.push({
            status: {
              equals: query.status,
            },
          });
        }

        if (query.acceptedAt) {
          addConditions.push({
            acceptedAt: {
              gte: query.acceptedAt,
            },
          });
        }

        if (query.expiresAt) {
          addConditions.push({
            expiresAt: {
              gte: query.expiresAt,
            },
          });
        }

        const invitations = await prisma.invitation.findMany({
            where : {
              AND : addConditions
            },
            skip,
            take: limit,
            orderBy: {
                [sortBy] : sortOrder
            }
         })

         return invitations     
}


const getInvitationById = async (invitationId: string) => {
    if (!invitationId) {
      throw new Error("Invitation ID is required")
    }

    const invitation = await prisma.invitation.findUnique({
      where: { 
        id: invitationId  
      }, 
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        invitedBy: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!invitation) {
      throw new Error("Invitation not found")
    }

    return invitation
  }     

const cencelInvitation = async (invitationId: string) => {
    if (!invitationId) {
      throw new Error("Invitation ID is required")
    }

    const invitation = await prisma.invitation.findUnique({
      where: { 
        id: invitationId  
      }
    })

    if (!invitation) {
      throw new Error("Invitation not found")
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new Error(`Invitation is ${invitation.status.toLowerCase()}`)
    }

    const updatedInvitation = await prisma.invitation.update({
      where: { 
        id: invitationId  
      },
      data: {
        status: InvitationStatus.CANCELLED,
      },
    })

    return updatedInvitation
  }   

  const deleteInvitation = async (invitationId: string) => {  
      if (!invitationId) {
        throw new Error("Invitation ID is required")
      }

      const invitation = await prisma.invitation.delete({
        where: { 
          id: invitationId  
        }
      })

      return invitation
}   

export const InvitationService = {
  sentInvitations,
  getInvitationByToken,
  acceptInvitation,
  getAllInvitations,
  getInvitationById,
  cencelInvitation,
  deleteInvitation
}