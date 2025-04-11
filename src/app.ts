import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {errorHandler} from './middleware/errorHandler';
import mainRouter from './routes';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api', mainRouter);

// swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// health check
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

// error handling
app.use(errorHandler);

export default app;
