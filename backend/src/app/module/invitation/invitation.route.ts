
import Router from "express"
import { InvitationController } from "./invitation.controller"
import { OrganizationRole, PlatformRole } from "../../../../generated/prisma/enums"
import { auth } from "../../middleware/checkAuth"
import { validationRequest } from "../../middleware/validationRequest"
import { InvitationValidation } from "./invitation.validation"

const router = Router()

router.post("/:organizationId/sent-invitation",auth({organizationRoles: [OrganizationRole.ORG_ADMIN]}),validationRequest(InvitationValidation.sentInvitationZodSchema),InvitationController.sentInvitations)

router.get("/:token", InvitationController.getInvitationByToken)

router.post("/:token/accept", auth({platformRoles:[PlatformRole.USER]}), InvitationController.acceptInvitation)

router.get("/:organizationId/invitations",auth({organizationRoles: [OrganizationRole.ORG_ADMIN]}),validationRequest(InvitationValidation.GetAllInvitationsZodSchema),InvitationController.getAllInvitations)

router.get("/:organizationId/invitations/:invitationId",auth({organizationRoles: [OrganizationRole.ORG_ADMIN]}),InvitationController.getInvitationById)

router.patch("/:organizationId/invitations/:invitationId/cancel",auth({organizationRoles: [OrganizationRole.ORG_ADMIN]}),InvitationController.cencelInvitation)



export const InvitationRouter = router