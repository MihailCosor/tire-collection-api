import { Request, Response, NextFunction } from 'express';
import { CreateVanOrderInput } from '../types/van';
import { CreateTruckOrderInput } from '../types/truck';

export const validateVanOrder = (req: Request, res: Response, next: NextFunction): void => {
  const orderData = req.body as CreateVanOrderInput;

  if (!orderData.serviceId || !orderData.operatorId || !orderData.vehicleId || 
      !orderData.destination || !orderData.tireCategories || !orderData.amount) {
    next(new Error('Missing required fields'));
    return;
  }

  if (!Array.isArray(orderData.tireCategories) || orderData.tireCategories.length === 0) {
    next(new Error('tireCategories must be a non-empty array'));
    return;
  }

  for (const tc of orderData.tireCategories) {
    if (!tc.tireCategoryId || !tc.quantity) {
      next(new Error('Each tire category must have tireCategoryId and quantity'));
      return;
    }
    if (typeof tc.quantity !== 'number' || tc.quantity <= 0) {
      next(new Error('Quantity must be a positive number'));
      return;
    }
  }

  next();
};

export const validateTruckOrder = (req: Request, res: Response, next: NextFunction): void => {
  const orderData = req.body as CreateTruckOrderInput;

  if (!orderData.serviceId || !orderData.operatorId || !orderData.vehicleId || 
      !orderData.destination || !orderData.tireCategories || !orderData.amount) {
    next(new Error('Missing required fields'));
    return;
  }

  if (!Array.isArray(orderData.tireCategories) || orderData.tireCategories.length === 0) {
    next(new Error('tireCategories must be a non-empty array'));
    return;
  }

  for (const tc of orderData.tireCategories) {
    if (!tc.tireCategoryId || !tc.quantity) {
      next(new Error('Each tire category must have tireCategoryId and quantity'));
      return;
    }
    if (typeof tc.quantity !== 'number' || tc.quantity <= 0) {
      next(new Error('Quantity must be a positive number'));
      return;
    }
  }

  next();
};