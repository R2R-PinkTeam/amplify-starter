import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    // Initialize menuzord if available
    if (window.jQuery && (window as any).jQuery("#menuzord").menuzord) {
      (window as any).jQuery("#menuzord").menuzord();
    }
  }, []);

  return (
    <div className="main-wrapper">
      {/* HEADER */}
      <header className="header">
        <nav className="nav-menuzord navbar-sticky">
          <div className="container clearfix">
            <div id="menuzord" className="menuzord menuzord-responsive">
              <Link to="/" className="menuzord-brand">
                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    margin: 0,
                    color: "#FF6B9D",
                  }}
                >
                  🍬 GumWall
                </h1>
              </Link>
              <div className="float-right btn-wrapper">
                <Link className="btn btn-outline-primary" to="/login">
                  Login / Sign Up
                </Link>
              </div>
              <ul className="menuzord-menu menuzord-right">
                <li className="active">
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section
        className="py-7 py-md-10 bg-light"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1
                className="text-white mb-4"
                style={{ fontSize: "3.5rem", fontWeight: 800 }}
              >
                Create Your Digital Gum Wall
              </h1>
              <p
                className="text-white mb-5"
                style={{ fontSize: "1.3rem", opacity: 0.95 }}
              >
                Design, plan, and generate unique gum wall art with AI. Share
                your colorful creations with the world.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR GUM WALLS SHOWCASE */}
      <section className="bg-light py-7 py-md-10">
        <div className="container">
          <div className="section-title">
            <h2>Featured Gum Walls</h2>
            <p>Explore amazing gum wall designs from our community</p>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/populer-city/populer-city-1.jpg"
                    src="/assets/img/populer-city/populer-city-1.jpg"
                    alt="Colorful Burst"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Colorful Burst</h3>
                    <p className="text-white">256 pieces</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-8">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/populer-city/populer-city-2.jpg"
                    src="/assets/img/populer-city/populer-city-2.jpg"
                    alt="Rainbow Dreams"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Rainbow Dreams</h3>
                    <p className="text-white">512 pieces</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-8">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/populer-city/populer-city-3.jpg"
                    src="/assets/img/populer-city/populer-city-3.jpg"
                    alt="Sunset Vibes"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Sunset Vibes</h3>
                    <p className="text-white">384 pieces</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/populer-city/populer-city-6.jpg"
                    src="/assets/img/populer-city/populer-city-6.jpg"
                    alt="Neon Nights"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Neon Nights</h3>
                    <p className="text-white">192 pieces</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="text-center pt-5">
            <Link to="/login" className="btn btn-outline-primary">
              View All Designs
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="pt-md-10 sec-pb-70 pb-6 bg-white">
        <div className="container">
          <div className="section-title pt-md-8">
            <h2>Why Choose GumWall?</h2>
            <p>Create stunning gum wall designs with our powerful tools</p>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <div className="card bg-transparent">
                <div className="card-body">
                  <div className="icon-md">
                    <i
                      className="fas fa-palette"
                      style={{ fontSize: "3rem", color: "#FF6B9D" }}
                    ></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">Design Tools</h3>
                  <p className="text-muted">
                    Intuitive design interface to create your perfect gum wall
                    pattern with drag-and-drop simplicity
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card bg-transparent">
                <div className="card-body">
                  <div className="icon-md">
                    <i
                      className="fas fa-robot"
                      style={{ fontSize: "3rem", color: "#FF6B9D" }}
                    ></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">AI Generation</h3>
                  <p className="text-muted">
                    Generate unique gum wall images using advanced AI technology
                    powered by AWS
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card bg-transparent">
                <div className="card-body">
                  <div className="icon-md">
                    <i
                      className="fas fa-save"
                      style={{ fontSize: "3rem", color: "#FF6B9D" }}
                    ></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">Plan & Save</h3>
                  <p className="text-muted">
                    Save your designs and plans for future reference with cloud
                    storage
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card bg-transparent">
                <div className="card-body">
                  <div className="icon-md">
                    <i
                      className="fas fa-fill-drip"
                      style={{ fontSize: "3rem", color: "#FF6B9D" }}
                    ></i>
                  </div>
                  <h3 className="h5 fw-normal mb-3">Color Palette</h3>
                  <p className="text-muted">
                    Choose from thousands of vibrant colors and combinations for
                    your masterpiece
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        className="py-7 py-md-10"
        style={{
          background: "linear-gradient(135deg, #FF6B9D, #C44569)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2 className="text-white mb-4" style={{ fontSize: "2.5rem" }}>
            Ready to Create Your Masterpiece?
          </h2>
          <p
            className="text-white mb-5"
            style={{ fontSize: "1.2rem", opacity: 0.95 }}
          >
            Join thousands of artists creating amazing gum wall designs
          </p>
          <Link to="/signup" className="btn btn-light btn-lg">
            Start Creating Now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="footer-dark"
        style={{
          backgroundImage: "url(/assets/img/background/bg-footer.jpg)",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-7 col-xs-12">
              <h3
                className="mb-4"
                style={{
                  color: "#FF6B9D",
                  fontSize: "2rem",
                  fontWeight: 800,
                }}
              >
                🍬 GumWall
              </h3>
              <p className="text-white pt-1 pb-3">
                Create, design, and share your digital gum wall art. Powered by
                AWS Amplify and AI technology.
              </p>
              <ul className="list-unstyled text-white">
                <li className="mb-3">
                  <i className="fas fa-envelope me-3" aria-hidden="true"></i>
                  <a className="text-white" href="mailto:info@gumwall.com">
                    info@gumwall.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-sm-3 col-xs-12">
              <div className="mb-4 mt-4 mt-md-0">
                <h2 className="h4 text-white">Quick Links</h2>
              </div>
              <ul className="list-unstyled list-gray">
                <li className="mb-3">
                  <Link to="/">Home</Link>
                </li>
                <li className="mb-3">
                  <Link to="/signup">Sign Up</Link>
                </li>
                <li className="mb-3">
                  <Link to="/login">Login</Link>
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
