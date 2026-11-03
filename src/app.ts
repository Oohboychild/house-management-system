import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import { ZodError } from 'zod';
import propertyRoutes from './routes/property.routes.js';
const app = express();

// Security & logging middleware
app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'House Management System API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// Global error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);

    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.flatten().fieldErrors,
      });
    }

    if (err.message === 'Email already registered') {
      return res.status(409).json({
        success: false,
        message: err.message,
      });
    }

    if (err.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;