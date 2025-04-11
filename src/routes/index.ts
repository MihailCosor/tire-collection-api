import { Router } from "express";
import vanRoutes from "./van.routes";
import invoiceRoutes from "./invoice.routes";

const router = Router();

// Import all routes here
router.use("/orders/van", vanRoutes);
router.use("/invoices", invoiceRoutes);

export default router;