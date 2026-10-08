import z, { email, string } from "zod";


const ALLOWED_MULTI_TYPES = {
   image : ["image/jpeg", "image/jpg", "image/png", "image/webp"],
   pdf: ["application/pdf"],
   document: [
    "application/pdf", 
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],
  audio: ["audio/mpeg", "audio/wav", "audio/mp4"],
  video: ["video/mp4", "video/quicktime", "video/x-matroska"]
}

// Reusable single file validation engine
const singleFileEngine = (allowedTypes: string[], maxMB: number) =>{
   return z.object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string().refine(
        (type) => allowedTypes.includes(type),
        { message: `Invalid format. Expected: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}` }
      ),
      size: z.number().max(maxMB * 1024 * 1024, `Size exceeds limit of ${maxMB}MB`),
   })
}


const registerZodSchema = z.object({
  body: z.object({
    name : z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password : z.string()
               .min(8,{message : "Password must be at least 8 characters long"})
               .max(32,{message : "Password cannot exceed 32 characters"})
               .regex(/[A-Z]/,{message : "Password must contain at least one uppercase letter"})
               .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
							.regex(/[0-9]/, { message: "Password must contain at least one number" })
              .regex(/[^a-zA-Z0-9]/,{ message: "Password must contain at least one special character" }), 
  }),
  file :z.object({
     avatar :z.array(singleFileEngine(ALLOWED_MULTI_TYPES.image,10)).max(1,"Only 1 avatar allowed").optional()
  }).optional()
})

const verifyEmailZodSchema = z.object({
   body: z.object({
      email :z.string().email({message: "Invalid email address"}),
      otp : z.string()
   })
})

const loginZodSchema = z.object({
    body : z.object({
       email: z.string().email({message: "Invalid email address"}),
       password : z.string()
               .min(8,{message : "Password must be at least 8 characters long"})
               .max(32,{message : "Password cannot exceed 32 characters"})
               .regex(/[A-Z]/,{message : "Password must contain at least one uppercase letter"})
               .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
					.regex(/[0-9]/, { message: "Password must contain at least one number" })
              .regex(/[^a-zA-Z0-9]/,{ message: "Password must contain at least one special character" })

    })
})

const forgetPasswordZodSchema =z.object( {
    body:z.object({
       email: z.string().email({message: "Invalid email address"})
    })
})
const resetPasswordZodSchema =z.object({
   body:z.object({
      email: z.string().email({message: "Invalid email address"}),
      newPassword : z.string()
               .min(8,{message : "Password must be at least 8 characters long"})
               .max(32,{message : "Password cannot exceed 32 characters"})
               .regex(/[A-Z]/,{message : "Password must contain at least one uppercase letter"})
               .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
					.regex(/[0-9]/, { message: "Password must contain at least one number" })
              .regex(/[^a-zA-Z0-9]/,{ message: "Password must contain at least one special character" }),
      
      otp : z.string()
   })
})
export const AuthValidation = {
   registerZodSchema,
   verifyEmailZodSchema,
   loginZodSchema,
   forgetPasswordZodSchema,
   resetPasswordZodSchema
}