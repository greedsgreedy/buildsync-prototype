import '../styles/globals.css';
import { useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_view',
        path: window.location.pathname,
        ts: new Date().toISOString(),
      }),
    }).catch(() => {});
  }, []);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
