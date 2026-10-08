import z from "zod"

const sentInvitationZodSchema = z.object({
   body : z.object({
      email: z.string().email({ message: "Invalid email address" }),
      organizationRole: z.string().min(3, { message: "Role must be at least 3 characters long" }),
   })
})

const GetAllInvitationsZodSchema = z.object({
   body : z.object({
      searchTerm : z.string().optional(),
      page : z.string().optional(),
      limit : z.string().optional(),
      sortOrder : z.string().optional(),
      sortBy : z.string().optional(),
      email : z.string().optional(),
      organizationRole : z.string().optional(),
      status : z.string().optional(),
      acceptedAt: z.coerce.date().optional(),
      expiresAt: z.coerce.date().optional(),
   }).optional()
})
export const InvitationValidation = {
   sentInvitationZodSchema,
   GetAllInvitationsZodSchema
}