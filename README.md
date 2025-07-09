# Artisan's Ledger - Inventory Management System

**🏢 INTERNAL BUSINESS APPLICATION**  
*This is a private, internal business tool designed for a specific artisan food producer and their co-owner. It is not intended for public use, multi-tenancy, or commercial distribution.*

A comprehensive inventory management system designed specifically for artisan food producers. Track ingredients, recipes, production batches, purchases, and sales with full cost accounting.

## Live Demo

🚀 **Live Application**: [https://artisans-ledger.vercel.app](https://artisans-ledger.vercel.app)  
📁 **GitHub Repository**: [https://github.com/vzhick2/artisans-ledger](https://github.com/vzhick2/artisans-ledger)

> **Note**: This application is optimized for internal business use only. No SEO optimization, social media integration, or multi-user authentication is included by design.

## Features

### 🎯 Dashboard
- Real-time inventory metrics and alerts
- Action center for low stock items
- Production and financial overview

### 📦 Items Management
- Full CRUD for ingredients, packaging, and products
- Weighted average cost tracking
- Reorder point management
- Status tracking (In Stock, Low Stock, Out of Stock)

### 👨‍🍳 Recipes
- Product formulations with ingredient requirements
- Batch capacity calculations
- Production planning
- Yield tracking

### 🛒 Purchases
- Spreadsheet-style purchase logging
- Weighted average cost calculation
- Supplier management
- Cost density feedback

### 🏭 Production Batches
- Production batch tracking
- Yield calculations
- Material and labor cost tracking
- Recipe versioning

### 📊 Sales & Reporting
- Monthly sales tracking
- Business intelligence reports
- Complete transaction ledger
- Inventory value reporting

## Technology Stack

### Current (Phase 1 - UI Prototype)
- **Frontend**: Next.js 15+ with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Forms**: react-hook-form with zod validation
- **Data**: Mock/sample data
- **Deployment**: Vercel

### Future Phases
- **Data Management**: TanStack Query (React Query) and TanStack Table
- **Database**: Supabase PostgreSQL 
- **Authentication**: Supabase Auth

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/vzhick2/artisans-ledger.git
   cd artisans-ledger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/        # Dashboard layout group
│   │   ├── dashboard/      # Main dashboard
│   │   ├── items/          # Items management
│   │   ├── recipes/        # Recipe management
│   │   ├── purchases/      # Purchase logging
│   │   └── layout.tsx      # Dashboard layout
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── ui/                 # shadcn/ui components
│   └── sidebar.tsx         # Navigation sidebar
└── lib/                    # Utilities and data
    ├── sample-data.ts      # Mock data for prototype
    └── utils.ts            # Utility functions
```

## Current Status

**Phase 1: UI Prototype with Mock Data** ✅
- Core navigation and layout
- Dashboard with real-time metrics
- Items management with filtering
- Recipes with batch calculations
- Purchase logging interface
- All features working with sample data
- **Status**: Core objectives met, ready for Phase 2 or continued iteration

**Phase 2: Database Integration** (Next)
- Supabase setup and schema
- Real data persistence
- PostgreSQL RPC functions

**Phase 3: Authentication** (Future)
- User management
- Multi-tenancy
- Role-based access

**Phase 4: Advanced Features** (Future)
- Advanced reporting
- Inventory forecasting
- API integrations

## Business Logic

### Weighted Average Costing
All inventory costs use weighted average methodology to ensure accurate cost tracking across multiple purchases.

### Atomic Transactions
All multi-step operations (purchases, batches) are atomic to maintain data integrity.

### Immutable Ledger
All inventory changes are logged immutably for complete audit trails.

## Development

### Code Style
- TypeScript for type safety
- Next.js App Router patterns
- shadcn/ui components
- Tailwind CSS for styling
- Proper form validation with react-hook-form and zod

### Testing
- Unit tests for business logic
- E2E tests for critical workflows
- PostgreSQL function testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## ⚠️ Important: Dependencies to Preserve

**These packages are part of the planned tech stack and should not be removed:**
- `@tanstack/react-query` & `@tanstack/react-table` - For Phase 2 data management
- `react-hook-form` & `zod` & `@hookform/resolvers` - Form validation system
- `lucide-react` - Icon library
- `tailwind-merge` & `clsx` & `class-variance-authority` - Styling utilities
- All `@radix-ui/*` packages - shadcn/ui component system
- `use-debounce` - Input performance optimization
- `cross-env` - Cross-platform environment variables

Only remove packages that are not listed in the Technology Stack section or are genuinely unused development artifacts.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
