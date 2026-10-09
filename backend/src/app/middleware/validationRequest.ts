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
        const dataToValidate = {
             body : req.body || {},
             query: req.query || {},
             params: req.params || {},
            file: req.file || undefined,
            files: req.files || undefined,
        };

           const result = zodSchema.safeParse(dataToValidate)

           if(!result.success) {
              console.log(result.error.issues)
              throw new Error(result.error.issues[0].message)
           }

           // Express exposes `query` and `params` through getter-backed
           // properties in newer versions, so assigning to them throws.
           // Controllers can safely read the validated request values directly.
           if (result.data.body) req.body = result.data.body;
           next()
    })
}