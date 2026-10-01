import React from 'react';
import ErrorState from './ErrorState';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled application error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4 w-full">
          <ErrorState
            title="Something went wrong"
            message={
              this.state.error?.message ||
              'An unexpected error occurred while rendering. Tap below to reload.'
            }
            onRetry={this.handleRetry}
            actionText="Try Again"
            className="w-full max-w-md my-auto"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
