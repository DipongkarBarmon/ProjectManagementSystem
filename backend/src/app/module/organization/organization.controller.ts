import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { OrganizationService } from "./organization.service"
const createOrganization = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const body = req.body
    const payload = req.file
    const userId = req.user?.userId
    console.log("userId",userId)
    if(!payload){
       throw new Error("No File Provided!")
   }
    const result =await OrganizationService.createOrganization(body, payload?.buffer,userId as string)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.CREATED,
       message : "Organization created successfully!",
       data : result
    })
})
const updateLogo = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const organizationId = req.params.organizationId
    const payload = req.file
    const userId = req.user?.userId

    if(!payload){
       throw new Error("No File Provided!")
   }
    const result =await OrganizationService.updateLogo(payload?.buffer,userId as string,organizationId as string)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.CREATED,
       message : "Organization logo updated successfully!",
       data : result.data
    })
})

const updateOrganizationInfo = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const organizationId = req.params.organizationId
    const body = req.body
    const userId = req.user?.userId

    const result =await OrganizationService.updateOrganizationInfo(body,userId as string,organizationId as string)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.CREATED,
       message : "Organization info updated successfully!",
       data : result
    })
})

const getOrganizationById = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const organizationId = req.params.organizationId
    const result =await OrganizationService.getOrganizationById(organizationId as string)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.OK,
       message : "Organization fetched successfully!",
       data : result.data
    })
}) 

const getAllOrganizations = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    
    const query = req.query
    const result =await OrganizationService.getAllOrganizations(query)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.OK,
       message : "Organizations fetched successfully!",
       data : result.data,
       meta : result.meta
    })
})

const deleteOrganization = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const organizationId = req.params.organizationId
    const userId = req.user?.userId
    const result =await OrganizationService.deleteOrganization(organizationId as string, userId as string)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.OK,
       message : "Organization deleted successfully!",
       data : result.data
    })
})


const getMembers = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const organizationId = req.params.organizationId
    const query = req.query
    const result =await OrganizationService.getMembers(organizationId as string, query)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.OK,
       message : "Organization members fetched successfully!",
       data : result.data,
       meta : result.meta
    })
})

const updateMemberRole = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const organizationId = req.params.organizationId
    const memberId = req.params.memberId
    const userId = req.user?.userId
    const { role } = req.body
    const result =await OrganizationService.updateMemberRole(organizationId as string, memberId as string, role, userId as string)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.OK,
       message : "Member role updated successfully!",
       data : result.data
    })
})

const removeMember = catchAsync(async(req : Request,res : Response , next : NextFunction)=> {
    const organizationId = req.params.organizationId
    const memberId = req.params.memberId
    const userId = req.user?.userId
    const result =await OrganizationService.removeMember(organizationId as string, memberId as string, userId as string)
    sendResponse(res,{
       success: true,
       statusCode : httpStatus.OK,
       message : "Member removed successfully!",
       data : result.data
    })
})

export const OrganizationController = {
    createOrganization,
    updateLogo,
    updateOrganizationInfo,
    getOrganizationById,
    getAllOrganizations,
    deleteOrganization,
    getMembers,
    updateMemberRole,
    removeMember
}