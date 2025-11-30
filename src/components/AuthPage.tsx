import { Link, useNavigate, useLocation } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";

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
                <Link
                  className="btn btn-outline-primary"
                  to={isSignUp ? "/login" : "/signup"}
                >
                  {isSignUp ? "Login" : "+ Sign Up"}
                </Link>
              </div>
              <ul className="menuzord-menu menuzord-right">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li className={!isSignUp ? "active" : ""}>
                  <Link to="/login">Login</Link>
                </li>
                <li className={isSignUp ? "active" : ""}>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* AUTH PAGE */}
      <section className="py-7 py-md-10 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-9 col-xl-7">
              <div className="bg-white p-5 rounded border">
                <h2 className="fw-normal mb-4">
                  {isSignUp ? "Create Your Account" : "Welcome Back"}
                </h2>
                <p className="mb-4">
                  {isSignUp
                    ? "Sign up to start creating amazing gum wall designs. Your account information will be secure and never shared with third parties."
                    : "Log in to access your gum wall studio and continue creating."}
                </p>

                <div className="pt-4">
                  <Authenticator initialState={isSignUp ? "signUp" : "signIn"}>
                    {({ user }) => {
                      if (user) {
                        navigate("/dashboard");
                      }
                      return <></>;
                    }}
                  </Authenticator>
                </div>
              </div>
            </div>
          </div>
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
