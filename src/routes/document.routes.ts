import { Router } from 'express';
import * as documentController from '../controllers/document.controller';

const router = Router();

// route for generating etransport document
router.post('/:id/etransport', documentController.generateETransportDocument);

// route for generating environment document
router.post('/:id/environment', documentController.generateEnvironmentDocument);

export default router; 