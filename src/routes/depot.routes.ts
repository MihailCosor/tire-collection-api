import { Router } from 'express';
import * as depotController from '../controllers/depot.controller';

const router = Router();

router.get('/stock', depotController.getDepotStock);

export default router; 