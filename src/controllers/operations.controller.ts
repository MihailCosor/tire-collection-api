import { Request, Response } from 'express';
import * as operationsService from '../services/operations.service';
import { CreateWeighingInput } from '../types/operations';

export const createWeighing = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.orderId);
    
    if (isNaN(orderId)) {
      res.status(400).json({ error: 'invalid order id' });
      return;
    }

    const weighingData: CreateWeighingInput = req.body;
    
    if (!weighingData.weight || typeof weighingData.weight !== 'number' || weighingData.weight <= 0) {
      res.status(400).json({ error: 'weight must be a positive number' });
      return;
    }
    
    const weighing = await operationsService.createWeighing(orderId, weighingData);
    res.status(201).json({
      ...weighing,
      message: 'weighing record created successfully'
    });
  } catch (error: any) {
    console.error('error creating weighing record:', error);
    
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'failed to create weighing record' });
    }
  }
};

export const createDropZoneUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.orderId);
    
    if (isNaN(orderId)) {
      res.status(400).json({ error: 'invalid order id' });
      return;
    }
    
    const dropZoneUpdate = await operationsService.createDropZoneUpdate(orderId);
    res.status(200).json({
      ...dropZoneUpdate,
      message: 'drop zone update created successfully'
    });
  } catch (error: any) {
    console.error('error creating drop zone update:', error);
    
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'failed to create drop zone update' });
    }
  }
}; 