import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { InvitationService } from "./invitation.service"

const sentInvitations = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const body = req.body
    const userId = req.user?.userId
    const organizationId = req.params.organizationId
  
    
    const result =await InvitationService.sentInvitations(body,organizationId as string,userId as string)
     
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.CREATED,
       message : "Invitation sent successfully!",
       data : result
    })
})

const getInvitationByToken = catchAsync(async(req: Request, res: Response) => {
    const result = await InvitationService.getInvitationByToken(req.params.token as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Invitation is valid",
        data: result,
    })
})

const acceptInvitation = catchAsync(async(req: Request, res: Response) => {
    const result = await InvitationService.acceptInvitation(
        req.params.token as string,
        req.user?.userId as string,
    )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Invitation accepted successfully",
        data: result,
    })
})


const getAllInvitations = catchAsync(async(req: Request, res: Response) => {

   const query = req.query
    const result = await InvitationService.getAllInvitations(query )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All invitations fetched successfully",
        data: result,
    })
})

const getInvitationById = catchAsync(async(req: Request, res: Response) => {
    const invitationId = req.params.invitationId
    const result = await InvitationService.getInvitationById(invitationId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Invitation fetched successfully",
        data: result,
    })
})  

const cencelInvitation = catchAsync(async(req: Request, res: Response) => {
    const invitationId = req.params.invitationId
    const result = await InvitationService.cencelInvitation(invitationId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Invitation cancelled successfully",
        data: result,
    })
})


const deleteInvitation = catchAsync(async(req: Request, res: Response) => {
    const invitationId = req.params.invitationId
    const result = await InvitationService.deleteInvitation(invitationId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Invitation deleted successfully",
        data: result,
    })
})


export const InvitationController = {
    sentInvitations,
    getInvitationByToken,
    acceptInvitation,
    getAllInvitations,
    getInvitationById,
    cencelInvitation,
    deleteInvitation
}