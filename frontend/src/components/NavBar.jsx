import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../auth";

const navClass = ({ isActive }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/index" className="brand">
          <span className="brand__mark">A</span>
          <span className="brand__text">airbnb</span>
        </NavLink>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? "nav--open" : ""}`}>
          <div className="nav__group">
            <NavLink to="/index" className={navClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/homes" className={navClass} onClick={() => setOpen(false)}>
              Homes
            </NavLink>
            {isLoggedIn && user?.userType === "guest" ? (
              <>
                <NavLink
                  to="/favourites"
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  Favourites
                </NavLink>
                <NavLink
                  to="/bookings"
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  Bookings
                </NavLink>
              </>
            ) : null}
            {isLoggedIn && user?.userType === "host" ? (
              <>
                <NavLink
                  to="/host/host-home-list"
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  Host Homes
                </NavLink>
                <NavLink
                  to="/host/add-home"
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  Add Home
                </NavLink>
              </>
            ) : null}
          </div>

          <div className="nav__group nav__group--actions">
            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/signup"
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link--light-active" : "nav-link nav-link--light"
                  }
                  onClick={() => setOpen(false)}
                >
                  Login
                </NavLink>
              </>
            ) : (
              <button type="button" className="nav-link nav-link--button" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
