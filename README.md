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
├── frontend/              # 前端代码 (Electron + React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── services/
│   ├── package.json
│   └── README.md
│
├── backend/               # 后端代码 (Node.js + Playwright)
│   ├── src/
│   │   ├── api/
│   │   ├── crawler/
│   │   ├── mapper/
│   │   ├── auth/
│   │   └── db/
│   ├── config/
│   ├── package.json
│   └── README.md
│
├── docs/                  # 项目文档
│   ├── requirements.md
│   ├── technical-design.md
│   └── deployment.md
│
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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Full Project

```bash
# Install all dependencies
npm install

# Run both frontend and backend
npm run dev
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

See [GitHub Issues](https://github.com/orderpairs-ship-it/order_link/issues) for detailed task tracking.

### Current Milestone: M1 - Design & Technical Setup

- [ ] UI design completion
- [ ] Frontend tech stack setup
- [ ] Backend crawler prototype
- [ ] Test framework setup
- [ ] Deployment plan

### Timeline

| Milestone | Target | Status |
|-----------|--------|--------|
| M1 - Design & Tech Setup | 2026-03-03 | 🔄 In Progress |
| M2 - Prototype | 2026-03-10 | ⏳ Pending |
| M3 - Full Features | 2026-03-14 | ⏳ Pending |
| M4 - Release v1.0 | 2026-03-14 | ⏳ Pending |

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
