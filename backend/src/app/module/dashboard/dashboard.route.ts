import express from 'express';
import auth from '../../middlewares/auth';
import { DashboardController } from './dashboard.controller';
import { Permissions } from '../authorization/authorization.constants';

const router = express.Router();

router.get(
  '/:organizationId/stats',
  auth({ permissions: [Permissions.ORGANIZATION_READ] }),
  DashboardController.getStats
);

export const DashboardRoutes = router;
