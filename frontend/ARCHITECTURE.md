# Architecture Overview

React application architecture with TypeScript, modern patterns, and performance optimizations.

## High-Level Architecture

```
Browser ←→ React App ←→ API Services ←→ Backend API
```

## Core Principles

- **Component-Based Architecture**: Modular, reusable components
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context + React Query
- **Performance**: Code splitting and lazy loading
- **Scalability**: Clean separation of concerns

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── news/           # News-specific components
│   └── ui/             # Generic UI components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── context/            # React Context providers
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── i18n/               # Internationalization
```

## Component Organization

### UI Components (`/components/ui`)
- `Button.tsx` - Reusable button component
- `Input.tsx` - Form input component
- `Card.tsx` - Generic card container
- `LoadingSpinner.tsx` - Loading indicator

### Feature Components
- `/auth` - Login/Register forms
- `/news` - Article cards, lists, filters
- `/layout` - Header, Footer, Navigation

## State Management

### Context Providers
- **AuthContext**: User authentication state
- **LanguageContext**: i18n localization
- **NewsContext**: News-related global state

### React Query
- Server state management
- Caching and synchronization
- Background updates
- Optimistic updates

## Custom Hooks

```typescript
// API hooks
useArticles()     // Fetch articles with filters
useAuth()         // Authentication operations
usePreferences()  // User preferences

// Utility hooks
useLocalStorage() // Local storage management
useDebounce()     // Debounced values
useMediaQuery()   // Responsive breakpoints
```

## Routing

```typescript
// Route structure
/                    # Home page
/login              # Authentication
/register           # User registration
/articles           # Article listing
/articles/:id       # Article details
/preferences        # User settings
```

## Type System

```typescript
// Core types
interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
}

interface User {
  id: string;
  email: string;
  preferences: UserPreferences;
}
```

## Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **React.memo**: Prevent unnecessary re-renders
- **Virtual Scrolling**: For large article lists
- **Image Optimization**: Lazy loading and WebP support
- **Bundle Analysis**: Webpack bundle analyzer

## Styling Architecture

### Tailwind CSS
- Utility-first CSS framework
- Custom design system
- Responsive design patterns
- Dark mode support

### Component Styles
```typescript
// Style organization
const cardStyles = {
  base: "rounded-lg shadow-md p-4",
  variants: {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-100 text-gray-900"
  }
}
```

## Internationalization

- **i18next**: Multi-language support
- **Namespace organization**: Feature-based translations
- **Dynamic loading**: Language resources on demand
- **RTL support**: Right-to-left language support

For implementation details, see individual component files.

- **`useAuthApi.ts`**: Authentication API calls
- **`useNewsApi.ts`**: News data fetching
- **`useNewsQueries.ts`**: React Query news queries
- **`useAutocompleteOptions.ts`**: Autocomplete data hooks
- **`useFilterOptions.ts`**: Filter options management
- **`useLanguage.ts`**: Language switching logic
- **`useLocalStorage.tsx`**: Local storage management
- **`usePreferences.ts`**: User preferences management
- **`useArticleData.ts`**: Article data processing

#### `/pages` - Route Components

- **`Home.tsx`**: Main news feed page
- **`Login.tsx`**: Login page
- **`Register.tsx`**: Registration page
- **`Profile.tsx`**: User profile page
- **`ArticleDetails.tsx`**: Individual article page

#### `/services` - API Layer

- **`authService.ts`**: Authentication API calls
- **`newsService.ts`**: News data API calls
- **`filterOptionsService.ts`**: Filter options API calls

#### `/types` - TypeScript Definitions

- **`auth.ts`**: Authentication-related types
- **`news.ts`**: News and article types
- **`ui.ts`**: UI component types
- **`context.ts`**: Context type definitions
- **`forms.ts`**: Form-related types
- **`filter-options.ts`**: Filter option types

#### `/utils` - Utilities

- **`constants.ts`**: Application constants
- **`endpoints.ts`**: API endpoint definitions
- **`helpers.ts`**: General utility functions
- **`filterUtils.ts`**: Filter-specific utilities
- **`performance.ts`**: Performance optimization utilities

## 🎯 Design Patterns

### 1. Component Composition Pattern

```typescript
// Layout composition
<Layout>
  <Header />
  <main>
    <FilterPanel />
    <ArticleList />
  </main>
  <Footer />
</Layout>
```

### 2. Custom Hooks Pattern

```typescript
// Encapsulating logic in custom hooks
function useArticleData(filters: NewsFilters) {
  const { data, isLoading, error } = useNewsQueries(filters);
  const processedData = useMemo(() => processArticles(data), [data]);
  
  return { articles: processedData, isLoading, error };
}
```

### 3. Context Provider Pattern

```typescript
// Providing global state
<AuthProvider>
  <LanguageProvider>
    <NewsProvider>
      <App />
    </NewsProvider>
  </LanguageProvider>
</AuthProvider>
```

### 4. Error Boundary Pattern

```typescript
// Error handling at component boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <SuspiciousComponent />
</ErrorBoundary>
```

### 5. Compound Component Pattern

```typescript
// Complex components with sub-components
<FilterPanel>
  <FilterPanel.Search />
  <FilterPanel.Categories />
  <FilterPanel.DateRange />
</FilterPanel>
```

## 🔄 Data Flow Architecture

### 1. Server State Management (React Query)

```typescript
// Centralized server state management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
```

### 2. Client State Management (Context + useReducer)

```typescript
// Local state management pattern
const [state, dispatch] = useReducer(authReducer, initialState);

// Actions
dispatch({ type: 'LOGIN_SUCCESS', payload: user });
dispatch({ type: 'LOGOUT' });
```

### 3. Form State Management

```typescript
// Controlled components with validation
const [formData, setFormData] = useState(initialFormData);
const [errors, setErrors] = useState({});

const handleSubmit = async (data: FormData) => {
  const validationErrors = validateForm(data);
  if (Object.keys(validationErrors).length === 0) {
    await submitForm(data);
  }
};
```

## 🚀 Performance Optimizations

### 1. Code Splitting

```typescript
// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));

// Route-based splitting
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

### 2. Memoization

```typescript
// Component memoization
const ArticleCard = memo(({ article }: ArticleCardProps) => {
  return <Card>{/* article content */}</Card>;
});

// Value memoization
const expensiveValue = useMemo(() => {
  return processLargeDataset(data);
}, [data]);

// Callback memoization
const handleClick = useCallback((id: string) => {
  onArticleClick(id);
}, [onArticleClick]);
```

### 3. Virtual Scrolling (for large lists)

```typescript
// Implemented in ArticleList for handling large datasets
const VirtualizedList = ({ items, renderItem }) => {
  // Virtual scrolling implementation
};
```

### 4. Image Optimization

```typescript
// Lazy loading images with intersection observer
const LazyImage = ({ src, alt }: ImageProps) => {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(/* ... */);
    // Implementation
  }, []);
};
```

## 🛡️ Security Patterns

### 1. Authentication Flow

```typescript
// JWT token management
const useAuth = () => {
  const [token, setToken] = useLocalStorage('token', null);
  
  const login = async (credentials: LoginData) => {
    const response = await authService.login(credentials);
    setToken(response.token);
  };
  
  const logout = () => {
    setToken(null);
    queryClient.clear();
  };
};
```

### 2. Protected Routes

```typescript
// Route protection component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

### 3. API Security

```typescript
// Secure API calls with token injection
const fetcher = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
```

## 🌐 Internationalization (i18n)

### Architecture

```typescript
// i18n setup with react-i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      de: { translation: deTranslations },
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });
```

### Usage Pattern

```typescript
// Component translation
const { t } = useTranslation();

return (
  <h1>{t('welcome.title')}</h1>
  <p>{t('welcome.description', { name: user.name })}</p>
);
```

## 📱 Responsive Design Strategy

### Breakpoint System (Tailwind CSS)

```typescript
// Mobile-first responsive design
const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices
  lg: '1024px',  // Large devices
  xl: '1280px',  // Extra large devices
  '2xl': '1536px' // 2X large devices
};
```

### Component Responsiveness

```typescript
// Responsive component pattern
const ResponsiveGrid = ({ children }: GridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
};
```

## 🧪 Testing Architecture

### Testing Strategy

1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Complete user flows (future)

### Testing Structure

```
tests/
├── components/     # Component tests
├── hooks/          # Custom hook tests
├── services/       # API service tests
├── utils/          # Utility function tests
└── __mocks__/      # Mock implementations
```

### Testing Patterns

```typescript
// Component testing pattern
describe('ArticleCard', () => {
  const mockArticle = {
    id: '1',
    title: 'Test Article',
    // ... other properties
  };

  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });
});
```

## 🔄 State Management Flow

```
User Action → Component → Custom Hook → Service → API
     ↓                                               ↓
Context Update ← React Query Cache ← API Response ←
```

This architecture ensures:
- **Separation of Concerns**: Each layer has a specific responsibility
- **Testability**: Components and logic are easily testable
- **Maintainability**: Code is organized and easy to understand
- **Scalability**: New features can be added without major refactoring
- **Performance**: Optimized for fast loading and smooth interactions
