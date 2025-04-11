export interface CreateVanOrderInput {
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
  
  export interface VanOrder extends CreateVanOrderInput {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    isPaid: boolean;
  }