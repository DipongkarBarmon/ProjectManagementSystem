import { Router } from "express";
import { AdminBillingController } from "./adminbilling.controller";
import { auth } from "../../middleware/checkAuth";
import { Permissions } from "../../config/permissions";
import { validationRequest } from "../../middleware/validationRequest";
import { PlatformRole } from "../../../../generated/prisma/enums";
import { createPlanSchema, updatePlanSchema } from "./adminbilling.validation";

const adminRouter = Router();

adminRouter.get("/plans", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getPlans);
adminRouter.post("/plans", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), validationRequest(createPlanSchema), AdminBillingController.createPlan);
adminRouter.patch("/plans/:planId", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), validationRequest(updatePlanSchema), AdminBillingController.updatePlan);
adminRouter.get("/subscriptions", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getAllSubscriptions);
adminRouter.get("/payments/pending", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getPendingPayments);
adminRouter.get("/payments", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getAllPayments);
adminRouter.get("/payments/:paymentId", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getPaymentById);


adminRouter.get("/bkash/callback", AdminBillingController.bkashCallback);

export const AdminBillingRoutes = adminRouter;
