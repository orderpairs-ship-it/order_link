import { Router } from 'express';
import { db } from '../db/schema';
import { FieldMapping, MaterialMapping } from '../types';

export const mappingsRouter = Router();

// ============ Field Mappings ============

// GET /api/mappings/fields - List field mappings
mappingsRouter.get('/fields', (req, res) => {
  try {
    const { customer_id } = req.query;
    
    let query = 'SELECT * FROM field_mappings WHERE 1=1';
    const params: any[] = [];
    
    if (customer_id) {
      query += ' AND customer_id = ?';
      params.push(customer_id);
    }
    
    const mappings = db.prepare(query).all(...params) as FieldMapping[];
    res.json(mappings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/mappings/fields - Create field mapping
mappingsRouter.post('/fields', (req, res) => {
  try {
    const { customer_id, external_field, internal_field, transform_rule } = req.body;
    
    if (!customer_id || !external_field || !internal_field) {
      return res.status(400).json({ error: 'customer_id, external_field, and internal_field are required' });
    }

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO field_mappings (customer_id, external_field, internal_field, transform_rule)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(customer_id, external_field, internal_field, transform_rule || null);
    
    const mapping = db.prepare(`
      SELECT * FROM field_mappings 
      WHERE customer_id = ? AND external_field = ? AND internal_field = ?
    `).get(customer_id, external_field, internal_field) as FieldMapping;
    
    res.json(mapping);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/mappings/fields/:id - Delete field mapping
mappingsRouter.delete('/fields/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM field_mappings WHERE id = ?').run(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Material Mappings ============

// GET /api/mappings/materials - List material mappings
mappingsRouter.get('/materials', (req, res) => {
  try {
    const { customer_id, external_sku } = req.query;
    
    let query = 'SELECT * FROM material_mappings WHERE 1=1';
    const params: any[] = [];
    
    if (customer_id) {
      query += ' AND customer_id = ?';
      params.push(customer_id);
    }
    
    if (external_sku) {
      query += ' AND external_sku = ?';
      params.push(external_sku);
    }
    
    const mappings = db.prepare(query).all(...params) as MaterialMapping[];
    res.json(mappings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/mappings/materials - Create material mapping
mappingsRouter.post('/materials', (req, res) => {
  try {
    const { customer_id, external_sku, internal_sku, external_name, internal_name, price_ratio } = req.body;
    
    if (!customer_id || !external_sku || !internal_sku) {
      return res.status(400).json({ error: 'customer_id, external_sku, and internal_sku are required' });
    }

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO material_mappings (customer_id, external_sku, internal_sku, external_name, internal_name, price_ratio)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(customer_id, external_sku, internal_sku, external_name || null, internal_name || null, price_ratio || 1.0);
    
    const mapping = db.prepare(`
      SELECT * FROM material_mappings 
      WHERE customer_id = ? AND external_sku = ? AND internal_sku = ?
    `).get(customer_id, external_sku, internal_sku) as MaterialMapping;
    
    res.json(mapping);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/mappings/materials/:id - Delete material mapping
mappingsRouter.delete('/materials/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM material_mappings WHERE id = ?').run(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/mappings/materials/lookup - Quick lookup by external SKU
mappingsRouter.get('/materials/lookup', (req, res) => {
  try {
    const { customer_id, external_sku } = req.query;
    
    if (!customer_id || !external_sku) {
      return res.status(400).json({ error: 'customer_id and external_sku are required' });
    }
    
    const mapping = db.prepare(`
      SELECT * FROM material_mappings 
      WHERE customer_id = ? AND external_sku = ?
    `).get(customer_id, external_sku) as MaterialMapping | undefined;
    
    if (!mapping) {
      return res.status(404).json({ error: 'Mapping not found' });
    }
    
    res.json(mapping);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
