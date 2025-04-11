import { Request, Response } from 'express';
import * as operatorsService from '../services/operators.service';
import { CreateOperatorActionInput } from '../types/operators';

export const createOperatorAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const actionData: CreateOperatorActionInput = req.body;
    
    if (!actionData.operatorId || !actionData.actionType) {
      res.status(400).json({ error: 'operatorId and actionType are required' });
      return;
    }
    
    const newAction = await operatorsService.createOperatorAction(actionData);
    
    res.status(201).json({
      ...newAction,
      message: 'Acțiune înregistrată cu succes'
    });
  } catch (error: any) {
    console.error('Error creating operator action:', error);
    
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('Invalid action type')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to create operator action' });
    }
  }
};

export const getOperatorActions = async (req: Request, res: Response): Promise<void> => {
  try {
    const operatorId = req.query.operatorId ? parseInt(req.query.operatorId as string) : undefined;
    
    const actions = await operatorsService.getOperatorActions(operatorId);
    
    res.status(200).json(actions);
  } catch (error: any) {
    console.error('Error fetching operator actions:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch operator actions' });
  }
}; 