import Router from "express"
import { auth } from "../../middleware/checkAuth"
import { validationRequest } from "../../middleware/validationRequest"
import { ProjectController } from "./project.controller"
import { ProjectValidation } from "./project.validation"
import { Permissions } from "../../config/permissions"

const router = Router()

router.post("/:organizationId/create-project",auth({permissions:[Permissions.PROJECT_CREATE]}), validationRequest(ProjectValidation.createProjectSchema), ProjectController.createProject)

router.get("/:organizationId/getAllprojects", auth({permissions:[Permissions.PROJECT_READ]}), validationRequest(ProjectValidation.GetAllOrganizationProjectsZodSchema), ProjectController.getAllProjects)

router.get("/:organizationId/projects/:projectId", auth({permissions:[Permissions.PROJECT_READ]}), ProjectController.getProject)

router.patch("/:organizationId/projects/:projectId", auth({permissions:[Permissions.PROJECT_UPDATE]}), validationRequest(ProjectValidation.updateProjectSchema), ProjectController.updateProject)

router.delete("/:organizationId/projects/:projectId", auth({permissions:[Permissions.PROJECT_ARCHIVE]}), ProjectController.permanentlyDeleteProject)


router.patch("/:organizationId/projects/:projectId/manager", auth({permissions:[Permissions.PROJECT_UPDATE]}), validationRequest(ProjectValidation.assignProjectManagerSchema), ProjectController.assignProjectManager)

router.patch("/:organizationId/projects/:projectId/members",auth({permissions:[Permissions.PROJECT_UPDATE]}), validationRequest(ProjectValidation.projectMemberSchema), ProjectController.addMember)

router.delete("/:organizationId/projects/:projectId/members/:userId", auth({permissions:[Permissions.PROJECT_UPDATE]}), ProjectController.removeMember)


export const ProjectRouter = router
