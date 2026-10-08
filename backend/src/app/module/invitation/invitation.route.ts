
import Router from "express"
import { InvitationController } from "./invitation.controller"
import { OrganizationRole, PlatformRole } from "../../../../generated/prisma/enums"
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { validationRequest } from "../../middleware/validationRequest"
import { InvitationValidation } from "./invitation.validation"

const router = Router()

router.post("/:organizationId/sent-invitation",auth({ permissions: [Permissions.MEMBER_INVITE] }), validationRequest(InvitationValidation.sentInvitationZodSchema), InvitationController.sentInvitations)

router.get("/:token", InvitationController.getInvitationByToken)

router.post("/:token/accept", auth({platformRoles:[PlatformRole.USER]}), InvitationController.acceptInvitation)

router.get("/:organizationId/invitations",auth({ permissions: [Permissions.MEMBER_READ] }), validationRequest(InvitationValidation.GetAllInvitationsZodSchema), InvitationController.getAllInvitations)

router.get("/:organizationId/invitations/:invitationId",auth({ permissions: [Permissions.MEMBER_READ] }), InvitationController.getInvitationById)

router.patch("/:organizationId/invitations/:invitationId/cancel",auth({ permissions: [Permissions.MEMBER_REMOVE] }), InvitationController.cencelInvitation)



export const InvitationRouter = router