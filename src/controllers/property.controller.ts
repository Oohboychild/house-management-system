import { Request, Response, NextFunction } from 'express';
import { propertyService } from '../services/property.service.js';
import {
  createPropertySchema,
  updatePropertySchema,
} from '../validators/property.validator.js';

export class PropertyController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createPropertySchema.parse(req.body);
      const property = await propertyService.create(req.user!.userId, validatedData);

      res.status(201).json({
        success: true,
        message: 'Property created successfully',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await propertyService.findAll(
        req.user!.userId,
        req.user!.role
      );

      res.status(200).json({
        success: true,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertyService.findById(
        req.params.id,
        req.user!.userId,
        req.user!.role
      );

      res.status(200).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updatePropertySchema.parse(req.body);
      const property = await propertyService.update(
        req.params.id,
        req.user!.userId,
        req.user!.role,
        validatedData
      );

      res.status(200).json({
        success: true,
        message: 'Property updated successfully',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await propertyService.delete(
        req.params.id,
        req.user!.userId,
        req.user!.role
      );

      res.status(200).json({
        success: true,
        message: 'Property deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const propertyController = new PropertyController();