import { useAuthenticator } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, signOut } = useAuthenticator();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Initialize menuzord if available
    if (window.jQuery && (window as any).jQuery('#menuzord').menuzord) {
      (window as any).jQuery('#menuzord').menuzord();
    }
  }, []);

  return (
    <div className="main-wrapper">
      {/* HEADER */}
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
                🍬 GumWall
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
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            // Navigate to profile
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
                            // Navigate to settings
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

      {/* DASHBOARD CONTENT */}
      <section className="pt-md-10 sec-pb-70 pb-6 bg-light">
        <div className="container">
          <div className="section-title pt-md-8">
            <h2>Welcome to Your Gum Wall Studio</h2>
            <p>Create, design, and generate amazing gum wall art</p>
          </div>

          <div className="row justify-content-center">
            {/* Create New Design */}
            <div className="col-md-6 col-lg-4">
              <div className="card bg-white h-100">
                <div className="card-body text-center d-flex flex-column">
                  <div className="icon-md mb-4">
                    <i className="fas fa-palette" style={{ fontSize: '3rem', color: '#FF6B9D' }}></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">Create New Design</h3>
                  <p className="text-muted mb-4 flex-grow-1">
                    Start a new gum wall design from scratch
                  </p>
                  <button className="btn btn-primary w-100">Start Creating</button>
                </div>
              </div>
            </div>

            {/* Generate with AI */}
            <div className="col-md-6 col-lg-4">
              <div className="card bg-white h-100">
                <div className="card-body text-center d-flex flex-column">
                  <div className="icon-md mb-4">
                    <i className="fas fa-robot" style={{ fontSize: '3rem', color: '#FF6B9D' }}></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">AI Generator</h3>
                  <p className="text-muted mb-4 flex-grow-1">
                    Generate unique gum wall images using AI
                  </p>
                  <button className="btn btn-primary w-100">Generate</button>
                </div>
              </div>
            </div>

            {/* My Designs */}
            <div className="col-md-6 col-lg-4">
              <div className="card bg-white h-100">
                <div className="card-body text-center d-flex flex-column">
                  <div className="icon-md mb-4">
                    <i className="fas fa-folder-open" style={{ fontSize: '3rem', color: '#FF6B9D' }}></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">My Designs</h3>
                  <p className="text-muted mb-4 flex-grow-1">
                    View and manage your saved designs
                  </p>
                  <Link to="/my-designs" className="btn btn-primary w-100">View All</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card bg-white">
                <div className="card-body">
                  <h3 className="h4 mb-4">Recent Activity</h3>
                  <div className="d-flex align-items-center p-3 bg-light rounded mb-3">
                    <div className="me-3" style={{ fontSize: '2rem' }}>🎨</div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">Welcome to GumWall!</h5>
                      <p className="mb-0 text-muted">Get started by creating your first design</p>
                    </div>
                    <div className="text-muted">Just now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-dark" style={{ backgroundImage: 'url(/assets/img/background/bg-footer.jpg)' }}>
        <div className="container">
          <div className="row">
            <div className="col-sm-7 col-xs-12">
              <h3 className="mb-4" style={{ color: '#FF6B9D', fontSize: '2rem', fontWeight: 800 }}>
                🍬 GumWall
              </h3>
              <p className="text-white pt-1 pb-3">
                Create, design, and share your digital gum wall art. Powered by AWS Amplify and AI technology.
              </p>
            </div>

            <div className="col-sm-3 col-xs-12">
              <div className="mb-4 mt-4 mt-md-0">
                <h2 className="h4 text-white">Quick Links</h2>
              </div>
              <ul className="list-unstyled list-gray">
                <li className="mb-3">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="mb-3">
                  <button onClick={signOut} className="btn btn-link p-0 text-start" style={{ color: '#999' }}>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-sm-12 text-center">
              <p className="copy-right mb-0 pb-4 pb-md-0">
                Copyright &copy; 2025. All Rights Reserved by GumWall
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
