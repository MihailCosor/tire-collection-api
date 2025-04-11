export interface CreateTruckOrderInput {
  serviceId: number;
  operatorId: number;
  vehicleId: number;
  destination: string;
  amount: number;
  tireCategories: {
    tireCategoryId: number;
    quantity: number;
  }[];
}

export interface TruckOrder extends CreateTruckOrderInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isPaid: boolean;
} 