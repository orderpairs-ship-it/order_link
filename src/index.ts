import express from 'express';
import cors from 'cors';
import { initDB, db } from './db/schema';
import { ordersRouter } from './api/orders';
import { customersRouter } from './api/customers';
import { mappingsRouter } from './api/mappings';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDB();
console.log('✅ Database initialized');

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/mappings', mappingsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Order Link API running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${db.name}`);
});
