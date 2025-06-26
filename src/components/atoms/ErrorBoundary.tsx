
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';
import { tokens } from '@/lib/tokens';

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
          ${tokens.layout.flexCenter} flex-col ${tokens.spacing.md} 
          ${level === 'page' ? `min-h-screen ${tokens.bg.dark}` : ''}
          ${level === 'section' ? `min-h-[200px] ${tokens.radius.lg} border border-border bg-card` : ''}
          ${level === 'component' ? `min-h-[100px] ${tokens.radius.md} border border-border/50 bg-muted/50` : ''}
        `}>
          <AlertTriangle className={`
            text-destructive ${tokens.gap.lg}
            ${level === 'page' ? tokens.size.xl : ''}
            ${level === 'section' ? tokens.size.lg : ''}
            ${level === 'component' ? tokens.size.md : ''}
          `} />
          <h3 className={`
            font-semibold text-foreground ${tokens.gap.sm}
            ${level === 'page' ? tokens.text.xxl : ''}
            ${level === 'section' ? tokens.text.lg : ''}
            ${level === 'component' ? tokens.text.md : ''}
          `}>
            Something went wrong
          </h3>
          <p className={`text-muted-foreground text-center ${tokens.gap.lg} max-w-md`}>
            {level === 'page' && 'We encountered an unexpected error. Please try refreshing the page.'}
            {level === 'section' && 'This section failed to load properly.'}
            {level === 'component' && 'This component encountered an error.'}
          </p>
          <Button
            variant="outline"
            size={level === 'component' ? 'sm' : 'md'}
            onClick={this.handleRetry}
            className={tokens.gap.sm}
          >
            <RefreshCw className={tokens.size.sm} />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
