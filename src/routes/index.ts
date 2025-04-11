import { Router } from "express";
import vanRoutes from "./van.routes";

const router = Router();

// Import all routes here
router.use("/orders/van", vanRoutes);


export default router;