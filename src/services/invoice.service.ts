import { PrismaClient } from '@prisma/client';
import { CreateInvoiceInput, UpdateInvoiceInput, Invoice } from '../types/invoice';
import * as vanService from './van.service';

const prisma = new PrismaClient();

export const createInvoice = async (data: CreateInvoiceInput): Promise<Invoice> => {
  try {
    let amount = 0;
    
    if (data.orderType === 'van') {
      const order = await vanService.getVanOrderById(data.orderId);
      if (!order) {
        throw new Error(`No ${data.orderType} order found with ID ${data.orderId}`);
      }
      amount = order.amount;
    } else {
      throw new Error(`Unsupported order type: ${data.orderType}`);
    }

    // @ts-ignore
    const invoice = await prisma.invoice.create({
      data: {
        orderId: data.orderId,
        orderType: data.orderType,
        number: data.invoiceNumber,
        amount
      }
    });

    return invoice as unknown as Invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export const updateInvoicePayment = async (id: number, data: UpdateInvoiceInput): Promise<Invoice> => {
  try {
    // @ts-ignore
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        isPaid: data.isPaid,
        paidAt: data.isPaid ? new Date() : null
      }
    });

    return updatedInvoice as unknown as Invoice;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

export const getInvoiceById = async (id: number): Promise<Invoice | null> => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    });

    return invoice as unknown as Invoice | null;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
}; 