import Router from "express"
import { auth } from "../../middleware/checkAuth"
import { validationRequest } from "../../middleware/validationRequest"
import { ProjectController } from "./project.controller"
import { ProjectValidation } from "./project.validation"
import { OrganizationRole } from "../../../../generated/prisma/enums"

const router = Router()

router.post("/:organizationId/create-project",auth({organizationRoles:[OrganizationRole.ORG_ADMIN]}), validationRequest(ProjectValidation.createProjectSchema), ProjectController.createProject)

router.get("/:organizationId/getAllprojects", auth({organizationRoles:[OrganizationRole.ORG_ADMIN]}), validationRequest(ProjectValidation.GetAllOrganizationProjectsZodSchema), ProjectController.getAllProjects)

router.get("/:organizationId/projects/:projectId", auth({organizationRoles:[OrganizationRole.ORG_ADMIN,OrganizationRole.MEMBER,OrganizationRole.PROJECT_MANAGER,OrganizationRole.TEAM_LEAD]}), ProjectController.getProject)

router.patch("/:organizationId/projects/:projectId", auth({organizationRoles:[OrganizationRole.ORG_ADMIN]}), validationRequest(ProjectValidation.updateProjectSchema), ProjectController.updateProject)

router.delete("/:organizationId/projects/:projectId", auth({organizationRoles:[OrganizationRole.ORG_ADMIN]}), ProjectController.deleteProject)


router.patch("/:organizationId/projects/:projectId/manager", auth({organizationRoles:[OrganizationRole.ORG_ADMIN]}), validationRequest(ProjectValidation.assignProjectManagerSchema), ProjectController.assignProjectManager)

router.patch("/:organizationId/projects/:projectId/members",auth({organizationRoles:[OrganizationRole.ORG_ADMIN]}), validationRequest(ProjectValidation.projectMemberSchema), ProjectController.addMember)

router.delete("/:organizationId/projects/:projectId/members/:userId", auth(), ProjectController.removeMember)


export const ProjectRouter = router
