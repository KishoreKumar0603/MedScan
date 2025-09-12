import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          MedScan
        </Link>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav align-items-center">
            {/* API Dropdown */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="apiDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                API
              </Link>
              <ul className="dropdown-menu" aria-labelledby="apiDropdown">
                <li>
                  <Link className="dropdown-item" to="/rest-api">
                    REST API
                  </Link>
                </li>
              </ul>
            </li>

            {/* Docs Dropdown */}
            <li className="nav-item dropdown ms-3">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="docsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Docs
              </Link>
              <ul className="dropdown-menu" aria-labelledby="docsDropdown">
                <li>
                  <Link className="dropdown-item" to="/api-docs">
                    API Docs
                  </Link>
                </li>
              </ul>
            </li>

            {/* About Page */}
            <li className="nav-item ms-3">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
