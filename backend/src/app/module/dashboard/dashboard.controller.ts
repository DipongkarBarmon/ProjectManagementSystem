import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { DashboardService } from './dashboard.service';

const getStats = catchAsync(async (req: Request, res: Response) => {
  const { organizationId } = req.params;
  const result = await DashboardService.getStats(organizationId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: result
  });
});

export const DashboardController = {
  getStats
};
