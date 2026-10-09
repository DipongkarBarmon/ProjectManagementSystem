import { Router } from "express";
import { OrganizationBillingController } from "./organizationbilling.controller";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { validationRequest } from "../../middleware/validationRequest";
import { upgradePlanSchema } from "./organizationbilling.validation";

const router = Router({ mergeParams: true });

router.get("/available-plans", auth(), OrganizationBillingController.getAvailablePlans);

router.post("/organizations/:organizationId/upgrade-billing", auth({ permissions: [Permissions.BILLING_MANAGE] }), validationRequest(upgradePlanSchema), OrganizationBillingController.requestUpgrade);

router.get("/organizations/:organizationId/get-billing", auth({ permissions: [Permissions.BILLING_READ] }), OrganizationBillingController.getBillingOverview);
 
router.get("/organizations/:organizationId/usage", auth({ permissions: [Permissions.BILLING_READ] }), OrganizationBillingController.getUsage);

router.get("/organizations/:organizationId/invoices", auth({ permissions: [Permissions.BILLING_MANAGE] }), OrganizationBillingController.getInvoices);

router.get("/organizations/:organizationId/payments", auth({ permissions: [Permissions.BILLING_MANAGE] }), OrganizationBillingController.getPayments);

  router.post("/organizations/:organizationId/downgrade", auth({ permissions: [Permissions.BILLING_MANAGE] }), validationRequest(upgradePlanSchema), OrganizationBillingController.requestDowngrade);

  router.post("/organizations/:organizationId/cancel", auth({ permissions: [Permissions.BILLING_MANAGE] }), OrganizationBillingController.cancelSubscription);
  router.post("/organizations/:organizationId/resume", auth({ permissions: [Permissions.BILLING_MANAGE] }), OrganizationBillingController.resumeSubscription);

export const OrganizationBillingRoutes = router;  
