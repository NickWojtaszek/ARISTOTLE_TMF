# ARISTOTLE Trial Master File (TMF)

## Overview

This is a clinical research document management application for the ARISTOTLE Trial Master File (TMF). It's built as a full-stack web application with a React frontend and Express.js backend, designed to manage and display clinical research documents including SOPs (Standard Operating Procedures), protocols, CRF forms, and regulatory documents.

## Recent Changes (July 30, 2025)

✓ Completely removed category system - documents organized only by type with Polish labels
✓ Added separate userCode field for user's custom document numbering system
✓ Maintained system code as unique technical index (auto-generated, grayed out)
✓ Updated document types to intuitive Polish names (Procedury, Protokoły, Formularze, Dokumenty Regulacyjne)
✓ Optimized card sizes to match admin panel proportions for better space utilization  
✓ Replaced action buttons with compact icon-based interface: Edit Entry, Edit Document, Preview
✓ Enhanced text wrapping with line-clamp-2 for better content display
✓ Fixed all 37 documents to display properly on appropriate tabs
✓ Added comprehensive search functionality across all document fields including userCode
✓ Improved grid layout with 4-column support on large screens (xl:grid-cols-4)
✓ Implemented drag & drop functionality for custom document ordering with react-beautiful-dnd
✓ Added sortOrder field to database schema for persistent custom ordering
✓ Visual feedback during drag operations (rotation, scaling, z-index)
✓ Converted navigation from static categories to dynamic document types loaded from API
✓ Added popup-based editing interface for both documents and document types 
✓ Implemented EditDocumentTypeDialog component for consistent UX
✓ Added document type ordering functionality with drag & drop in admin panel
✓ Added sortOrder field to documentTypes schema for persistent navigation ordering

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom clinical research color scheme
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **Development**: Hot module replacement via Vite middleware integration

## Key Components

### Document Management System
The application centers around a document categorization system with four main types:
- **SOPs**: Standard Operating Procedures for clinical trials
- **Protocols**: Main study documents describing trial design
- **Forms**: Case Report Forms (CRF) for patient data collection  
- **Regulatory**: Documents required by regulatory authorities

### Document Ordering & Interaction
- **Drag & Drop**: Users can reorder documents by dragging cards to desired positions
- **Dual Coding System**: Technical system codes (auto-generated) + user custom codes
- **Icon-based Actions**: Compact interface with three actions per document (edit entry, edit document, preview)
- **Persistent Ordering**: Custom sort order saved to database with sortOrder field

### UI Components
- **Navigation**: Tab-based navigation between document categories
- **Search & Filter**: Real-time search with category-based filtering
- **Document Cards**: Grid layout displaying document metadata
- **Responsive Design**: Mobile-first approach with clinical research styling

### Database Schema
Simple user authentication schema with:
- Users table with username/password fields
- UUID primary keys with PostgreSQL's gen_random_uuid()
- Drizzle ORM with Zod validation schemas

## Data Flow

### Frontend Data Flow
1. User navigates between document categories via tab navigation
2. Search and filter inputs update local state
3. Document grid dynamically filters static document data
4. Mock document actions (download/preview) via alert dialogs

### Backend Data Flow
1. Express server handles API routes (prefixed with /api)
2. In-memory storage implementation for user management
3. PostgreSQL session management for user sessions
4. Static document data served from frontend (no database integration yet)

### Development Flow
1. Vite dev server handles frontend asset serving
2. Express middleware integrates with Vite for hot reloading
3. TypeScript compilation across client/server/shared directories
4. Drizzle handles database migrations and schema management

## External Dependencies

### Core Dependencies
- **Database**: Neon serverless PostgreSQL (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **UI**: Comprehensive Radix UI component library
- **Validation**: Zod schemas for type-safe data validation
- **Icons**: Lucide React for consistent iconography

### Development Dependencies
- **Build**: Vite with React plugin and TypeScript support
- **Styling**: Tailwind CSS with PostCSS processing
- **Development**: TSX for TypeScript execution, ESBuild for production builds

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle push command for schema deployment

### Environment Configuration
- **Development**: NODE_ENV=development with Vite dev server
- **Production**: NODE_ENV=production with static file serving
- **Database**: DATABASE_URL environment variable required

### File Organization
- **Client**: React app in `/client` directory
- **Server**: Express app in `/server` directory  
- **Shared**: Common types and schemas in `/shared` directory
- **Configuration**: Root-level config files for tools and build process

The architecture prioritizes type safety with shared TypeScript definitions, developer experience with hot reloading, and clinical research domain requirements with specialized UI components and document categorization.