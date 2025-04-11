export interface CreateWeighingInput {
  weight: number; // weight in kg
}

export interface WeighingResponse {
  id: number;
  orderId: number;
  weight: number;
  weighedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DropZoneUpdateResponse {
  id: number;
  orderId: number;
  unloadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
} 