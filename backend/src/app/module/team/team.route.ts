import { Router } from "express";
import { TeamController } from "./team.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
 
import { OrganizationRole } from "../../../../generated/prisma/enums";
import { TeamValidation } from "./team.validation";

const router = Router({ mergeParams: true });

const ALL_ROLES = [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER, OrganizationRole.TEAM_LEAD, OrganizationRole.MEMBER];

router.post("/:organizationId/create-teams", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(TeamValidation.createTeamSchema), TeamController.createTeam);

router.get("/:organizationId/get-all-teams", auth({ organizationRoles: ALL_ROLES }), TeamController.getAllTeams);

router.get("/:organizationId/get-team/:teamId", auth({ organizationRoles: ALL_ROLES }), TeamController.getTeamById);

router.patch("/:organizationId/update-team/:teamId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.TEAM_LEAD] }), validationRequest(TeamValidation.updateTeamSchema), TeamController.updateTeam);

router.delete("/:organizationId/delete-team/:teamId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), TeamController.deleteTeam);

router.post("/:organizationId/add-team-leader/:teamId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(TeamValidation.assignTeamLeadSchema), TeamController.assignTeamLead);

router.post("/:organizationId/add-team-member/:teamId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.TEAM_LEAD] }), validationRequest(TeamValidation.addTeamMemberSchema), TeamController.addTeamMember);

router.delete("/:organizationId/:teamId/delete-member/:userId", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.TEAM_LEAD] }), TeamController.removeTeamMember);

router.get("/:organizationId/:teamId/view-members", auth({ organizationRoles: ALL_ROLES }), TeamController.viewTeamMembers);

 

export const TeamRoutes = router;
