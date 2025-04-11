import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // check if a truck already exists
    const existingTruck = await prisma.vehicle.findFirst({
      where: {
        type: 'truck'
      }
    });

    if (!existingTruck) {
      console.log('creating test truck vehicle...');
      
      // create a truck vehicle
      const newTruck = await prisma.vehicle.create({
        data: {
          plateNumber: 'TRUCK123',
          type: 'truck',
          capacity: 5000
        }
      });
      
      console.log('created test truck vehicle with id:', newTruck.id);
    } else {
      console.log('truck vehicle already exists with id:', existingTruck.id);
    }
    
    console.log('done!');
  } catch (error) {
    console.error('error seeding truck data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 