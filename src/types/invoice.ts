export interface Invoice {
  id: number;
  orderId: number;
  orderType: string;
  number: string;
  amount: number;
  isPaid: boolean;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceInput {
  orderId: number;
  orderType: string;
  invoiceNumber: string;
}

export interface UpdateInvoiceInput {
  isPaid: boolean;
} 