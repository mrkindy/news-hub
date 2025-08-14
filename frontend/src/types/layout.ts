import { ReactNode } from 'react';

// Layout Types
export interface LayoutProps {
  children: ReactNode;
}

// Error Boundary Types
export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

// Context Provider Types
export interface NewsProviderProps {
  children: ReactNode;
}

export interface AuthProviderProps {
  children: ReactNode;
}
