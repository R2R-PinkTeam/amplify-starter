import { useAuthenticator } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export default function Header({ isAuthenticated = false }: HeaderProps) {
  if (!isAuthenticated) {
    return <PublicHeader />;
  }
  return <AuthenticatedHeader />;
}

// Public header for non-authenticated users
function PublicHeader() {
  return (
    <header className="header" style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FF6B9D' }}>
              🍬 ChewView
            </h1>
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <Link
              to="/"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              HOME
            </Link>
            <Link
              to="/login"
              className="btn btn-outline-primary"
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '6px'
              }}
            >
              Login / Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// Authenticated header with profile dropdown
function AuthenticatedHeader() {
  const { user, signOut } = useAuthenticator();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="header" style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FF6B9D' }}>
              🍬 ChewView
            </h1>
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <Link
              to="/dashboard"
              style={{
                color: '#FF6B9D',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              DASHBOARD
            </Link>

            <a
              href="/presentations/gum-wall-results.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              DEMO RESULTS
              <i className="fas fa-external-link-alt" style={{ fontSize: '0.75rem' }}></i>
            </a>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}>
                  {user?.signInDetails?.loginId?.charAt(0).toUpperCase() || 'U'}
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                >
                  <path d="M4 6L8 10L12 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999
                    }}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    minWidth: '220px',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}>
                    {/* User Info */}
                    <div style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
                        {user?.signInDetails?.loginId?.split('@')[0] || 'User'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {user?.signInDetails?.loginId}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: '0.5rem 0' }}>
                      <a
                        href="/presentations/gum-wall-results.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <i className="fas fa-chart-bar" style={{ width: '16px', color: '#6b7280' }}></i>
                        Demo Results
                      </a>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          color: '#374151',
                          textAlign: 'left',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <i className="fas fa-user" style={{ width: '16px', color: '#6b7280' }}></i>
                        Profile
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          color: '#374151',
                          textAlign: 'left',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <i className="fas fa-cog" style={{ width: '16px', color: '#6b7280' }}></i>
                        Settings
                      </button>

                      <div style={{ height: '1px', background: '#e5e7eb', margin: '0.5rem 0' }} />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          color: '#dc2626',
                          textAlign: 'left',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#fef2f2';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <i className="fas fa-sign-out-alt" style={{ width: '16px', color: '#dc2626' }}></i>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
