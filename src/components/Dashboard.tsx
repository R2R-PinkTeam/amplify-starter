import { useAuthenticator } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    // Initialize menuzord if available
    if (window.jQuery && (window as any).jQuery('#menuzord').menuzord) {
      (window as any).jQuery('#menuzord').menuzord();
    }
  }, []);

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
                <li className="active">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <span className="text-muted">{user?.signInDetails?.loginId}</span>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* DASHBOARD CONTENT */}
      <section className="pt-md-10 sec-pb-70 pb-6 bg-light">
        <div className="container">
          <div className="section-title pt-md-8">
            <h2>Welcome to Your Gum Wall Studio</h2>
            <p>Create, design, and generate amazing gum wall art</p>
          </div>

          <div className="row">
            {/* Create New Design */}
            <div className="col-md-6 col-lg-3">
              <div className="card bg-white">
                <div className="card-body text-center">
                  <div className="icon-md mb-4">
                    <i className="fas fa-palette" style={{ fontSize: '3rem', color: '#FF6B9D' }}></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">Create New Design</h3>
                  <p className="text-muted mb-4">
                    Start a new gum wall design from scratch
                  </p>
                  <button className="btn btn-primary w-100">Start Creating</button>
                </div>
              </div>
            </div>

            {/* Generate with AI */}
            <div className="col-md-6 col-lg-3">
              <div className="card bg-white">
                <div className="card-body text-center">
                  <div className="icon-md mb-4">
                    <i className="fas fa-robot" style={{ fontSize: '3rem', color: '#FF6B9D' }}></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">AI Generator</h3>
                  <p className="text-muted mb-4">
                    Generate unique gum wall images using AI
                  </p>
                  <button className="btn btn-primary w-100">Generate</button>
                </div>
              </div>
            </div>

            {/* My Designs */}
            <div className="col-md-6 col-lg-3">
              <div className="card bg-white">
                <div className="card-body text-center">
                  <div className="icon-md mb-4">
                    <i className="fas fa-folder-open" style={{ fontSize: '3rem', color: '#FF6B9D' }}></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">My Designs</h3>
                  <p className="text-muted mb-4">
                    View and manage your saved designs
                  </p>
                  <button className="btn btn-primary w-100">View All</button>
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="col-md-6 col-lg-3">
              <div className="card bg-white">
                <div className="card-body text-center">
                  <div className="icon-md mb-4">
                    <i className="fas fa-fill-drip" style={{ fontSize: '3rem', color: '#FF6B9D' }}></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">Color Palettes</h3>
                  <p className="text-muted mb-4">
                    Browse and create custom color palettes
                  </p>
                  <button className="btn btn-primary w-100">Explore</button>
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
