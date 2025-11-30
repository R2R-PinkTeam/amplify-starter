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
      <header className="header">
        <nav className="nav-menuzord navbar-sticky">
          <div className="container clearfix">
            <div id="menuzord" className="menuzord menuzord-responsive">
              <Link to="/dashboard" className="menuzord-brand">
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FF6B9D' }}>
                  🍬 GumWall
                </h1>
              </Link>
              <div className="float-right btn-wrapper">
                <button
                  onClick={signOut}
                  className="btn btn-outline-primary"
                  style={{ cursor: 'pointer' }}
                >
                  Sign Out
                </button>
              </div>
              <ul className="menuzord-menu menuzord-right">
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="active">
                  <Link to="/my-designs">My Designs</Link>
                </li>
                <li>
                  <span className="text-muted">{user?.signInDetails?.loginId}</span>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* MY DESIGNS CONTENT */}
      <section className="pt-md-10 sec-pb-70 pb-6 bg-light">
        <div className="container">
          {/* Page Header with Upload */}
          <div className="section-title pt-md-8">
            <style>{`
              @media (max-width: 768px) {
                .page-header-content {
                  flex-direction: column !important;
                  align-items: flex-start !important;
                  gap: 16px !important;
                }

                .page-header-content > div {
                  width: 100%;
                }

                .page-header-content h2 {
                  font-size: 1.75rem !important;
                }
              }
            `}</style>
            <div className="page-header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h2>My Designs</h2>
                <p>View and manage your gum wall art collection</p>
              </div>
              <div>
                <FileUpload onUploadComplete={handleUploadComplete} category="uploads" />
              </div>
            </div>
          </div>

          {/* Design Gallery */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card bg-white">
                <div className="card-body">
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
