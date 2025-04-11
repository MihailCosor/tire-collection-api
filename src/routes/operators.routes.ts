import { Router } from 'express';
import * as operatorsController from '../controllers/operators.controller';
import { validateOperatorAction } from '../middleware/validation';

const router = Router();

router.post('/actions', validateOperatorAction, operatorsController.createOperatorAction);
router.get('/actions', operatorsController.getOperatorActions);

export default router; 