import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleware/checkAuth";
import { PlatformRole } from "../../../../generated/prisma/enums";

const router = Router();

// This endpoint is accessible to any authenticated platform user
router.get("/my-organizations", auth({ platformRoles: [PlatformRole.USER, PlatformRole.SUPER_ADMIN] }), UserController.getUserOrganizations);

router.get("/admin/all", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), UserController.getAllUsersForAdmin);
router.patch("/admin/:id/block", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), UserController.toggleBlockUser);
router.delete("/admin/:id", auth({ platformRoles: [PlatformRole.SUPER_ADMIN] }), UserController.softDeleteUser);

export const UserRouter = router;
