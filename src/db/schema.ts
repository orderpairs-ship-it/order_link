import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(__dirname, '../../data/order_link.db');

export const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDB() {
  db.exec(`
    -- Customers (BYD, Huawei, Meituan, etc.)
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      base_url TEXT NOT NULL,
      login_url TEXT,
      scraper_config TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- User credentials (encrypted)
    CREATE TABLE IF NOT EXISTS credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      password_encrypted TEXT NOT NULL,
      phone_number TEXT,
      sms_forward_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    -- External orders (raw scraped data)
    CREATE TABLE IF NOT EXISTS external_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      external_order_id TEXT NOT NULL,
      raw_data TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      UNIQUE(customer_id, external_order_id)
    );

    -- Internal orders (ERP-ready format)
    CREATE TABLE IF NOT EXISTS internal_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_order_id INTEGER NOT NULL,
      internal_order_id TEXT,
      erp_data TEXT,
      status TEXT DEFAULT 'draft',
      submitted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (external_order_id) REFERENCES external_orders(id) ON DELETE CASCADE
    );

    -- Field mappings (external ↔ internal)
    CREATE TABLE IF NOT EXISTS field_mappings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      external_field TEXT NOT NULL,
      internal_field TEXT NOT NULL,
      transform_rule TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      UNIQUE(customer_id, external_field, internal_field)
    );

    -- Material/SKU mappings
    CREATE TABLE IF NOT EXISTS material_mappings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      external_sku TEXT NOT NULL,
      internal_sku TEXT NOT NULL,
      external_name TEXT,
      internal_name TEXT,
      price_ratio REAL DEFAULT 1.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      UNIQUE(customer_id, external_sku, internal_sku)
    );

    -- Order exceptions (price discrepancies, unrecognized SKUs, etc.)
    CREATE TABLE IF NOT EXISTS order_exceptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      internal_order_id INTEGER NOT NULL,
      exception_type TEXT NOT NULL,
      description TEXT NOT NULL,
      resolved BOOLEAN DEFAULT FALSE,
      resolution_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME,
      FOREIGN KEY (internal_order_id) REFERENCES internal_orders(id) ON DELETE CASCADE
    );

    -- Scraping sessions
    CREATE TABLE IF NOT EXISTS scrape_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      status TEXT DEFAULT 'running',
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      orders_found INTEGER DEFAULT 0,
      error_message TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_external_orders_status ON external_orders(status);
    CREATE INDEX IF NOT EXISTS idx_internal_orders_status ON internal_orders(status);
    CREATE INDEX IF NOT EXISTS idx_material_mappings_customer ON material_mappings(customer_id);
  `);
}

export default db;
