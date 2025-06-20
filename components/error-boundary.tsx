'use client';

import { Component, ReactNode } from 'react';
import { logger } from '@/app/lib/logger-client';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen flex items-center justify-center p-4'>
          <div className='max-w-md w-full bg-background border rounded-lg p-6 space-y-4'>
            <div className='flex items-center space-x-2 text-destructive'>
              <AlertCircle className='h-6 w-6' />
              <h2 className='text-lg font-semibold'>Something went wrong</h2>
            </div>

            <p className='text-sm text-muted-foreground'>
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-4'>
                <summary className='cursor-pointer text-sm font-medium'>Error details</summary>
                <pre className='mt-2 text-xs bg-muted p-2 rounded overflow-auto'>
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <Button onClick={this.handleReset} className='w-full'>
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
