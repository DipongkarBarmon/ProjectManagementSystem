import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleware/checkAuth";
import { PlatformRole } from "../../../../generated/prisma/enums";

const router = Router();

// This endpoint is accessible to any authenticated platform user
router.get("/my-organizations", auth({ platformRoles: [PlatformRole.USER, PlatformRole.SUPER_ADMIN] }), UserController.getUserOrganizations);

export const UserRouter = router;
