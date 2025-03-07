import React from 'react';

const Header: React.FC = () => {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      <div className="container-fluid">
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">Lang</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">XP acc</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">App launcher</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
