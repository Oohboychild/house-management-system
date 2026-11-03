import { Router } from 'express';
import { propertyController } from '../controllers/property.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

// All property routes require authentication
router.use(authenticate);

// Only Landlord and Admin can create/update/delete
router.post(
  '/',
  authorize(Role.LANDLORD, Role.ADMIN),
  propertyController.create.bind(propertyController)
);

router.get('/', propertyController.findAll.bind(propertyController));

router.get('/:id', propertyController.findById.bind(propertyController));

router.put(
  '/:id',
  authorize(Role.LANDLORD, Role.ADMIN),
  propertyController.update.bind(propertyController)
);

router.delete(
  '/:id',
  authorize(Role.LANDLORD, Role.ADMIN),
  propertyController.delete.bind(propertyController)
);

export default router;