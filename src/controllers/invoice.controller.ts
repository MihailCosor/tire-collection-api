import { Request, Response } from "express";
import * as invoiceService from "../services/invoice.service";
import { CreateInvoiceInput, UpdateInvoiceInput } from "../types/invoice";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// helper function to generate a unique invoice number
const generateInvoiceNumber = async (): Promise<string> => {
  // format: inv-yyyymm-xxxx where xxxx is a sequential number starting from 0001
  const now = new Date();
  const yearMonth = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0');
  
  // get first day of current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  // get first day of next month
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  // count invoices for current month
  const monthlyInvoiceCount = await prisma.invoice.count({
    where: {
      createdAt: {
        gte: monthStart,
        lt: nextMonthStart
      }
    }
  });
  
  // create sequence number
  const sequenceNumber = (monthlyInvoiceCount + 1).toString().padStart(4, '0');
  
  return `INV-${yearMonth}-${sequenceNumber}`;
};

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.orderId);
    if (isNaN(orderId)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    // generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    const invoiceData: CreateInvoiceInput = {
      orderId,
      orderType: "van", // using van as default for now
      invoiceNumber
    };

    const newInvoice = await invoiceService.createInvoice(invoiceData);
    res.status(201).json(newInvoice);
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: error.message || "Failed to create invoice" });
  }
};

export const updateInvoicePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid invoice ID" });
      return;
    }

    const invoice = await invoiceService.getInvoiceById(id);
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    const updateData: UpdateInvoiceInput = {
      isPaid: true
    };

    const updatedInvoice = await invoiceService.updateInvoicePayment(id, updateData);
    res.status(200).json(updatedInvoice);
  } catch (error: any) {
    console.error("Error updating invoice payment:", error);
    res.status(500).json({ error: error.message || "Failed to update invoice payment" });
  }
}; 