# Technology Stack & Development Setup

## Core Technologies

### Frontend Framework
- **React 18.3.1** - Modern React with concurrent features
- **TypeScript 5.8.3** - Type-safe JavaScript development
- **Vite 5.4.19** - Fast build tool and development server

### UI Framework & Styling
- **shadcn/ui** - High-quality React component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Tailwind Animate** - Animation utilities
- **Lucide React** - Beautiful icon library

### Data Visualization
- **Recharts 2.15.4** - Composable charting library
- **React Hook Form 7.61.1** - Performant forms with validation
- **Zod 3.25.76** - TypeScript-first schema validation

### State Management & Data Fetching
- **TanStack React Query 5.83.0** - Server state management
- **React Router DOM 6.30.1** - Client-side routing
- **Custom Hooks** - Domain-specific data management

### Development Tools
- **ESLint 9.32.0** - Code linting and quality
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite Plugin React SWC** - Fast React refresh
- **PostCSS & Autoprefixer** - CSS processing

## Build System & Configuration

### Package Manager
- **npm** - Primary package manager
- **Bun lockfile** - Alternative runtime support

### Build Scripts
```json
{
  "dev": "vite",                    // Development server
  "build": "vite build",            // Production build
  "build:dev": "vite build --mode development", // Development build
  "lint": "eslint .",               // Code linting
  "preview": "vite preview"         // Preview production build
}
```

### Configuration Files
- **`vite.config.ts`** - Vite build configuration
- **`tailwind.config.ts`** - Tailwind CSS customization
- **`tsconfig.json`** - TypeScript compiler options
- **`eslint.config.js`** - ESLint rules and settings
- **`components.json`** - shadcn/ui component configuration

## Development Environment

### TypeScript Configuration
- **Strict Mode**: Enabled for type safety
- **Path Mapping**: `@/` alias for src directory
- **Module Resolution**: Node.js style resolution
- **Target**: ES2020 for modern browser support

### Styling System
- **CSS Variables**: Theme-aware color system
- **Responsive Breakpoints**: Mobile-first design
- **Component Variants**: Class variance authority
- **Animation System**: Tailwind animate utilities

### Code Quality Tools
- **ESLint Rules**: React hooks, React refresh plugins
- **TypeScript Strict**: Full type checking enabled
- **Import Organization**: Consistent import ordering
- **Code Formatting**: Automated formatting standards

## External Integrations

### Data Sources
- **Google Sheets API** - Data integration capabilities
- **REST APIs** - Standard HTTP data fetching
- **Local Data** - Mock data for development

### UI Libraries
- **40+ shadcn/ui Components** - Complete UI component library
- **Radix Primitives** - Accessible component foundations
- **React Resizable Panels** - Layout management
- **Sonner** - Toast notifications

## Performance Optimizations

### Build Optimizations
- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Dead code elimination
- **Asset Optimization** - Image and resource optimization
- **Bundle Analysis** - Build size monitoring

### Runtime Optimizations
- **React Query Caching** - Intelligent data caching
- **Lazy Loading** - Component and route lazy loading
- **Memoization** - React.memo and useMemo optimizations
- **Virtual Scrolling** - Large dataset handling