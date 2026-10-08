import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
 
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";

import { jwtUtiles } from "../utils/jwt";
import { OrganizationRole, PlatformRole } from "../../../generated/prisma/enums";
 

export interface RequestUser {
				email: string;
				name: string;
				userId: string;
				platformRole:PlatformRole;
				organizationRole? : OrganizationRole,
				organizationId? : string
			};

declare global {
	namespace Express {
		interface Request {
			user?: RequestUser
		}
	}
}

interface AuthOptions {
	 platformRoles? :PlatformRole[],
	 organizationRoles?: OrganizationRole[]
}


// auth(Role.ADMIN, Role.USER, Role.Author)
// auth() => ...requiredRoles => [Role.ADMIN, Role.USER, Role.AUTHOR]
export const auth = (options: AuthOptions ={}) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const token = req.cookies.accessToken
			? req.cookies.accessToken
			: req.headers.authorization?.startsWith("Bearer ")
				? req.headers.authorization?.split(" ")[1]
				: req.headers.authorization;

		if (!token) {
			throw new Error(
				"You are not logged in. Please log in to access this resource.",
			);
		}

		const verifiedToken = jwtUtiles.varifyToken(token, config.jwt_access_secret);

		 if(!verifiedToken.success){
			 throw new Error(verifiedToken.error)
		 }
		const { email, name, userId, role } = verifiedToken.data as JwtPayload;

		if (options.platformRoles?.length && !options.platformRoles.includes(role)) {
			throw new Error(
				"Forbidden. You don't have permission to access this resource.",
			);
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
			throw new Error("User not found. Please log in again.");
		}

		if (user.status === "BLOCKED") {
			throw new Error("Your account has been blocked. Please contact support.");
		}


		let organizationId : string|undefined
		let organizationRole : OrganizationRole|undefined

		if(options.organizationRoles?.length){
			  organizationId = req.params.organizationId as string

				if(!organizationId){
					 throw new Error("Organization Id is required!")
				}

				console.log("Organization Id:", organizationId, "User Id:", userId);
			  const membership = await prisma.organizationMember.findUnique({
           where: {
						organizationId_userId: {
							organizationId,
							userId,
         	 }, 
        	},
      	});

				if(!membership){
					throw new Error("You are not a member of this organization")
				}

				organizationRole = membership.organizationRole

				if(!options.organizationRoles.includes(organizationRole)){
					 throw new Error(
            "Forbidden. You don't have permission to access this organization resource.",
           );
				}
		}



		req.user = {
			email,
			name,
			userId,
			platformRole:user.platformRole,
			organizationId,
			organizationRole
		};

		next();
	});
};
