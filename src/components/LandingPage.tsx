import { Link } from "react-router-dom";
import Header from "./Header";

export default function LandingPage() {
  return (
    <div className="main-wrapper">
      <Header isAuthenticated={false} />

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
                Create Your Digital Chew Wall
              </h1>
              <p
                className="text-white mb-5"
                style={{ fontSize: "1.3rem", opacity: 0.95 }}
              >
                Design, plan, and generate unique chew wall art with AI. Share
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

      {/* POPULAR CHEW WALLS SHOWCASE */}
      <section className="bg-light py-7 py-md-10">
        <div className="container">
          <div className="section-title">
            <h2>Featured Chew Walls</h2>
            <p>Explore amazing chew wall designs from our community</p>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/generated/kiro.png"
                    src="/assets/img/generated/kiro.png"
                    alt="Kiro Wall"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Kiro Wall</h3>
                    <p className="text-white">AI Generated</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-8">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/generated/jeff-barr-wall.png"
                    src="/assets/img/generated/jeff-barr-wall.png"
                    alt="Jeff Barr Wall"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Jeff Barr Wall</h3>
                    <p className="text-white">AI Generated</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-8">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/generated/swami-wall.png"
                    src="/assets/img/generated/swami-wall.png"
                    alt="Swami Wall"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Swami Wall</h3>
                    <p className="text-white">AI Generated</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/generated/aws.png"
                    src="/assets/img/generated/aws.png"
                    alt="AWS Wall"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">AWS Wall</h3>
                    <p className="text-white">AI Generated</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/generated/venetian-jeff.png"
                    src="/assets/img/generated/venetian-jeff.png"
                    alt="Venetian Jeff"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Venetian Jeff</h3>
                    <p className="text-white">AI Generated</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/generated/swami-expo.png"
                    src="/assets/img/generated/swami-expo.png"
                    alt="Swami Expo"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Swami Expo</h3>
                    <p className="text-white">AI Generated</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/generated/jeff-s3-gum.png"
                    src="/assets/img/generated/jeff-s3-gum.png"
                    alt="Jeff S3 Gum"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">Jeff S3 Gum</h3>
                    <p className="text-white">AI Generated</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="card border-0 card-hoverable-scale">
                <a href="#" className="card-img">
                  <img
                    className="card-img-top lazyestload"
                    data-src="/assets/img/generated/acb.png"
                    src="/assets/img/generated/acb.png"
                    alt="ACB Wall"
                  />
                  <div className="card-img-overlay">
                    <h3 className="text-white">ACB Wall</h3>
                    <p className="text-white">AI Generated</p>
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
            <h2>Why Choose ChewView?</h2>
            <p>Create stunning chew wall designs with our powerful tools</p>
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
                    Intuitive design interface to create your perfect chew wall
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
                    Generate unique chew wall images using advanced AI technology
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
            Join thousands of artists creating amazing chew wall designs
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
                🍬 ChewView
              </h3>
              <p className="text-white pt-1 pb-3">
                Create, design, and share your digital chew wall art. Powered by
                AWS Amplify and AI technology.
              </p>
              <ul className="list-unstyled text-white">
                <li className="mb-3">
                  <i className="fas fa-envelope me-3" aria-hidden="true"></i>
                  <a className="text-white" href="mailto:info@chewview.com">
                    info@chewview.com
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
                Copyright &copy; 2025. All Rights Reserved by ChewView
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
