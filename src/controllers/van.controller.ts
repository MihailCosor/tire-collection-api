import { Request, Response } from "express";
import * as vanService from "../services/van.service";
import { CreateVanOrderInput } from "../types/van";

export const createVanOrder = async (req: Request, res: Response) => {
    try {
        const vanOrderData: CreateVanOrderInput = req.body;
        const newVanOrder = await vanService.createVanOrder(vanOrderData);
        res.status(201).json(newVanOrder);
    } catch (error) {
        console.error("Error creating van order:", error);
        res.status(500).json({ error: "Failed to create van order" });
    }
}

export const getVanOrders = async (req: Request, res: Response) => {
    try {
        const vanOrders = await vanService.getVanOrders();
        res.status(200).json(vanOrders);
    } catch (error) {
        console.error("Error fetching van orders:", error);
        res.status(500).json({ error: "Failed to fetch van orders" });
    }
}

