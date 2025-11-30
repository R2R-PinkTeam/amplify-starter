import { useAuthenticator } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import DesignGallery from './DesignGallery';

export default function MyDesigns() {
  const { user, signOut } = useAuthenticator();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Initialize menuzord if available
    if (window.jQuery && (window as any).jQuery('#menuzord').menuzord) {
      (window as any).jQuery('#menuzord').menuzord();
    }
  }, []);

  const handleUploadComplete = () => {
    // Trigger gallery refresh by updating trigger
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRefresh = () => {
    // Scroll to top where upload button is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                  color: '#6b7280',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                DASHBOARD
              </Link>
              <Link
                to="/my-designs"
                style={{
                  color: '#FF6B9D',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                MY DESIGNS
              </Link>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={signOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'transparent',
                    border: '2px solid #FF6B9D',
                    color: '#FF6B9D',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#FF6B9D';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#FF6B9D';
                  }}
                >
                  SIGN OUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MY DESIGNS CONTENT */}
      <section className="pt-md-10 sec-pb-70 pb-6 bg-light">
        <div className="container">
          {/* Page Header with Upload */}
          <div className="section-title pt-md-8" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
              My Designs
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              View and manage your gum wall art collection
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FileUpload onUploadComplete={handleUploadComplete} category="uploads" />
            </div>
          </div>

          {/* Design Gallery */}
          <div className="row">
            <div className="col-12">
              <div className="card bg-white" style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div className="card-body" style={{ padding: '2rem' }}>
                  <DesignGallery filterByCategory="all" onRefresh={handleRefresh} refreshTrigger={refreshTrigger} />
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
                  <Link to="/my-designs">My Designs</Link>
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
