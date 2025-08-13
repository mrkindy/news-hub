import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { ErrorFallbackProps } from '../types/layout';

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-4">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left mb-4 p-3 bg-red-50 rounded-lg">
            <summary className="cursor-pointer text-red-800 font-medium">
              Error details (dev only)
            </summary>
            <pre className="text-sm text-red-700 mt-2 whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        )}

        <Button 
          onClick={resetErrorBoundary}
          className="flex items-center space-x-2 mx-auto"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </Button>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback: Fallback = ErrorFallback,
  onError,
}) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={Fallback}
      onError={onError}
      onReset={() => {
        // Optionally clear any application state here
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
