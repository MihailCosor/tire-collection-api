import { PrismaClient } from '@prisma/client';
import { CreateWeighingInput } from '../types/operations';
import * as depotService from './depot.service';

const prisma = new PrismaClient();

export const createWeighing = async (orderId: number, data: CreateWeighingInput) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new Error(`order with id ${orderId} not found`);
    }

    const existingWeighing = await prisma.weighing.findUnique({
      where: { orderId }
    });

    if (existingWeighing) {
      return await prisma.weighing.update({
        where: { id: existingWeighing.id },
        data: {
          weight: data.weight,
          weighedAt: new Date()
        }
      });
    } else {
      return await prisma.weighing.create({
        data: {
          orderId,
          weight: data.weight
        }
      });
    }
  } catch (error) {
    console.error('error creating weighing record:', error);
    throw error;
  }
};

export const createDropZoneUpdate = async (orderId: number) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        vehicle: true,
        tireCategories: {
          include: {
            tireCategory: true
          }
        }
      }
    });

    if (!order) {
      throw new Error(`order with id ${orderId} not found`);
    }

    const existingDropZone = await prisma.dropZoneUpdate.findUnique({
      where: { orderId }
    });

    let dropZoneUpdate;
    
    if (existingDropZone) {
      dropZoneUpdate = await prisma.dropZoneUpdate.update({
        where: { id: existingDropZone.id },
        data: {
          unloadedAt: new Date()
        }
      });
    } else {
      dropZoneUpdate = await prisma.dropZoneUpdate.create({
        data: {
          orderId
        }
      });
      
      if (order.vehicle.type === 'van') {
        try {
          await depotService.updateStockForOrder(orderId);
        } catch (depotError) {
          console.error(`error updating depot stock for order ${orderId}:`, depotError);
        }
      }
    }
    
    return dropZoneUpdate;
  } catch (error) {
    console.error('error creating drop zone update:', error);
    throw error;
  }
}; 