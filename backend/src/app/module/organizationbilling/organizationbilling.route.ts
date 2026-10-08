import { Router } from "express";
import { OrganizationBillingController } from "./organizationbilling.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { upgradePlanSchema } from "./organizationbilling.validation";
import { OrganizationRole } from "../../../../generated/prisma/enums";

const router = Router({ mergeParams: true });


router.post("/organizations/:organizationId/upgrade-billing", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(upgradePlanSchema), OrganizationBillingController.requestUpgrade);

router.get("/organizations/:organizationId/get-billing", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), OrganizationBillingController.getBillingOverview);
 
router.get("/organizations/:organizationId/usage", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN, OrganizationRole.PROJECT_MANAGER] }), OrganizationBillingController.getUsage);

router.get("/organizations/:organizationId/invoices", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), OrganizationBillingController.getInvoices);

router.get("/organizations/:organizationId/payments", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), OrganizationBillingController.getPayments);

  router.post("/organizations/:organizationId/downgrade", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), validationRequest(upgradePlanSchema), OrganizationBillingController.requestDowngrade);

  router.post("/organizations/:organizationId/cancel", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), OrganizationBillingController.cancelSubscription);
  router.post("/organizations/:organizationId/resume", auth({ organizationRoles: [OrganizationRole.ORG_ADMIN] }), OrganizationBillingController.resumeSubscription);

export const OrganizationBillingRoutes = router;  
