# Style Guide

Coding standards and conventions for the News Hub Frontend project.

## General Principles

- **Consistency**: Follow established patterns
- **Readability**: Write clear, understandable code
- **Type Safety**: Leverage TypeScript fully
- **Performance**: Consider performance implications
- **Accessibility**: Ensure WCAG compliance

## Tailwind CSS Guidelines

### Class Organization
```tsx
// Order: Layout → Positioning → Box Model → Typography → Visual → Misc
<div className="
  flex flex-col          // Layout
  relative               // Positioning  
  w-full p-4 m-2         // Box Model
  text-lg font-semibold  // Typography
  bg-white border rounded-lg  // Visual
  transition-all         // Misc
">
```

### Responsive Design
```tsx
// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
```

### Custom Classes
```scss
// When Tailwind isn't sufficient
.button {
  @apply px-4 py-2 font-medium rounded-md transition-colors;
  
  &--primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }
}
```

## Component Guidelines

### Naming Conventions
```tsx
// ✅ PascalCase for components
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return <div>{/* content */}</div>;
};

// ✅ camelCase for functions
const handleArticleClick = (articleId: string) => {
  // handle click
};
```

### Component Structure
```tsx
// Standard component template
interface ComponentProps {
  // Props definition
}

const Component: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2 
}) => {
  // Hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default Component;
```

## TypeScript Guidelines

### Type Definitions
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  preferences: UserPreferences;
}

// Use types for unions and computed types
type Status = 'loading' | 'success' | 'error';
type UserWithTimestamp = User & { timestamp: Date };
```

### Props Interface
```typescript
interface ComponentProps {
  // Required props
  title: string;
  onClick: () => void;
  
  // Optional props
  className?: string;
  disabled?: boolean;
  
  // Children
  children?: React.ReactNode;
}
```

## State Management

### React Query
```typescript
// Query hooks
const useArticles = (filters: ArticleFilters) => {
  return useQuery({
    queryKey: ['articles', filters],
    queryFn: () => articleService.getArticles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Local State
```typescript
// Use useState for component state
const [isOpen, setIsOpen] = useState(false);

// Use useReducer for complex state
const [state, dispatch] = useReducer(reducer, initialState);
```

## Testing Guidelines

### Component Testing
```typescript
// Test behavior, not implementation
test('should display article title', () => {
  render(<ArticleCard article={mockArticle} />);
  expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
});

// Test user interactions
test('should call onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Mock Data
```typescript
// Create reusable mock factories
const createMockArticle = (overrides?: Partial<Article>): Article => ({
  id: '1',
  title: 'Test Article',
  content: 'Test content',
  ...overrides,
});
```

## Error Handling

### Error Boundaries
```tsx
// Wrap components in error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### API Error Handling
```typescript
// Consistent error handling
try {
  const data = await apiCall();
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw new Error('Failed to fetch data');
}
```

## Performance Best Practices

### Memoization
```tsx
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// Memoize callbacks
const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);
```

### Code Splitting
```tsx
// Lazy load components
const LazyComponent = React.lazy(() => import('./Component'));

// Use Suspense for loading states
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

## File Organization

```
components/
├── Component/
│   ├── index.ts          # Export
│   ├── Component.tsx     # Main component
│   ├── Component.test.tsx # Tests
│   └── Component.module.scss # Styles (if needed)
```

Follow these guidelines consistently across the project for maintainable, scalable code.
