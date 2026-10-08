import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtiles } from "../utils/jwt";
import { OrganizationRole, PlatformRole } from "../../../../generated/prisma/enums";
import { Permission } from "../config/permissions";
import { RolePermissions } from "../config/rolePermissions";

export interface RequestUser {
  email: string;
  name: string;
  userId: string;
  platformRole: PlatformRole;
  organizationRole?: OrganizationRole;
  organizationId?: string;
  permissions?: Permission[];
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export interface AuthOptions {
  platformRoles?: PlatformRole[];
  permissions?: Permission[];
}

// Example: auth({ permissions: [Permissions.PROJECT_CREATE] })
export const auth = (options: AuthOptions = {}) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      // 401 Unauthorized
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "You are not logged in. Please log in to access this resource.",
      });
    }

    const verifiedToken = jwtUtiles.varifyToken(token, config.jwt_access_secret);
    if (!verifiedToken.success) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: verifiedToken.error || "Invalid token.",
      });
    }
    const { email, name, userId, role } = verifiedToken.data as JwtPayload;

    if (options.platformRoles?.length && !options.platformRoles.includes(role)) {
      // 403 Forbidden
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Forbidden. You don't have platform permission to access this resource.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        email,
        name,
        platformRole: role,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found. Please log in again.",
      });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Your account has been blocked. Please contact support.",
      });
    }

    let organizationId: string | undefined;
    let organizationRole: OrganizationRole | undefined;
    let userPermissions: Permission[] = [];

    // Check organization level permissions if specified
    if (options.permissions?.length) {
      organizationId = req.params.organizationId as string;

      if (!organizationId) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Organization Id is required in the URL parameters for this resource.",
        });
      }

      const membership = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "Forbidden. You are not a member of this organization.",
        });
      }

      organizationRole = membership.organizationRole;
      userPermissions = RolePermissions[organizationRole] || [];

      // Check if user has ALL required permissions
      const hasAllRequired = options.permissions.every(perm => userPermissions.includes(perm));

      if (!hasAllRequired) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "Forbidden. You don't have the required permissions to access this organization resource.",
        });
      }
    }

    req.user = {
      email,
      name,
      userId,
      platformRole: user.platformRole,
      organizationId,
      organizationRole,
      permissions: userPermissions,
    };

    next();
  });
};
