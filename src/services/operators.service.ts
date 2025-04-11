import { PrismaClient } from '@prisma/client';
import { CreateOperatorActionInput, OperatorActionType } from '../types/operators';

const prisma = new PrismaClient();

export const createOperatorAction = async (actionData: CreateOperatorActionInput) => {
  try {
    const operator = await prisma.operator.findUnique({
      where: { id: actionData.operatorId }
    });

    if (!operator) {
      throw new Error(`Operator with id ${actionData.operatorId} not found`);
    }

    const validActionTypes: OperatorActionType[] = ['dublare', 'sortare', 'incarcare', 'descarcare', 'predare_bani'];
    if (!validActionTypes.includes(actionData.actionType as OperatorActionType)) {
      throw new Error(`Invalid action type: ${actionData.actionType}. Must be one of: ${validActionTypes.join(', ')}`);
    }

    const newAction = await prisma.operatorAction.create({
      data: {
        operatorId: actionData.operatorId,
        actionType: actionData.actionType,
        details: actionData.details || null,
        performedAt: actionData.performedAt || new Date(),
      },
      include: {
        operator: true
      }
    });

    return newAction;
  } catch (error) {
    console.error('Error creating operator action:', error);
    throw error;
  }
};

export const getOperatorActions = async (operatorId?: number) => {
  try {
    const whereClause = operatorId ? { operatorId } : {};
    
    return await prisma.operatorAction.findMany({
      where: whereClause,
      include: {
        operator: true
      },
      orderBy: {
        performedAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error fetching operator actions:', error);
    throw error;
  }
}; 