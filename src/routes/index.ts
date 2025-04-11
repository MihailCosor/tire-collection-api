import { Router } from "express";
import vanRoutes from "./van.routes";
import invoiceRoutes from "./invoice.routes";
import depotRoutes from "./depot.routes";
import truckRoutes from "./truck.routes";
import documentRoutes from "./document.routes";
import operationsRoutes from "./operations.routes";
import operatorsRoutes from "./operators.routes";

const router = Router();

// import all routes here
router.use("/orders/van", vanRoutes);
router.use("/orders/truck", truckRoutes);
router.use("/orders", documentRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/depot", depotRoutes);
router.use("/operators", operatorsRoutes);
router.use("", operationsRoutes);  // root level for weighing and dropzone

export default router;