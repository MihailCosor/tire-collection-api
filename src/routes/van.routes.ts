import { Router } from "express";
import * as vanController from "../controllers/van.controller";
import { validateVanOrder } from "../middleware/validation";

const router = Router();

router.post("/", validateVanOrder, vanController.createVanOrder);
router.get("/", vanController.getVanOrders);

export default router;