import { Router } from "express";
import { TeamController } from "./team.controller";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { validationRequest } from "../../middleware/validationRequest";
 
import { TeamValidation } from "./team.validation";

const router = Router({ mergeParams: true });


router.post("/:organizationId/create-teams", auth({ permissions: [Permissions.TEAM_CREATE] }), validationRequest(TeamValidation.createTeamSchema), TeamController.createTeam);

router.get("/:organizationId/get-all-teams", auth({ permissions: [Permissions.TEAM_READ] }), TeamController.getAllTeams);

router.get("/:organizationId/get-team/:teamId", auth({ permissions: [Permissions.TEAM_READ] }), TeamController.getTeamById);

router.patch("/:organizationId/update-team/:teamId", auth({ permissions: [Permissions.TEAM_UPDATE] }), validationRequest(TeamValidation.updateTeamSchema), TeamController.updateTeam);

router.delete("/:organizationId/delete-team/:teamId", auth({ permissions: [Permissions.TEAM_DELETE] }), TeamController.deleteTeam);

router.post("/:organizationId/add-team-leader/:teamId", auth({ permissions: [Permissions.TEAM_UPDATE] }), validationRequest(TeamValidation.assignTeamLeadSchema), TeamController.assignTeamLead);

router.post("/:organizationId/add-team-member/:teamId", auth({ permissions: [Permissions.TEAM_UPDATE] }), validationRequest(TeamValidation.addTeamMemberSchema), TeamController.addTeamMember);

router.delete("/:organizationId/:teamId/delete-member/:userId", auth({ permissions: [Permissions.TEAM_UPDATE] }), TeamController.removeTeamMember);

router.get("/:organizationId/:teamId/view-members", auth({ permissions: [Permissions.TEAM_READ] }), TeamController.viewTeamMembers);

export const TeamRoutes = router;
