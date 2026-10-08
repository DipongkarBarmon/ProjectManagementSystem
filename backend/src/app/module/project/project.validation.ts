import z from "zod"
import { ProjectStatus } from "../../../../generated/prisma/enums"

const createProjectSchema = z.object({
	body: z.object({
		name: z.string().min(1),
		description: z.string().optional(),
		slug: z.string().min(3).optional(),
		startDate: z.union([z.string(), z.date()]).nullable().optional(),
		endDate: z.union([z.string(), z.date()]).nullable().optional(),
	}),
})

const updateProjectSchema = z.object({
	body: z.object({
		name: z.string().min(1).optional(),
		description: z.string().optional(),
		status: z.enum(ProjectStatus).optional(),
		startDate: z.union([z.string(), z.date()]).nullable().optional(),
		endDate: z.union([z.string(), z.date()]).nullable().optional(),
	}),
})

const projectMemberSchema = z.object({
	body: z.object({
		memberId: z.string().uuid(),
	}),
})
const GetAllOrganizationProjectsZodSchema = z.object({
   body : z.object({
      searchTerm : z.string().optional(),
      page : z.string().optional(),
      limit : z.string().optional(),
      sortOrder : z.string().optional(),
      sortBy : z.string().optional(),
      name : z.string().optional(),
      description : z.string().optional(),
      slug : z.string().optional(),
      startDate : z.string().optional(),
      endDate : z.string().optional(),
			organizationId : z.string().uuid("Invalid organization ID format").optional(),
   }).optional()
})

const assignProjectManagerSchema = projectMemberSchema

export const ProjectValidation = {
	createProjectSchema,
  GetAllOrganizationProjectsZodSchema,
	updateProjectSchema,
	projectMemberSchema,
	assignProjectManagerSchema,
}
