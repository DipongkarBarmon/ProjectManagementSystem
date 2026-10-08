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


export const OrganizationController = {
    createOrganization,
    updateLogo,
    updateOrganizationInfo,
    getOrganizationById,
    getAllOrganizations,
    deleteOrganization
}