
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const level = this.props.level || 'component';
      
      return (
        <div className={`
          flex items-center justify-center flex-col p-6 
          ${level === 'page' ? 'min-h-screen bg-pairup-darkBlue' : ''}
          ${level === 'section' ? 'min-h-[200px] rounded-lg border border-border bg-card' : ''}
          ${level === 'component' ? 'min-h-[100px] rounded-md border border-border/50 bg-muted/50' : ''}
        `}>
          <AlertTriangle className={`
            text-destructive mb-4
            ${level === 'page' ? 'h-12 w-12' : ''}
            ${level === 'section' ? 'h-8 w-8' : ''}
            ${level === 'component' ? 'h-6 w-6' : ''}
          `} />
          <h3 className={`
            font-semibold text-foreground mb-2
            ${level === 'page' ? 'text-2xl' : ''}
            ${level === 'section' ? 'text-lg' : ''}
            ${level === 'component' ? 'text-base' : ''}
          `}>
            Something went wrong
          </h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            {level === 'page' && 'We encountered an unexpected error. Please try refreshing the page.'}
            {level === 'section' && 'This section failed to load properly.'}
            {level === 'component' && 'This component encountered an error.'}
          </p>
          <Button
            variant="outline"
            size={level === 'component' ? 'sm' : 'md'}
            onClick={this.handleRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
