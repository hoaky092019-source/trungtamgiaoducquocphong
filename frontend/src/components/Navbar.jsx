// src/components/Navbar.jsx
import { useState } from "react";
import '../css/Navbar.css';

export default function Navbar({ fullName = "", isLoggedIn = false }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav className="navbar main-navbar navbar-expand-lg navbar-light">
      <div className="container">
        {/* left toggle (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* center brand (position absolute in css) */}
        <a className="navbar-brand" href="/">
          TRƯỜNG QUÂN SỰ
        </a>
        {/* menu center */}
        <div
          className={`collapse navbar-collapse ${expanded ? "show" : ""}`}
          id="mainNavbar"
        >
          <ul className="navbar-nav navbar-nav-center">
            <li className="nav-item">
              <a className="nav-link home-icon" href="/">
                <i className="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/gioi-thieu">
                GIỚI THIỆU
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tin-tuc">
                TIN TỨC
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tuyen-truyen">
                TUYÊN TRUYỀN
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tu-lieu">
                TƯ LIỆU
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tro-giup">
                TRỢ GIÚP
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/test">
                TEST
              </a>
            </li>
          </ul>

          {/* auth area on right */}
          <div className="auth-area d-flex ms-auto">
            {isLoggedIn ? (
              <div className="dropdown">
                <a
                  className="btn btn-outline-success fw-bold dropdown-toggle"
                  href="/"
                  role="button"
                  id="userMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {fullName}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userMenu"
                >
                  <li>
                    <a className="dropdown-item" href="/logout">
                      Đăng xuất
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <a className="btn btn-outline-primary fw-bold px-3" href="/login">
                Đăng nhập
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
