# Artisan's Ledger - AI Assistant Instructions

## 🏢 PROJECT CONTEXT

**Private internal business tool** for artisan food producers. NOT for public use, multi-tenancy, or SaaS deployment.

**Tech Stack**: Next.js 15 + TypeScript + shadcn/ui + Tailwind CSS + TanStack Query + Supabase (Phase 2)

**Current Phase**: Phase 1 (UI Prototype with mock data)

## 🚨 TASK MANAGEMENT - CRITICAL FOR AI ASSISTANTS

## 🚨 AI ASSISTANT BEHAVIOR RULES - MANDATORY

**MUST ASK BEFORE:**

- Creating/modifying ANY files
- Changing package.json, .vscode/\*, configs
- Running commands that make persistent changes

**WHEN USER SAYS "SUGGEST":**

- Provide options WITHOUT implementing
- Always ask: "Should I implement [specific item]?"

**EMERGENCY OVERRIDE ONLY:**

- Build fixes, broken functionality (explain why)

**VIOLATION = DAMAGED TRUST**

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

## 🎯 CORE PATTERNS

**Code Style**: TypeScript strict mode, Next.js App Router, shadcn/ui components, react-hook-form + zod validation, Tailwind CSS

**Business Logic**: Weighted average costing, atomic transactions, immutable ledger, real-time calculations

**Component Patterns**: Client components for interactivity, proper loading/error states, TypeScript types for all data

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
- **Phase 1 Progress**: ~60% complete - major blueprint features still needed
- **Priority**: Complete remaining blueprint features before Phase 2
- **Reference**: Check TASKS.md for actual remaining work
- **DO NOT**: Add database integration, authentication, or backend APIs without explicit request
- **FOCUS**: UI/UX improvements, form validation, accessibility enhancements

## 🚀 DEVELOPMENT GUIDANCE

**Approach**: Suggest first, wait for approval, then implement small focused changes

**Deployment**: Vercel deployment - check existing status before changes

**Phase 2 Prep**: TanStack Query/Table ready for Supabase integration when requested
