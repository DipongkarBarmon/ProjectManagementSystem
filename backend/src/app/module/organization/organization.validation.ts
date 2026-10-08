import z from "zod";


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

const CreateOrganizationSchema = z.object({
   body : z.object({
      name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
      slug: z.string().min(3, { message: "Slug must be at least 3 characters long" }),
      description: z.string().optional(),
   }),
   file : z.object({
      logo : z.array(singleFileEngine(ALLOWED_MULTI_TYPES.image,10)).max(1,"Only 1 logo allowed").optional()
   }).optional()
})

const UpdateLogoZodSchema = z.object({
   file : z.object({
      logo : z.array(singleFileEngine(ALLOWED_MULTI_TYPES.image,10)).max(1,"Only 1 logo allowed").optional()
   }).optional()
})

const UpdateOrganizationInfoZodSchema = z.object({
   body : z.object({
      name: z.string().min(3, { message: "Name must be at least 3 characters long" }).optional(),
      slug: z.string().min(3, { message: "Slug must be at least 3 characters long" }).optional(),
      description: z.string().optional(),
   })
})

const GetAllOrganizationZodSchema = z.object({
   body : z.object({
      searchTerm : z.string().optional(),
      page : z.string().optional(),
      limit : z.string().optional(),
      sortOrder : z.string().optional(),
      sortBy : z.string().optional(),
      name : z.string().optional(),
      slug : z.string().optional(),
      description : z.string().optional()
   }).optional()
})
export const OrganizationValidation = {
   CreateOrganizationSchema,
   UpdateLogoZodSchema,
   UpdateOrganizationInfoZodSchema,
   GetAllOrganizationZodSchema
}