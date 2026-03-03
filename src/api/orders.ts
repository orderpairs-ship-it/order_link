import { Router } from 'express';
import { db } from '../db/schema';
import { ExternalOrder, InternalOrder } from '../types';

export const ordersRouter = Router();

// GET /api/orders/external - List external orders
ordersRouter.get('/external', (req, res) => {
  try {
    const { customer_id, status } = req.query;
    
    let query = 'SELECT * FROM external_orders WHERE 1=1';
    const params: any[] = [];
    
    if (customer_id) {
      query += ' AND customer_id = ?';
      params.push(customer_id);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY scraped_at DESC';
    
    const orders = db.prepare(query).all(...params) as ExternalOrder[];
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/external/:id - Get external order by ID
ordersRouter.get('/external/:id', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM external_orders WHERE id = ?').get(req.params.id) as ExternalOrder;
    if (!order) {
      return res.status(404).json({ error: 'External order not found' });
    }
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders/sync - Trigger scraping for a customer
ordersRouter.post('/sync', (req, res) => {
  try {
    const { customer_id, manual_sms_code } = req.body;
    
    if (!customer_id) {
      return res.status(400).json({ error: 'customer_id is required' });
    }

    // Create a scrape session
    const sessionStmt = db.prepare(`
      INSERT INTO scrape_sessions (customer_id, status)
      VALUES (?, 'running')
    `);
    const session = sessionStmt.run(customer_id);

    // TODO: Trigger actual scraping logic (will be implemented in scraper module)
    // For now, just return the session ID
    res.json({
      message: 'Scraping initiated',
      session_id: session.lastInsertRowid,
      status: 'running'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/internal - List internal orders
ordersRouter.get('/internal', (req, res) => {
  try {
    const { status, external_order_id } = req.query;
    
    let query = 'SELECT * FROM internal_orders WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (external_order_id) {
      query += ' AND external_order_id = ?';
      params.push(external_order_id);
    }
    
    query += ' ORDER BY updated_at DESC';
    
    const orders = db.prepare(query).all(...params) as InternalOrder[];
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders/:externalId/convert - Convert external order to internal
ordersRouter.post('/:externalId/convert', (req, res) => {
  try {
    const { mappings, material_mappings } = req.body;
    const externalId = req.params.externalId;

    // Verify external order exists
    const externalOrder = db.prepare('SELECT * FROM external_orders WHERE id = ?').get(externalId);
    if (!externalOrder) {
      return res.status(404).json({ error: 'External order not found' });
    }

    // Create internal order
    const stmt = db.prepare(`
      INSERT INTO internal_orders (external_order_id, status, erp_data)
      VALUES (?, 'draft', ?)
    `);
    
    const result = stmt.run(externalId, JSON.stringify({ mappings, material_mappings }));
    
    const internalOrder = db.prepare('SELECT * FROM internal_orders WHERE id = ?').get(result.lastInsertRowid) as InternalOrder;
    
    // Update external order status
    db.prepare("UPDATE external_orders SET status = 'converted' WHERE id = ?").run(externalId);
    
    res.json(internalOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders/:internalId/submit - Submit internal order to ERP
ordersRouter.post('/:internalId/submit', (req, res) => {
  try {
    const internalId = req.params.internalId;

    // Verify internal order exists
    const internalOrder = db.prepare('SELECT * FROM internal_orders WHERE id = ?').get(internalId);
    if (!internalOrder) {
      return res.status(404).json({ error: 'Internal order not found' });
    }

    // TODO: Implement actual ERP submission logic
    // For now, just update status
    db.prepare(`
      UPDATE internal_orders 
      SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(internalId);
    
    const updated = db.prepare('SELECT * FROM internal_orders WHERE id = ?').get(internalId) as InternalOrder;
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:internalId/exceptions - Get exceptions for an order
ordersRouter.get('/:internalId/exceptions', (req, res) => {
  try {
    const exceptions = db.prepare('SELECT * FROM order_exceptions WHERE internal_order_id = ?').all(req.params.internalId);
    res.json(exceptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
