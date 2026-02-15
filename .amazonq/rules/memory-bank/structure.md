# Project Structure & Architecture

## Directory Organization

### `/src/components/` - Component Library
- **`/dashboard/`** - Shared dashboard components (KPICard, charts, data tables)
- **`/finance/`** - Finance-specific components and charts
- **`/hr/`** - HR dashboard components and analytics
- **`/marketing/`** - Marketing analytics components
- **`/support/`** - Support dashboard components
- **`/layout/`** - Layout components (header, sidebar, main layout)
- **`/ui/`** - shadcn/ui component library (40+ reusable UI components)

### `/src/hooks/` - Custom React Hooks
- Domain-specific data hooks (`useFinanceData`, `useHRData`, etc.)
- UI utility hooks (`use-mobile`, `use-toast`)
- Data fetching and state management hooks

### `/src/pages/` - Route Components
- Individual dashboard pages for each domain
- Main index page and error handling (NotFound)
- Test pages for development and debugging

### `/src/types/` - TypeScript Definitions
- Domain-specific type definitions for each dashboard
- Shared interfaces and data models
- API response types and component props

### `/src/lib/` - Utility Libraries
- Data caching and management utilities
- Google Sheets integration and testing
- Common utility functions and helpers

## Core Architecture Patterns

### Component Architecture
- **Atomic Design**: UI components organized from atoms to organisms
- **Domain-Driven**: Components grouped by business domain
- **Composition Pattern**: Flexible component composition with props
- **Render Props**: Advanced patterns for data visualization components

### Data Flow Architecture
- **Custom Hooks**: Centralized data fetching and state management
- **React Query**: Server state management and caching
- **Local State**: Component-level state for UI interactions
- **Context API**: Theme and global state management

### Layout System
- **Responsive Grid**: CSS Grid and Flexbox for adaptive layouts
- **Sidebar Navigation**: Collapsible sidebar with route-based navigation
- **Dashboard Layout**: Consistent layout wrapper for all dashboards
- **Card-Based UI**: Modular card components for metrics and charts

### Chart & Visualization Architecture
- **Recharts Integration**: Consistent charting library across all dashboards
- **Reusable Chart Components**: Standardized chart components with theming
- **Data Transformation**: Utility functions for chart data preparation
- **Interactive Features**: Hover states, tooltips, and drill-down capabilities

## Key Relationships

### Component Dependencies
- Dashboard pages consume domain-specific components
- All components use shared UI library from `/ui/`
- Layout components wrap page content consistently
- Chart components share common styling and behavior patterns

### Data Flow Relationships
- Hooks provide data to page components
- Pages pass data down to chart and table components
- Filter components communicate state changes upward
- Caching layer optimizes data fetching across components

### Styling Architecture
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Theme-aware color system
- **Component Variants**: Class variance authority for component styling
- **Responsive Design**: Mobile-first responsive breakpoints