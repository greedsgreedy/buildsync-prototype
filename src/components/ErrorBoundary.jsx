import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unexpected error' };
  }

  componentDidCatch(error, info) {
    try {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'client_error',
          message: error?.message || 'Unknown error',
          stack: error?.stack || '',
          componentStack: info?.componentStack || '',
          path: typeof window !== 'undefined' ? window.location.pathname : '',
          ts: new Date().toISOString(),
        }),
      });
    } catch {
      // no-op
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ padding: 24 }}>
        <div className="card">
          <div className="card-title">Something went wrong</div>
          <div className="estimate-note">
            The app hit an error and safely recovered. Please refresh the page.
          </div>
          <div className="subtle-text" style={{ marginTop: 8 }}>
            {this.state.message}
          </div>
        </div>
      </div>
    );
  }
}

