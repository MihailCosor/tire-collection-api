import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDepotStock = async () => {
  try {
    // get all depot stock entries with their tire categories
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

    // if no stock records exist, calculate them from van orders
    if (stock.length === 0) {
      await calculateDepotStockFromOrders();
      
      // get the newly calculated stock
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
    // get all tire categories
    const tireCategories = await prisma.tireCategory.findMany();
    
    // for each tire category, calculate total from all van orders
    for (const category of tireCategories) {
      // get all order tire categories for this tire category
      const orderTireCategories = await prisma.orderTireCategory.findMany({
        where: {
          tireCategoryId: category.id,
          order: {
            vehicle: {
              type: 'van',
            },
            // only consider orders that have been unloaded (have a dropZone record)
            dropZone: {
              isNot: null,
            },
          },
        },
        include: {
          order: true,
        },
      });
      
      // calculate total quantity
      let totalQuantity = 0;
      for (const otc of orderTireCategories) {
        totalQuantity += otc.quantity;
      }
      
      if (totalQuantity > 0) {
        // check if a stock record exists for this tire category
        const existingStock = await prisma.depotStock.findFirst({
          where: {
            tireCategoryId: category.id,
          },
        });
        
        if (existingStock) {
          // update existing record
          await prisma.depotStock.update({
            where: {
              id: existingStock.id,
            },
            data: {
              quantity: totalQuantity,
              lastUpdated: new Date(),
            },
          });
        } else {
          // create new record
          await prisma.depotStock.create({
            data: {
              tireCategoryId: category.id,
              quantity: totalQuantity,
              lastUpdated: new Date(),
            },
          });
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('error calculating depot stock:', error);
    throw error;
  }
}; 