# Order Link ⚙️

External to internal order conversion tool for sales teams.

## Problem

Sales reps need to:
1. Log into customer order systems (BYD, Huawei, Meituan, etc.)
2. Find orders related to their company
3. Manually convert to internal ERP format
4. Submit to internal system

This tool automates and streamlines that workflow.

## Features

- 🕷️ **Web Scraping** - Automated login and order extraction from customer systems
- 🔄 **Order Conversion** - Transform external orders to internal format
- 🧠 **Smart Mapping** - Learn and remember field/SKU mappings
- 📊 **Workflow Management** - Track order status from scrape → convert → submit
- 🔐 **Secure Credentials** - Encrypted storage for customer login info

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Database:** SQLite (local-first, single user)
- **API:** Express.js
- **Scraping:** Playwright (browser automation)
- **Security:** crypto-js for credential encryption

## Project Structure

```
order_link/
├── src/
│   ├── api/           # REST API endpoints
│   │   ├── customers.ts
│   │   ├── orders.ts
│   │   └── mappings.ts
│   ├── db/            # Database schema & migrations
│   │   └── schema.ts
│   ├── scraper/       # Web scraping engine (TODO)
│   ├── mapper/        # Field mapping logic (TODO)
│   ├── types/         # TypeScript definitions
│   │   └── index.ts
│   └── index.ts       # Main entry point
├── config/            # Customer scraper configs
├── data/              # SQLite database
├── package.json
└── README.md
```

## API Endpoints

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders
- `GET /api/orders/external` - List external orders
- `GET /api/orders/external/:id` - Get external order
- `POST /api/orders/sync` - Trigger scraping
- `POST /api/orders/:id/convert` - Convert to internal order
- `GET /api/orders/internal` - List internal orders
- `POST /api/orders/:id/submit` - Submit to ERP
- `GET /api/orders/:id/exceptions` - Get order exceptions

### Mappings
- `GET /api/mappings/fields` - List field mappings
- `POST /api/mappings/fields` - Create field mapping
- `GET /api/mappings/materials` - List material mappings
- `POST /api/mappings/materials` - Create material mapping
- `GET /api/mappings/materials/lookup` - Quick SKU lookup

## Development

```bash
# Install dependencies
npm install

# Run in dev mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Database Schema

Key tables:
- `customers` - Customer systems (BYD, Huawei, etc.)
- `credentials` - Encrypted login credentials
- `external_orders` - Raw scraped orders
- `internal_orders` - ERP-ready orders
- `field_mappings` - External ↔ internal field mappings
- `material_mappings` - SKU mappings with price ratios
- `order_exceptions` - Validation errors and discrepancies
- `scrape_sessions` - Scraping job history

## Next Steps

1. ✅ Database schema
2. ✅ REST API scaffolding
3. ⏳ Web scraper implementation (Playwright)
4. ⏳ Credential encryption
5. ⏳ SMS verification flow
6. ⏳ ERP submission automation
7. ⏳ Frontend integration

## CI/CD

GitHub Actions pipeline configured in `.github/workflows/ci.yml`:
- 🧪 Automated testing on PR
- 🔒 Code linting
- 📦 Build artifacts

## Team

| Role | Member |
|------|--------|
| PM | @MacAssistant_roadmap_V26_Bot |
| UI/UX | @Assistant_pixel_v26_Bot |
| Frontend | @Assistant_canvas_v26_Bot |
| Backend | Kernel ⚙️ / @Assistant_Backend_v26_Bot |
| QA | @Assistant_Quality_v26_Bot |
| DevOps | @pqorderbot |

---

Built for the daydayup team 🚀
