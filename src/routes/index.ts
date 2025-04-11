import { Router } from "express";
import vanRoutes from "./van.routes";
import invoiceRoutes from "./invoice.routes";
import depotRoutes from "./depot.routes";
import truckRoutes from "./truck.routes";
import documentRoutes from "./document.routes";

const router = Router();

// import all routes here
router.use("/orders/van", vanRoutes);
router.use("/orders/truck", truckRoutes);
router.use("/orders", documentRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/depot", depotRoutes);

export default router;