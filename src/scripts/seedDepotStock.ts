import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // create a new test order with the second tire category
    console.log('creating test order with premium tires...');
    
    // create a van order with some tire categories
    const newOrder = await prisma.order.create({
      data: {
        serviceId: 1,
        operatorId: 1,
        vehicleId: 1,
        destination: 'Test Depot Premium',
        amount: 200,
        isPaid: true,
        tireCategories: {
          create: [
            {
              tireCategoryId: 2, // premium tires
              quantity: 10
            }
          ]
        },
        // also create a dropZone record to mark it as unloaded
        dropZone: {
          create: {
            unloadedAt: new Date()
          }
        }
      }
    });
    
    console.log('created test order:', newOrder.id);
    console.log('done!');
  } catch (error) {
    console.error('error seeding depot stock:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 