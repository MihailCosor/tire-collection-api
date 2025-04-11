import { Request, Response } from 'express';
import * as depotService from '../services/depot.service';

export const getDepotStock = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the stock directly instead of always recalculating first
    const stock = await depotService.getDepotStock();
    res.status(200).json(stock);
  } catch (error: any) {
    console.error('error getting depot stock:', error);
    res.status(500).json({ error: error.message || 'failed to get depot stock' });
  }
}; 