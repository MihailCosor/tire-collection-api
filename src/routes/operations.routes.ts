import { Router } from 'express';
import * as operationsController from '../controllers/operations.controller';

const router = Router();

router.post('/weighing/:orderId', operationsController.createWeighing);
router.patch('/dropzone/:orderId', operationsController.createDropZoneUpdate);

export default router; 