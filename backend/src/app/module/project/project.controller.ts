import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { ProjectService } from "./project.service"

const createProject = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
    const body = req.body
    const organizationId = req.params.organizationId
    const userId = req.user?.userId

    const result = await ProjectService.createProject( organizationId as string, userId as string, body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Project created successfully!",
        data: result
    })
})

const getAllProjects = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
    const organizationId = req.params.organizationId
    const query = req.query

    const result = await ProjectService.getAllProjects(
        organizationId as string,
        query  
    )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Projects fetched successfully!",
        data: result.data,
        meta: result.meta
    })
})

const getProject = catchAsync(async(
    req : Request,
    res : Response,
    next : NextFunction
) => {
    const organizationId = req.params.organizationId
    const projectId = req.params.projectId
    const userId = req.user?.userId

    const result = await ProjectService.getProject(
        organizationId as string,
        projectId as string,
    )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project fetched successfully!",
        data: result
    })
})



const updateProject = catchAsync(async(req : Request,res : Response,next : NextFunction) => {
    const organizationId = req.params.organizationId
    const projectId = req.params.projectId
    const userId = req.user?.userId
    const body = req.body

    const result = await ProjectService.updateProject(
        organizationId as string,
        projectId as string,
        userId as string,
        body
    )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project updated successfully!",
        data: result
    })
})

const deleteProject = catchAsync(async(
    req : Request,
    res : Response,
    next : NextFunction
) => {
    const organizationId = req.params.organizationId
    const projectId = req.params.projectId
    const userId = req.user?.userId

    const result = await ProjectService.deleteProject(organizationId as string, projectId as string, userId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project deleted successfully!",
        data: result
    })
})

const assignProjectManager = catchAsync(async(req : Request,res : Response, next : NextFunction) => {
    const organizationId = req.params.organizationId
    const projectId = req.params.projectId
    const memberId = req.body.memberId
    const userId = req.user?.userId
    console.log("memberId",memberId)
    const result = await ProjectService.assignProjectManager(organizationId as string,projectId as string,memberId, userId as string )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project manager assigned successfully!",
        data: result
    })
})

const addMember = catchAsync(async(req : Request,res : Response, next : NextFunction) => {
    const organizationId = req.params.organizationId
    const projectId = req.params.projectId
    const memberId = req.body.memberId
    const userId = req.user?.userId

    const result = await ProjectService.addMember(
        organizationId as string,
        projectId as string,
        memberId,
        userId as string
    )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Project member added successfully!",
        data: result
    })
})

const removeMember = catchAsync(async(req : Request,res : Response, next : NextFunction) => {
    const organizationId = req.params.organizationId
    const projectId = req.params.projectId
    const memberId = req.params.userId
    const userId = req.user?.userId

    const result = await ProjectService.removeMember(
        organizationId as string,
        projectId as string,
        memberId as string,
        userId as string
    )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project member removed successfully!",
        data: result
    })
})

 

export const ProjectController = { 
  createProject,
   getAllProjects,
    getProject,
     updateProject,
      deleteProject, 
      assignProjectManager,
       addMember,
        removeMember, 
    
       }
