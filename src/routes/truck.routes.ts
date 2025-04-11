import { Router } from "express";
import * as truckController from "../controllers/truck.controller";
import { validateTruckOrder } from "../middleware/validation";

const router = Router();

router.post("/", validateTruckOrder, truckController.createTruckOrder);
router.get("/", truckController.getTruckOrders);

export default router; 