import { prisma } from "../../lib/prisma";

const getUserOrganizations = async (userId: string) => {
    const userOrganizations = await prisma.organizationMember.findMany({
        where: {
            userId
        },
        include: {
            organization: {
                include: {
                    members: true,
                    subscription: {
                        include: { plan: true }
                    }
                }
            }
        }
    });

    const organizations = userOrganizations.map(orgMember => ({
        ...orgMember.organization,
        currentUserRole: orgMember.organizationRole
    }));

    return {
        data: organizations
    }
}

export const UserService = {
    getUserOrganizations
}
