import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

const ensureDocumentsDir = () => {
  const documentsDir = path.join(process.cwd(), 'public/documents');
  if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
  }
  return documentsDir;
};

export const generateETransportDocument = async (orderId: number) => {
  try {
    // get order details with related data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        service: true,
        operator: true,
        vehicle: true,
        tireCategories: {
          include: {
            tireCategory: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error(`order with id ${orderId} not found`);
    }

    // prepare data for the document
    const documentId = `ETR-${orderId}-${Date.now()}`;
    const generatedAt = new Date().toISOString();
    
    // create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // set up file path
    const dir = ensureDocumentsDir();
    const filename = `etransport_${orderId}_${Date.now()}.pdf`;
    const filePath = path.join(dir, filename);
    
    // pipe output to file
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    
    // add content to PDF
    
    // header with logo (using simple text as placeholder)
    doc.fontSize(24).text('eTransport Document', { align: 'center' });
    doc.moveDown();
    
    // document information
    doc.fontSize(12).text(`Document ID: ${documentId}`);
    doc.text(`Generated At: ${new Date(generatedAt).toLocaleString()}`);
    doc.text(`Order ID: ${order.id}`);
    doc.moveDown();
    
    // order information
    doc.fontSize(14).text('Order Information', { underline: true });
    doc.fontSize(12).text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Destination: ${order.destination}`);
    doc.text(`Vehicle: ${order.vehicle.type.toUpperCase()} (${order.vehicle.plateNumber})`);
    doc.text(`Operator: ${order.operator.name}`);
    doc.text(`Service: ${order.service.name}`);
    doc.text(`Service Address: ${order.service.address}`);
    doc.moveDown();
    
    // tire categories table
    doc.fontSize(14).text('Tire Categories', { underline: true });
    doc.moveDown();
    
    // table header
    const tableTop = doc.y;
    const itemX = 50;
    const quantityX = 250;
    const priceX = 350;
    const totalX = 450;
    
    doc.fontSize(12).text('Item', itemX, tableTop);
    doc.text('Quantity', quantityX, tableTop);
    doc.text('Unit Price', priceX, tableTop);
    doc.text('Total', totalX, tableTop);
    
    // separator line
    doc.moveDown();
    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
    doc.moveDown();
    
    // table rows
    let totalAmount = 0;
    order.tireCategories.forEach((tc, i) => {
      const rowY = doc.y;
      const itemTotal = tc.quantity * tc.tireCategory.price;
      totalAmount += itemTotal;
      
      doc.text(tc.tireCategory.name, itemX, rowY);
      doc.text(tc.quantity.toString(), quantityX, rowY);
      doc.text(`€${tc.tireCategory.price.toFixed(2)}`, priceX, rowY);
      doc.text(`€${itemTotal.toFixed(2)}`, totalX, rowY);
      
      doc.moveDown();
    });
    
    // separator line
    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
    doc.moveDown();
    
    // total
    doc.fontSize(12)
      .text('Total Amount:', 350, doc.y)
      .text(`€${order.amount.toFixed(2)}`, totalX, doc.y);
    
    // footer
    doc.moveDown(2);
    doc.fontSize(10).text('This is an automatically generated document.', { align: 'center' });
    
    // finalize PDF
    doc.end();
    
    // wait for PDF to be written to file
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        // return document details
        resolve({
          documentId,
          orderId,
          filename,
          filePath: `/documents/${filename}`,
          generatedAt,
          downloadUrl: `/documents/${filename}`,
        });
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('error generating eTransport document:', error);
    throw error;
  }
};

export const generateEnvironmentDocument = async (orderId: number) => {
  try {
    // get order details with related data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        service: true,
        operator: true,
        vehicle: true,
        tireCategories: {
          include: {
            tireCategory: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error(`order with id ${orderId} not found`);
    }

    // calculate total weight (dummy calculation: 10kg per tire)
    let totalWeight = 0;
    for (const tc of order.tireCategories) {
      totalWeight += tc.quantity * 10; // assume 10kg per tire
    }
    
    // calculate total items
    const totalItems = order.tireCategories.reduce((sum, tc) => sum + tc.quantity, 0);
    
    // prepare data for the document
    const documentId = `ENV-${orderId}-${Date.now()}`;
    const generatedAt = new Date().toISOString();
    
    // create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // set up file path
    const dir = ensureDocumentsDir();
    const filename = `environment_${orderId}_${Date.now()}.pdf`;
    const filePath = path.join(dir, filename);
    
    // pipe output to file
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    
    // add content to PDF
    
    // header
    doc.fontSize(24).text('Environmental Document', { align: 'center' });
    doc.moveDown();
    
    // document information
    doc.fontSize(12).text(`Document ID: ${documentId}`);
    doc.text(`Generated At: ${new Date(generatedAt).toLocaleString()}`);
    doc.text(`Order ID: ${order.id}`);
    doc.moveDown();
    
    // order information
    doc.fontSize(14).text('Order Information', { underline: true });
    doc.fontSize(12).text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Destination: ${order.destination}`);
    doc.text(`Vehicle: ${order.vehicle.type.toUpperCase()} (${order.vehicle.plateNumber})`);
    doc.text(`Operator: ${order.operator.name}`);
    doc.text(`Service: ${order.service.name}`);
    doc.moveDown();
    
    // environmental data
    doc.fontSize(14).text('Environmental Information', { underline: true });
    doc.moveDown();
    
    doc.fontSize(12).text('Waste Type: Used Tires');
    doc.text('Waste Code: 16 01 03');
    doc.text(`Total Items: ${totalItems} tires`);
    doc.text(`Total Weight: ${totalWeight} kg`);
    doc.text('Processing Method: Recycling');
    doc.moveDown();
    
    // environmental impact
    doc.fontSize(14).text('Environmental Impact', { underline: true });
    doc.moveDown();
    
    doc.fontSize(12).text('Reduced landfill waste');
    doc.text('Resource conservation');
    doc.text('Reduced illegal dumping');
    doc.text(`CO₂ Reduction: ${(totalWeight * 0.5).toFixed(2)} kg`);
    doc.moveDown();
    
    // add a simple chart or graphic representation
    doc.fontSize(14).text('Environmental Metrics', { underline: true });
    doc.moveDown();
    
    // simple bar for CO2 saved
    const barWidth = 400;
    const barHeight = 20;
    const co2Saved = totalWeight * 0.5;
    const maxCO2 = 1000; // max value for scale
    const scaledWidth = Math.min(barWidth * (co2Saved / maxCO2), barWidth);
    
    doc.text('CO₂ Saved:');
    doc.rect(50, doc.y + 10, barWidth, barHeight).stroke();
    doc.rect(50, doc.y + 10, scaledWidth, barHeight).fill('green');
    doc.text(`${co2Saved.toFixed(2)} kg`, 50, doc.y + 40);
    
    doc.moveDown(3);
    
    // certification
    doc.fontSize(12).text('This document certifies that the tires from this order will be processed according to environmental regulations.', { align: 'center' });
    
    // footer
    doc.moveDown(2);
    doc.fontSize(10).text('This is an automatically generated document.', { align: 'center' });
    
    // finalize PDF
    doc.end();
    
    // wait for PDF to be written to file
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        // return document details
        resolve({
          documentId,
          orderId,
          filename,
          filePath: `/documents/${filename}`,
          generatedAt,
          downloadUrl: `/documents/${filename}`,
        });
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('error generating environment document:', error);
    throw error;
  }
}; 