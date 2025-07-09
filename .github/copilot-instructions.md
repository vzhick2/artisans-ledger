<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

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

## Phase Status - READ THIS FIRST
- **Current Phase**: Phase 1 (UI Prototype with mock data)
- **Completed**: All forms with validation, toast notifications, accessibility
- **DO NOT**: Add database integration, authentication, or backend APIs
- **FOCUS**: UI/UX polish, form validation, accessibility, performance
