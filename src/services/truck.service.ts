import { PrismaClient } from "@prisma/client";
import { CreateTruckOrderInput } from "../types/truck";

const prisma = new PrismaClient();

export const createTruckOrder = async (truckOrderData: CreateTruckOrderInput) => {
  const { serviceId, operatorId, vehicleId, destination, tireCategories, amount } = truckOrderData;

  // check if the vehicle is actually a truck
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle || vehicle.type !== "truck") {
    throw new Error("vehicle not found or not a truck");
  }

  return await prisma.order.create({
    data: {
      serviceId,
      operatorId,
      vehicleId,
      destination,
      amount,
      isPaid: false,
      tireCategories: {
        create: tireCategories.map((tc) => ({
          quantity: tc.quantity,
          tireCategoryId: tc.tireCategoryId,
        })),
      },
    },
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
};

export const getTruckOrders = async () => {
  return await prisma.order.findMany({
    where: {
      vehicle: {
        type: "truck",
      },
    },
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
};

export const getTruckOrderById = async (id: number) => {
  return await prisma.order.findUnique({
    where: {
      id,
      vehicle: {
        type: "truck",
      },
    },
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
}; 