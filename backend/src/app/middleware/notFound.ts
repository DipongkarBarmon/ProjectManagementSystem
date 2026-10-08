import { Request, Response } from "express";
import httpStatus from "http-status";
export const notFound = (req : Request, res : Response) => {
    return res.status(httpStatus.NOT_FOUND).json({
       message : "Router is Not Found",
       path : req.originalUrl,
       date : new Date()
    })
}