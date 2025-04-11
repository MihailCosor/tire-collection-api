import { Router } from 'express';
import * as documentController from '../controllers/document.controller';

const router = Router();

router.post('/:id/etransport', documentController.generateETransportDocument);
router.post('/:id/environment', documentController.generateEnvironmentDocument);

export default router; 