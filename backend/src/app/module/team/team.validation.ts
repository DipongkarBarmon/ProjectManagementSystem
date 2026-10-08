import { z } from "zod";

const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Team name must be at least 2 characters").max(100),
    description: z.string().max(500).optional(),
  }),
});

const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
  }),
});

const GetAllTeamsZodSchema = z.object({
   body : z.object({
      searchTerm : z.string().optional(),
      page : z.string().optional(),
      limit : z.string().optional(),
      sortOrder : z.string().optional(),
      sortBy : z.string().optional(),
      name : z.string().optional(),
      description : z.string().optional(),
			organizationId : z.string().uuid("Invalid organization ID format").optional(),
   }).optional()
})

const assignTeamLeadSchema = z.object({
  body: z.object({
    userId: z.string().uuid("Invalid user ID format"),
  }),
});

const addTeamMemberSchema = assignTeamLeadSchema; // Same structure

const GetAllTeamsMembersZodSchema = z.object({
   body : z.object({
      searchTerm : z.string().optional(),
      page : z.string().optional(),
      limit : z.string().optional(),
      sortOrder : z.string().optional(),
      sortBy : z.string().optional(),
      userId : z.string().uuid("Invalid user ID format").optional(),
   }).optional()
})

export const TeamValidation = {
  createTeamSchema,
  updateTeamSchema,
  assignTeamLeadSchema,
  addTeamMemberSchema,
  GetAllTeamsZodSchema,
  GetAllTeamsMembersZodSchema
};