# Development Guidelines & Standards

## Code Quality Standards

### TypeScript Usage
- **Strict Type Safety**: All components use explicit TypeScript interfaces and types
- **Interface Definitions**: Complex props defined with detailed interfaces (e.g., `KPICardProps`, `HRChartsProps`)
- **Generic Types**: Proper use of generics for reusable components and hooks
- **Type Guards**: Runtime type checking in data parsing functions
- **Null Safety**: Explicit handling of optional properties with `?.` operator

### Import Organization
- **Structured Imports**: React imports first, followed by third-party libraries, then local imports
- **Path Aliases**: Consistent use of `@/` alias for src directory imports
- **Grouped Imports**: Related imports grouped together (UI components, hooks, types)
- **Named Exports**: Preference for named exports over default exports for better tree-shaking

### Component Architecture Patterns

#### Functional Components with Hooks
- **React.forwardRef**: Extensive use for component composition and ref forwarding
- **Custom Hooks**: Domain-specific data hooks (`useMarketingData`, `useSidebar`)
- **useMemo/useCallback**: Performance optimization for expensive calculations
- **useEffect**: Proper cleanup and dependency arrays

#### Component Composition
- **Compound Components**: Complex components broken into sub-components (Sidebar system)
- **Render Props**: Flexible component APIs with children as functions
- **Slot Pattern**: Using Radix Slot for polymorphic components
- **Context Providers**: Centralized state management for component trees

### Styling Standards

#### Tailwind CSS Conventions
- **Utility Classes**: Extensive use of Tailwind utility classes
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **CSS Variables**: Theme-aware color system with CSS custom properties
- **Class Variance Authority**: Systematic variant management for component styling

#### Component Styling Patterns
- **cn() Utility**: Consistent use of clsx/tailwind-merge utility for conditional classes
- **Glass Card Effect**: Standardized glass-card styling across dashboard components
- **Gradient Backgrounds**: Consistent gradient application with theme-aware colors
- **Animation Classes**: Tailwind animate utilities for smooth transitions

## Semantic Patterns

### Data Processing Patterns
- **useMemo for Calculations**: Heavy data transformations wrapped in useMemo
- **Data Aggregation**: Consistent patterns for grouping and summarizing data
- **CSV Parsing**: Robust CSV parsing with error handling and fallback data
- **Data Caching**: Centralized caching mechanism with cache invalidation

### Chart Component Patterns
- **Recharts Integration**: Standardized chart configuration and theming
- **Responsive Containers**: All charts use ResponsiveContainer for adaptability
- **Color Consistency**: Predefined color arrays for consistent chart styling
- **Tooltip Formatting**: Custom formatters for currency, percentages, and numbers

### State Management Patterns
- **Custom Hooks**: Encapsulated business logic in domain-specific hooks
- **Filter State**: Consistent filter object structure across all dashboards
- **Loading States**: Proper loading and error state management
- **Data Transformation**: Separation of raw data and filtered/processed data

## Internal API Usage Patterns

### Component Props Patterns
```typescript
// Standard KPI Card interface
interface KPICardProps {
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percent' | 'currencyShort' | 'million';
  icon: React.ReactNode;
  trend?: number;
  sparklineData?: number[];
  delay?: number;
  gradient?: 'primary' | 'secondary' | 'success' | 'warning' | 'accent' | 'info';
  change?: number;
}
```

### Data Hook Patterns
```typescript
// Standard data hook return structure
return {
  data: filteredData,
  rawData,
  loading,
  error,
  filters,
  setFilters,
  kpis,
  filterOptions,
  refetch: fetchData,
  isUsingLiveData,
  insights,
};
```

### Chart Component Structure
```typescript
// Standard chart component pattern
export function DomainCharts({ data }: { data: DomainRecord[] }) {
  const chartData = useMemo(() => {
    // Data transformation logic
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Chart cards with consistent structure */}
    </div>
  );
}
```

## Frequently Used Code Idioms

### Animation and Transitions
- **Staggered Animations**: Delay props for sequential component animations
- **Hover Effects**: Consistent hover transformations (`hover:-translate-y-1`)
- **Loading Skeletons**: Skeleton components for loading states
- **Smooth Transitions**: `transition-all duration-500` for smooth state changes

### Data Formatting
- **Number Formatting**: Intl.NumberFormat for locale-aware number display
- **Currency Display**: Consistent currency formatting with K/M suffixes
- **Percentage Display**: Standardized percentage formatting with decimal places
- **Date Handling**: ISO date string parsing and formatting

### Error Handling
- **Fallback Data**: Graceful degradation with realistic fallback datasets
- **Try-Catch Blocks**: Comprehensive error handling in async operations
- **Error Boundaries**: Component-level error handling
- **Loading States**: Proper loading state management during data fetching

## Popular Annotations and Comments

### Component Documentation
- **DisplayName**: All forwardRef components have explicit displayName
- **JSDoc Comments**: Interface properties documented with descriptions
- **TODO Comments**: Clear action items for future improvements
- **Performance Notes**: Comments explaining optimization decisions

### Code Organization
- **Section Comments**: Clear section dividers in large components
- **Magic Number Constants**: Named constants for configuration values
- **Type Assertions**: Explicit type assertions with explanatory comments
- **Conditional Logic**: Comments explaining complex conditional rendering

## Best Practices Summary

1. **Type Safety First**: Always use TypeScript interfaces and explicit types
2. **Performance Optimization**: Use useMemo/useCallback for expensive operations
3. **Consistent Styling**: Follow established Tailwind patterns and utility usage
4. **Component Composition**: Break complex components into smaller, reusable parts
5. **Error Handling**: Implement graceful fallbacks and proper error states
6. **Accessibility**: Use semantic HTML and ARIA attributes where needed
7. **Code Reusability**: Extract common patterns into custom hooks and utilities
8. **Documentation**: Maintain clear interfaces and component documentation