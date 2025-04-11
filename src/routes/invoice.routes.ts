import { Router } from "express";
import * as invoiceController from "../controllers/invoice.controller";

const router = Router();

router.post("/:orderId", invoiceController.createInvoice);
router.patch("/:id/pay", invoiceController.updateInvoicePayment);

export default router; 