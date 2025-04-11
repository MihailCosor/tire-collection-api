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

export const validateOperatorAction = (req: any, res: any, next: any) => {
  const { operatorId, actionType } = req.body;

  const errors = [];

  if (!operatorId) {
    errors.push('operatorId is required');
  } else if (typeof operatorId !== 'number' || operatorId <= 0) {
    errors.push('operatorId must be a positive number');
  }

  if (!actionType) {
    errors.push('actionType is required');
  } else {
    const validActionTypes = ['dublare', 'sortare', 'incarcare', 'descarcare', 'predare_bani'];
    if (!validActionTypes.includes(actionType)) {
      errors.push(`actionType must be one of: ${validActionTypes.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};