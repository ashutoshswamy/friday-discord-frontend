import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0f0f17', color: '#e2e8f0', fontFamily: 'Poppins, sans-serif',
          gap: '16px', padding: '24px', textAlign: 'center',
        }}>
          <img src="/logo.png" alt="Friday" style={{ width: 48, opacity: 0.7 }} />
          <h2 style={{ margin: 0, fontSize: '20px', color: '#ff4d6d' }}>Something went wrong</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b', maxWidth: '400px' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '8px', padding: '10px 24px', borderRadius: '8px',
              background: '#3b9dff', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: '14px', fontWeight: 600,
            }}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
