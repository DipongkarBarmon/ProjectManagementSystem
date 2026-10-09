import Rounter from "express";
import { OrganizationController } from "./organization.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { OrganizationValidation } from "./organization.validation";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { upload } from "../../lib/multer";
import { OrganizationRole, PlatformRole } from "../../../../generated/prisma/enums";
 

const router = Rounter()

router.post("/create-organization",auth({platformRoles:[PlatformRole.USER,PlatformRole.SUPER_ADMIN]}),upload.single("logo"),validationRequest(OrganizationValidation.CreateOrganizationSchema),OrganizationController.createOrganization)

router.post('/:organizationId/update-logo',auth({ permissions: [Permissions.ORG_UPDATE] }),upload.single("logo"),OrganizationController.updateLogo)

router.post('/:organizationId/update-OrganizationInfo',auth({ permissions: [Permissions.ORG_UPDATE] }),validationRequest(OrganizationValidation.UpdateOrganizationInfoZodSchema),OrganizationController.updateOrganizationInfo)
router.get('/get-all-organizations',validationRequest(OrganizationValidation.GetAllOrganizationZodSchema),OrganizationController.getAllOrganizations)
router.get('/:organizationId',OrganizationController.getOrganizationById)


router.delete('/:organizationId',auth({ permissions: [Permissions.ORG_UPDATE] }),OrganizationController.deleteOrganization)

router.get('/:organizationId/members', auth({ permissions: [Permissions.MEMBER_READ] }), OrganizationController.getMembers)
router.patch('/:organizationId/members/:memberId/role', auth({ permissions: [Permissions.MEMBER_UPDATE] }), OrganizationController.updateMemberRole)
router.delete('/:organizationId/members/:memberId', auth({ permissions: [Permissions.MEMBER_REMOVE] }), OrganizationController.removeMember)

export const OrganizationRouter = router