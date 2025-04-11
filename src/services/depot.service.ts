import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDepotStock = async () => {
  try {
    const stock = await prisma.depotStock.findMany({
      include: {
        tireCategory: true,
      },
      orderBy: {
        tireCategory: {
          name: 'asc',
        },
      },
    });

    if (stock.length === 0) {
      await calculateDepotStockFromOrders();
      
      return await prisma.depotStock.findMany({
        include: {
          tireCategory: true,
        },
        orderBy: {
          tireCategory: {
            name: 'asc',
          },
        },
      });
    }

    return stock;
  } catch (error) {
    console.error('error fetching depot stock:', error);
    throw error;
  }
};

export const calculateDepotStockFromOrders = async () => {
  try {
    const tireCategories = await prisma.tireCategory.findMany();
    
    const stockUpdates = [];
    
    for (const category of tireCategories) {
      const orderTireCategories = await prisma.orderTireCategory.findMany({
        where: {
          tireCategoryId: category.id,
          order: {
            vehicle: {
              type: 'van',
            },
            dropZone: {
              isNot: null,
            },
          },
        },
        include: {
          order: true,
        },
      });
      
      let totalQuantity = 0;
      for (const otc of orderTireCategories) {
        totalQuantity += otc.quantity;
      }
      
      if (totalQuantity > 0) {
        const existingStock = await prisma.depotStock.findFirst({
          where: {
            tireCategoryId: category.id,
          },
        });
        
        if (existingStock) {
          if (existingStock.quantity !== totalQuantity) {
            const updatedStock = await prisma.depotStock.update({
              where: {
                id: existingStock.id,
              },
              data: {
                quantity: totalQuantity,
                lastUpdated: new Date(),
              },
            });
            
            stockUpdates.push({
              category: category.name,
              previousQuantity: existingStock.quantity,
              newQuantity: totalQuantity,
              change: totalQuantity - existingStock.quantity
            });
          }
        } else {
          const newStock = await prisma.depotStock.create({
            data: {
              tireCategoryId: category.id,
              quantity: totalQuantity,
              lastUpdated: new Date(),
            },
          });
          
          stockUpdates.push({
            category: category.name,
            previousQuantity: 0,
            newQuantity: totalQuantity,
            change: totalQuantity
          });
        }
      }
    }
    
    return stockUpdates;
  } catch (error) {
    console.error('error calculating depot stock:', error);
    throw error;
  }
};

export const updateStockForOrder = async (orderId: number) => {
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
    
    if (order.vehicle.type !== 'van') {
      return null;
    }
    
    const dropZone = await prisma.dropZoneUpdate.findUnique({
      where: { orderId }
    });
    
    if (!dropZone) {
      return null;
    }
    
    const stockUpdates = [];
    
    for (const orderTireCategory of order.tireCategories) {
      const category = orderTireCategory.tireCategory;
      const quantity = orderTireCategory.quantity;
      
      const existingStock = await prisma.depotStock.findFirst({
        where: {
          tireCategoryId: category.id,
        },
      });
      
      if (existingStock) {
        const newQuantity = existingStock.quantity + quantity;
        
        const updatedStock = await prisma.depotStock.update({
          where: {
            id: existingStock.id,
          },
          data: {
            quantity: newQuantity,
            lastUpdated: new Date(),
          },
        });
        
        stockUpdates.push({
          category: category.name,
          previousQuantity: existingStock.quantity,
          newQuantity: newQuantity,
          change: quantity
        });
      } else {
        const newStock = await prisma.depotStock.create({
          data: {
            tireCategoryId: category.id,
            quantity: quantity,
            lastUpdated: new Date(),
          },
        });
        
        stockUpdates.push({
          category: category.name,
          previousQuantity: 0,
          newQuantity: quantity,
          change: quantity
        });
      }
    }
    
    return stockUpdates;
  } catch (error) {
    console.error(`error updating stock for order ${orderId}:`, error);
    throw error;
  }
}; 