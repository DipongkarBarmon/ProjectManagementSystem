import { PrismaClient, ProjectStatus, TaskStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const getStats = async (organizationId: string) => {
  // Check if organization exists
  const org = await prisma.organization.findUnique({
    where: { id: organizationId, deletedAt: null }
  });

  if (!org) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }

  // Get counts concurrently
  const [activeProjects, openTasks, completedTasks, teamMembers] = await Promise.all([
    prisma.project.count({
      where: {
        organizationId,
        status: { not: ProjectStatus.ARCHIVED },
        deletedAt: null
      }
    }),
    prisma.task.count({
      where: {
        organizationId,
        status: { notIn: [TaskStatus.DONE, TaskStatus.CANCELLED] },
        deletedAt: null
      }
    }),
    prisma.task.count({
      where: {
        organizationId,
        status: TaskStatus.DONE,
        deletedAt: null
      }
    }),
    prisma.organizationMember.count({
      where: {
        organizationId
      }
    })
  ]);

  return {
    activeProjects,
    openTasks,
    completedTasks,
    teamMembers
  };
};

export const DashboardService = {
  getStats
};
