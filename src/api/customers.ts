import { Router } from 'express';
import { db } from '../db/schema';
import { Customer } from '../types';

export const customersRouter = Router();

// GET /api/customers - List all customers
customersRouter.get('/', (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers ORDER BY name').all() as Customer[];
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/customers/:id - Get customer by ID
customersRouter.get('/:id', (req, res) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id) as Customer;
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/customers - Create new customer
customersRouter.post('/', (req, res) => {
  try {
    const { name, base_url, login_url, scraper_config } = req.body;
    
    if (!name || !base_url) {
      return res.status(400).json({ error: 'name and base_url are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO customers (name, base_url, login_url, scraper_config)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(name, base_url, login_url || null, scraper_config ? JSON.stringify(scraper_config) : null);
    
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(result.lastInsertRowid) as Customer;
    res.status(201).json(customer);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Customer already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/customers/:id - Update customer
customersRouter.put('/:id', (req, res) => {
  try {
    const { name, base_url, login_url, scraper_config } = req.body;
    
    const stmt = db.prepare(`
      UPDATE customers 
      SET name = ?, base_url = ?, login_url = ?, scraper_config = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(name, base_url, login_url, scraper_config ? JSON.stringify(scraper_config) : null, req.params.id);
    
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id) as Customer;
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/customers/:id - Delete customer
customersRouter.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
