import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../sideBar/sideBar';
import Header from '../header/header';

const Layout: React.FC = () => {
  return (
    <div className="d-flex">
      <SideBar />
      <div className="flex-grow-1">
        <Header />
        <div className="p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
