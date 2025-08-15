# Testing Guide

Testing strategies and examples for the News Hub Frontend application.

## Testing Philosophy

Following the **Testing Pyramid** principle:
- **Unit Tests (70%)**: Fast, isolated component and function tests
- **Integration Tests (20%)**: Component interaction tests
- **E2E Tests (10%)**: Complete user journey tests

## Testing Stack

- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom DOM matchers

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test ArticleCard.test.tsx
```

## Component Testing

### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import ArticleCard from './ArticleCard';

const mockArticle = {
  id: '1',
  title: 'Test Article',
  content: 'Test content',
  author: 'Test Author'
};

test('renders article title', () => {
  render(<ArticleCard article={mockArticle} />);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
});
```

### User Interaction Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

test('calls onSearch when user types', async () => {
  const user = userEvent.setup();
  const mockOnSearch = jest.fn();
  
  render(<SearchBar onSearch={mockOnSearch} />);
  
  const input = screen.getByPlaceholderText('Search articles...');
  await user.type(input, 'react');
  
  expect(mockOnSearch).toHaveBeenCalledWith('react');
});
```

## Custom Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useArticles } from './useArticles';

test('should fetch articles', async () => {
  const { result } = renderHook(() => useArticles());
  
  act(() => {
    // Trigger state change
  });
  
  expect(result.current.data).toBeDefined();
});
```

## API Testing

### Mock API Calls
```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/articles', (req, res, ctx) => {
    return res(ctx.json({ articles: [] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Integration Testing

### Testing with Context
```typescript
import { render } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import Component from './Component';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
};

test('component with auth context', () => {
  renderWithProviders(<Component />);
  // Test component behavior
});
```

## Test Organization

```
src/
├── components/
│   ├── Component/
│   │   ├── Component.tsx
│   │   └── Component.test.tsx
├── hooks/
│   ├── useHook.ts
│   └── useHook.test.ts
└── __tests__/
    └── integration/
        └── userFlow.test.tsx
```

## Test Utilities

### Custom Render Function
```typescript
// test-utils.tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

export const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};
```

### Mock Factories
```typescript
// test-factories.ts
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});

export const createMockArticle = (overrides = {}) => ({
  id: '1',
  title: 'Mock Article',
  content: 'Mock content',
  author: 'Mock Author',
  ...overrides,
});
```

## Best Practices

- **Test Behavior**: Focus on what the component does, not how
- **Use Semantic Queries**: Prefer getByRole, getByLabelText over getByTestId
- **Clean Tests**: Keep tests simple and focused
- **Mock External Dependencies**: Mock API calls, external libraries
- **Descriptive Test Names**: Use clear, descriptive test descriptions

## Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Example Test Suite

```typescript
describe('ArticleCard', () => {
  const defaultProps = {
    article: createMockArticle(),
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render article information', () => {
    render(<ArticleCard {...defaultProps} />);
    
    expect(screen.getByText(defaultProps.article.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.article.author)).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<ArticleCard {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(defaultProps.onClick).toHaveBeenCalledWith(defaultProps.article.id);
  });
});
```
