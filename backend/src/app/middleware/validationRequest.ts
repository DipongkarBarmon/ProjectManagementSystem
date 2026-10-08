import z from "zod";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";


type RequestWithFile = Request & {
    file?: any;
    files?: any;
};

export const validationRequest = (zodSchema : z.ZodObject) => {
    return catchAsync(async(req : RequestWithFile,res : Response,next : NextFunction)=> {
         // Enforce fallback objects so Zod never receives raw undefined parameters
        const bodyData = req.body || {};
        const dataToValidate = {
             body :bodyData,
            file: req.file || undefined,
            files: req.files || undefined, // Optional: handle multi-file uploads if using multer
        };

           const result = zodSchema.safeParse(dataToValidate)

           if(!result.success) {
              console.log(result.error.issues)
              throw new Error(result.error.issues[0].message)
           }

           req.body = result.data.body
           next()
    })
}