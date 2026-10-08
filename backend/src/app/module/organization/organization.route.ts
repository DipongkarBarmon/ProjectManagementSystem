import Rounter from "express";
import { OrganizationController } from "./organization.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { OrganizationValidation } from "./organization.validation";
import { auth } from "../../middleware/checkAuth";
import { upload } from "../../lib/multer";
import { OrganizationRole, PlatformRole } from "../../../../generated/prisma/enums";
 

const router = Rounter()

router.post("/create-organization",auth({platformRoles:[PlatformRole.USER,PlatformRole.SUPER_ADMIN]}),upload.single("logo"),validationRequest(OrganizationValidation.CreateOrganizationSchema),OrganizationController.createOrganization)

router.post('/:organizationId/update-logo',auth({organizationRoles:[OrganizationRole.ORG_ADMIN]}),upload.single("logo"),OrganizationController.updateLogo)

router.post('/:organizationId/update-OrganizationInfo',auth({organizationRoles:[OrganizationRole.ORG_ADMIN]}),validationRequest(OrganizationValidation.UpdateOrganizationInfoZodSchema),OrganizationController.updateOrganizationInfo)
router.get('/get-all-organizations',validationRequest(OrganizationValidation.GetAllOrganizationZodSchema),OrganizationController.getAllOrganizations)
router.get('/:organizationId',OrganizationController.getOrganizationById)


router.delete('/:organizationId',auth({organizationRoles:[OrganizationRole.ORG_ADMIN]}),OrganizationController.deleteOrganization)

export const OrganizationRouter = router