import { PrismaClient } from "@prisma/client";
import { CreateVanOrderInput } from "../types/van";


const prisma = new PrismaClient();

export const createVanOrder = async (vanOrderData: CreateVanOrderInput) => {
    const {serviceId, operatorId, vehicleId, destination, tireCategories, amount } = vanOrderData;

    const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
    });

    if (!vehicle || vehicle.type !== "van") {
        throw new Error("Vehicle not found");
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
                create: tireCategories.map((tc: any) => ({
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


export const getVanOrders = async () => {
    return await prisma.order.findMany({
        where: {
            vehicle: {
                type: "van",
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

export const getVanOrderById = async (id: number) => {
    return await prisma.order.findUnique({
        where: {
            id,
            vehicle: {
                type: "van",
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