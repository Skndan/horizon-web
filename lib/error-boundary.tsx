import { ComingSoonPage } from '@/components/common/coming-soon';
import React, { Component } from 'react';


class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }


  static getDerivedStateFromError(error: any) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }


  componentDidCatch(error: any, errorInfo: any) {
    // Log the error to an error reporting service console
    console.error('Error caught by Error Boundary:', error, errorInfo);
  }


  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ComingSoonPage/>;
    }
    return this.props.children;
  }
}


export default ErrorBoundary;