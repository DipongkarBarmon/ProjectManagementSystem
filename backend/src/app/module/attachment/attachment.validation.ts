import { z } from "zod";
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
  const createAttachmentSchema = z.object({
   files : z.array(singleFileEngine([...ALLOWED_MULTI_TYPES.image, ...ALLOWED_MULTI_TYPES.pdf, ...ALLOWED_MULTI_TYPES.document, ...ALLOWED_MULTI_TYPES.audio, ...ALLOWED_MULTI_TYPES.video],10)).max(10,"Only 10 files allowed")
})  

export const AttachmentValidation = {
   createAttachmentSchema
}