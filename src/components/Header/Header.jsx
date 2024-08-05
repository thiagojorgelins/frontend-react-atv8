import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(!!token);
    setUserRole(user?.role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const toggleNavbar = () => {
    setIsActive(!isActive);
  };

  return (
    <header style={headerStyle}>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <button
            className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded={isActive ? "true" : "false"}
            data-target="navbarBasicExample"
            onClick={toggleNavbar}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div
          id="navbarBasicExample"
          className={`navbar-menu ${isActive ? "is-active" : ""}`}
        >
          <div className="navbar-start">
            <Link className="navbar-item has-text-white" to="/products">
              Produtos
            </Link>
            {userRole === "ADMIN" && (
              <Link className="navbar-item has-text-white" to="/users">
                Usuários
              </Link>
            )}
            <Link className="navbar-item has-text-white" to="/about">
              Sobre
            </Link>
          </div>

          <div className="navbar-end">
            {isLoggedIn ? (
              <div className="navbar-item">
                <div className="buttons is-justify-content-center">
                  <button className="button is-light" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="navbar-item">
                <div className="buttons">
                  <Link className="button is-primary" to="/">
                    <strong>Logar</strong>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

const headerStyle = {
  backgroundColor: "#282c34",
  color: "white",
  padding: "1em",
  textAlign: "center",
};

export default Header;
