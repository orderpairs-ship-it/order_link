// Core domain types for Order Link

export interface Customer {
  id: number;
  name: string;
  base_url: string;
  login_url?: string;
  scraper_config?: string;
  created_at: string;
  updated_at: string;
}

export interface Credential {
  id: number;
  customer_id: number;
  username: string;
  password_encrypted: string;
  phone_number?: string;
  sms_forward_method?: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalOrder {
  id: number;
  customer_id: number;
  external_order_id: string;
  raw_data: string; // JSON string
  status: 'pending' | 'reviewing' | 'converted' | 'ignored';
  scraped_at: string;
  created_at: string;
}

export interface InternalOrder {
  id: number;
  external_order_id: number;
  internal_order_id?: string;
  erp_data?: string; // JSON string
  status: 'draft' | 'ready' | 'submitted' | 'error';
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FieldMapping {
  id: number;
  customer_id: number;
  external_field: string;
  internal_field: string;
  transform_rule?: string;
  created_at: string;
}

export interface MaterialMapping {
  id: number;
  customer_id: number;
  external_sku: string;
  internal_sku: string;
  external_name?: string;
  internal_name?: string;
  price_ratio: number;
  created_at: string;
}

export interface OrderException {
  id: number;
  internal_order_id: number;
  exception_type: 'price_mismatch' | 'unknown_sku' | 'missing_field' | 'validation_error';
  description: string;
  resolved: boolean;
  resolution_note?: string;
  created_at: string;
  resolved_at?: string;
}

export interface ScrapeSession {
  id: number;
  customer_id: number;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  orders_found: number;
  error_message?: string;
}

// API Request/Response types
export interface ScrapingRequest {
  customer_id: number;
  manual_sms_code?: string;
}

export interface ConversionRequest {
  external_order_id: number;
  mappings?: Record<string, string>;
  material_mappings?: Array<{
    external_sku: string;
    internal_sku: string;
    remember: boolean;
  }>;
}

export interface SubmissionRequest {
  internal_order_id: number;
}
