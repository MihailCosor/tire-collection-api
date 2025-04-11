export type OperatorActionType = 'dublare' | 'sortare' | 'incarcare' | 'descarcare' | 'predare_bani';

export interface CreateOperatorActionInput {
  operatorId: number;
  actionType: OperatorActionType;
  details?: string;
  performedAt?: Date;
}

export interface OperatorAction {
  id: number;
  operatorId: number;
  actionType: OperatorActionType;
  details?: string;
  performedAt: Date;
  createdAt: Date;
  updatedAt: Date;
} 