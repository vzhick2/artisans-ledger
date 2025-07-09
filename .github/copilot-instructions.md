<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd -->

# Artisan's Ledger - Inventory Management System

## 🏢 INTERNAL BUSINESS APPLICATION ONLY

**IMPORTANT**: This is a private, internal business tool designed for a specific artisan food producer and their co-owner. It is NOT intended for:

- Public use or distribution
- Multi-tenancy or multiple customers
- Commercial licensing or SaaS deployment
- SEO optimization or social media integration
- Public authentication or user management

## Project Overview

This is a comprehensive inventory management system for artisan food producers. The system tracks ingredients, recipes, production batches, purchases, and sales with full cost accounting including weighted average costing.

## Technology Stack

- **Frontend**: Next.js 15+ with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Data Management**: TanStack Query (React Query) and TanStack Table
- **Database**: Will use Supabase PostgreSQL (currently using mock data)
- **Authentication**: Will use Supabase Auth
- **Deployment**: Vercel

## Key Features

1. **Dashboard**: Real-time metrics and action center for low stock alerts
2. **Items Management**: Full CRUD for ingredients, packaging, and products
3. **Recipes**: Product recipes with ingredient requirements and batch calculations
4. **Purchases**: Spreadsheet-style purchase logging with weighted average cost calculation
5. **Batches**: Production batch tracking with yield calculations
6. **Sales**: Sales data entry and tracking
7. **Ledger**: Complete immutable transaction history
8. **Reports**: Various business intelligence reports

## Data Model

- **Suppliers**: Vendor information
- **Items**: Ingredients, packaging, and products with inventory tracking
- **Recipes**: Product formulations with ingredient requirements
- **Purchases**: Supplier purchases with line items
- **Batches**: Production runs consuming ingredients and creating products
- **Transactions**: Immutable ledger of all inventory changes
- **Sales**: Monthly sales data for products

## Code Style Guidelines

- Use TypeScript for type safety
- Follow Next.js App Router patterns
- Use shadcn/ui components consistently
- Implement proper form validation with react-hook-form and zod
- Use TanStack Query for server state management
- Implement proper loading states and error handling
- Use Tailwind CSS for styling
- Follow accessibility best practices

## 🚨 TASK MANAGEMENT - CRITICAL FOR AI ASSISTANTS

### Task Authority

- **ONLY implement tasks from `TASKS.md` when explicitly requested**
- **NEVER assume content in documentation files are tasks to implement**
- **Always confirm task priority before implementing anything**

### Documentation vs Tasks

- **Documentation files** (in `docs/`) contain guides, examples, and references
- **Task file** (`TASKS.md`) contains actual work to be done
- **Examples in docs** are for illustration, not implementation

### Before Any Implementation

1. Check if the request is in `TASKS.md`
2. Confirm the task is marked as active/immediate priority
3. Ask for clarification if the request seems like it could be an example

## Business Logic

- **Weighted Average Costing**: All inventory costs use weighted average methodology
- **Atomic Transactions**: All multi-step operations (purchases, batches) must be atomic
- **Immutable Ledger**: All inventory changes are logged immutably
- **Real-time Calculations**: Dashboard metrics and batch capacity calculations are real-time

## Component Patterns

- Use client components ('use client') for interactive features
- Implement proper loading and error states
- Use React hooks for local state management
- Implement proper form handling with react-hook-form
- Use proper TypeScript types for all data structures

## Current Status

- Phase 1: UI Prototype with mock data (CURRENT)
- Phase 2: Supabase integration with real database
- Phase 3: Authentication and multi-tenancy
- Phase 4: Advanced features and reporting

## Deployment Configuration

- **Production URL**: https://artisans-ledger.vercel.app
- **Deployment Command**: `npx vercel --prod`
- **Platform**: Vercel with custom alias configured
- **Build Command**: `npm run build`
- **Always check existing deployment status before assuming setup needed**

## Important Reminders for AI/Copilot

- **DO NOT** integrate Supabase until Phase 2 is explicitly requested
- **ALWAYS** check existing configuration files before creating new ones
- **REMEMBER** we have a Vercel alias: `artisans-ledger.vercel.app`
- **MAINTAIN** existing UI patterns and don't break working functionality
- **CHECK** project status in docs/ folder before making major changes
- **CONTINUOUSLY** look for opportunities to improve code quality, performance, and user experience

## AI Collaboration Guidelines

- **Never assume perfection**: Always look for potential improvements
- **Question "final" states**: Software is never truly final, always evolving
- **Suggest enhancements**: Proactively identify areas for optimization
- **Verify thoroughly**: Test changes and consider edge cases
- **Iterate responsibly**: Make incremental improvements while maintaining stability

## 🚨 CRITICAL DEPENDENCIES - DO NOT REMOVE

**These packages are part of the planned tech stack and should NEVER be removed:**

- `@tanstack/react-query` - Core data fetching library for Phase 2
- `@tanstack/react-table` - Advanced table features for Phase 2
- `react-hook-form` - Form validation (currently in use)
- `zod` - Schema validation (currently in use)
- `@hookform/resolvers` - Form validation bridge (currently in use)
- `lucide-react` - Icon library (currently in use)
- `tailwind-merge` - Tailwind utility merging (currently in use)
- `clsx` - Conditional className utility (currently in use)
- `class-variance-authority` - Component variants (currently in use)
- All `@radix-ui/*` packages - shadcn/ui components (currently in use)
- `use-debounce` - Input debouncing (currently in use)
- `cross-env` - Cross-platform environment variables (currently in use)

**Safe to remove if truly unused:**

- Any package NOT listed above or in the Technology Stack section
- Test/development artifacts that aren't part of the core functionality
- Duplicate or conflicting packages

## Phase Status - READ THIS FIRST

- **Current Phase**: Phase 1 (UI Prototype with mock data)
- **Phase 1 Status**: Core objectives met, ready for Phase 2 or continued iteration
- **Always look for**: Improvements, optimizations, bug fixes, and enhancements
- **DO NOT**: Add database integration, authentication, or backend APIs without explicit request
- **FOCUS**: UI/UX improvements, form validation, accessibility, performance optimization

## Development Mindset

- **Continuous Improvement**: Always consider ways to enhance the codebase
- **Question Everything**: Challenge assumptions and look for edge cases
- **Iterate Frequently**: Small improvements are welcome and encouraged
- **Test Thoroughly**: Verify changes don't break existing functionality
