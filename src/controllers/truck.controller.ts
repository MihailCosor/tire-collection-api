import { Request, Response } from "express";
import * as truckService from "../services/truck.service";
import { CreateTruckOrderInput } from "../types/truck";

export const createTruckOrder = async (req: Request, res: Response) => {
  try {
    const truckOrderData: CreateTruckOrderInput = req.body;
    const newTruckOrder = await truckService.createTruckOrder(truckOrderData);
    res.status(201).json(newTruckOrder);
  } catch (error: any) {
    console.error("error creating truck order:", error);
    res.status(500).json({ error: error.message || "failed to create truck order" });
  }
}

export const getTruckOrders = async (req: Request, res: Response) => {
  try {
    const truckOrders = await truckService.getTruckOrders();
    res.status(200).json(truckOrders);
  } catch (error: any) {
    console.error("error fetching truck orders:", error);
    res.status(500).json({ error: error.message || "failed to fetch truck orders" });
  }
} 