# FAT Digital Repair POS

> **Enterprise Repair Shop Management SaaS**  
> Premium VIP Interface · Animated Repair Wizard · Inventory · POS · CRM · Reports

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your PostgreSQL DATABASE_URL

# 3. Set up the database
npx prisma db push
npx prisma generate
npm run db:seed

# 4. Start development server
npm run dev
```

**Visit** [http://localhost:3000](http://localhost:3000)

**Login**: `fatrepairpos@gmail.com` / `fatrepairpos123@`

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + CSS Variables |
| **Animation** | Framer Motion |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | JWT (jose) + bcrypt |
| **Icons** | Lucide React |
| **State** | Zustand |

---

## 📦 Features

### 🔧 Repair Wizard (11 Steps)
1. **Device Type** — Premium selection cards
2. **Brand** — Searchable brand grid
3. **Model** — Complete device database  
4. **Services** — Multi-select repair services
5. **Device Info** — IMEI, serial, passcode, storage
6. **Inspection** — Working/Not Working checklist
7. **Photos** — Capture & upload device images
8. **Parts** — Parts replacement with cost tracking
9. **Customer** — Search existing or create new
10. **Technician** — Assignment + estimated time
11. **Review & Cost** — Labour, parts, tax, discount

### 📊 Dashboard
- Live stats: total/active/pending/completed repairs
- Sales overview: daily/weekly/monthly/yearly
- Progress bars, recent repairs, low stock alerts

### 📱 Customer Tracking Portal
- Public tracking by Tracking ID
- Live countdown timer based on estimated repair time
- Status timeline with animated progress
- Device info, technician, services, parts, pricing

### 💼 Inventory Management
- Products with SKU, cost/sell prices, stock levels
- Low stock alerts
- Stock history tracking

### 💰 Sales POS
- Product search & add-to-cart
- Walk-in customer sales
- Tax calculation, checkout

### 👥 CRM
- Customer database with repair history
- Auto-generated Customer IDs (CUST-000001)
- Search by name, phone, ID

### 👨‍🔧 Technician Management
- Skills, experience, availability tracking
- Repair assignment
- Performance stats

### 📈 Reports
- Daily/Weekly/Monthly/Yearly reports
- PDF, Excel, CSV export ready

### 🎫 VIP E-Vouchers
- Premium digital vouchers
- QR code, barcode, download, print, share

### 🔐 Enterprise Security
- JWT authentication with session management
- Role-based access (Super Admin, Admin, Manager, Reception, Technician)
- Audit logging
- Protected API router

---

## 📁 Project Structure

```
fat-digital-repair-pos/
├── prisma/
│   ├── schema.prisma          # Complete database schema
│   └── seed.ts                # Seed data (devices, brands, models)
├── src/
│   ├── app/
│   │   ├── api/               # REST API routes
│   │   │   ├── auth/          # Login, session
│   │   │   ├── customers/     # CRUD
│   │   │   ├── dashboard/     # Stats
│   │   │   ├── devices/       # Categories, brands, models
│   │   │   ├── inventory/     # Products
│   │   │   ├── repairs/       # Repair orders
│   │   │   ├── services/      # Repair services + inspection
│   │   │   ├── settings/      # Company settings
│   │   │   ├── technicians/   # Technicians
│   │   │   └── tracking/      # Public tracking
│   │   ├── dashboard/         # Dashboard page
│   │   ├── repairs/           # Repair list + wizard + detail
│   │   ├── customers/         # Customer list
│   │   ├── inventory/         # Inventory list
│   │   ├── technicians/       # Technician list
│   │   ├── sales/             # POS
│   │   ├── reports/           # Reports
│   │   ├── invoices/          # Invoices
│   │   ├── vouchers/          # VIP E-Vouchers
│   │   ├── settings/          # Settings
│   │   ├── tracking/          # Admin tracking lookup
│   │   ├── repairman/         # Technician workbench
│   │   └── track/[trackingId]/ # Public tracking
│   ├── components/
│   │   ├── repair-wizard/     # 11 step components
│   │   ├── dashboard-layout.tsx
│   │   └── client-layout.tsx
│   ├── hooks/
│   │   └── use-auth.ts        # Auth state (Zustand)
│   ├── lib/
│   │   ├── auth.ts            # JWT utilities
│   │   ├── prisma.ts          # DB client
│   │   └── utils.ts           # Helpers
│   └── types/
│       └── index.ts           # TypeScript types
├── .env.example
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🗄️ Database Models

- **Users** (Super Admin, Admin, Manager, Reception, Technician)
- **Customers** (with auto-generated IDs)
- **Technicians** (skills, experience, availability)
- **DeviceCategory / DeviceBrand / DeviceModel** (full hierarchy)
- **RepairService** (customizable repair services)
- **InspectionItem** (checklist items)
- **Repair** (the core repair order with full workflow)
- **RepairItem / InspectionResult / RepairPart / RepairImage**
- **InventoryProduct / InventoryCategory / Supplier**
- **SalesOrder / SaleItem / Refund**
- **Payment / RepairInvoice / VipVoucher**
- **StatusHistory / Notification / ActivityLog / AuditLog**
- **CompanySettings**

---

## 🎨 Design System

- **Colors**: White, Black, Deep Red (#E51D1D), Light Gray
- **Style**: Glassmorphism, soft shadows, rounded corners
- **Animations**: Framer Motion — page transitions, sidebar, cards, buttons, progress
- **Icons**: Lucide React
- **Typography**: Inter font family

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/login` | Login |
| GET/DELETE | `/api/auth/session` | Session |
| GET/POST | `/api/customers` | List/Create customers |
| GET/PUT/DELETE | `/api/customers/:id` | Customer CRUD |
| GET/POST | `/api/repairs` | List/Create repairs |
| GET/PUT/DELETE | `/api/repairs/:id` | Repair CRUD |
| GET | `/api/dashboard` | Dashboard stats |
| GET/POST | `/api/devices?type=...` | Device data |
| GET/POST | `/api/services?type=...` | Services + inspection |
| GET/POST | `/api/inventory` | Inventory |
| GET/POST | `/api/technicians` | Technicians |
| GET/PUT | `/api/settings` | Company settings |
| GET | `/api/tracking?trackingId=...` | Public tracking |

---

## 🚢 Deployment

### Vercel
```bash
# Set DATABASE_URL in Vercel environment variables
vercel deploy
```

### Replit
```bash
# Add DATABASE_URL to Secrets
# Run: npm run db:push && npm run db:seed
npm run dev
```

### Docker (optional)
```dockerfile
# Add Dockerfile for containerized deployment
```

---

## 🔑 Default Credentials

| Username | Password | Role |
|----------|----------|------|
| `fatrepairpos@gmail.com` | `fatrepairpos123@` | Super Admin |
| `fatrepairpos@gmail.com` | `fatrepairpos123@` | Admin |

---

## 📝 License

Proprietary — FAT Digital Repair © 2026
