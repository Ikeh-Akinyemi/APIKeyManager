import { useState } from "react";
import "./Navbar.css";
import { LoginModal, SignupModal } from "../Modal/Modals";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="header">
      <nav className="navbar">
        <div className="navbar-logo">APIKeyManager</div>
        <div className="navbar-items">
          {isLoggedIn ? (
            <>
              <a href="/features">Features</a>
              <a href="/about">About</a>
              <button onClick={toggleLogin}>
                {isLoggedIn ? "Logout" : "Login"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowSignupModal(true)}>Signup</button>
              <button
                onClick={(e) => {
                  toggleLogin();
                  const target = e.target as HTMLElement;
                  if (target.innerText === "Login") {
                    setShowLoginModal(true);
                  }
                }}
              >
                {isLoggedIn ? "Logout" : "Login"}
              </button>
            </>
          )}
        </div>
        {showSignupModal && (
          <SignupModal onClose={() => setShowSignupModal(false)} />
        )}
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </nav>
    </div>
  );
};

export default Navbar;
