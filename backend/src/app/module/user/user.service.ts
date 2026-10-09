import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../../generated/prisma/enums";

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

const getAllUsersForAdmin = async (query: any) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count();

    return {
        data: users,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
};

const toggleBlockUser = async (userId: string, isBlocked: boolean) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status: isBlocked ? UserStatus.BLOCKED : UserStatus.ACTIVE }
    });
};

const softDeleteUser = async (userId: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { isDeleted: true, deletedAt: new Date(), status: UserStatus.DELETED }
    });
};

export const UserService = {
    getUserOrganizations,
    getAllUsersForAdmin,
    toggleBlockUser,
    softDeleteUser
}
