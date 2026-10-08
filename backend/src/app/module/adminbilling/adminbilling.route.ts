import { Router } from "express";
import { AdminBillingController } from "./adminbilling.controller";
import { auth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { PlatformRole } from "../../../../generated/prisma/enums";

const adminRouter = Router();

adminRouter.get("/plans", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getPlans);
adminRouter.get("/subscriptions", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getAllSubscriptions);
adminRouter.get("/payments/pending", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getPendingPayments);
adminRouter.get("/payments", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getAllPayments);
adminRouter.get("/payments/:paymentId", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), AdminBillingController.getPaymentById);


adminRouter.get("/bkash/callback", AdminBillingController.bkashCallback);

export const AdminBillingRoutes = adminRouter;
