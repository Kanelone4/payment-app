import React, { useState } from 'react';
import SideBar from './sideBar/SideBar';
import Header from './header/header';
import './layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='d-flex flex-column h-100 w-100'>
      <div className='z-8 position-sticky top-0'>
        <Header toggleSidebar={toggleSidebar} />
      </div>
      <div style={{ backgroundColor: '#f0f4f6', height: '2px' }}></div>
      <div className="d-flex h-100" style={{ overflow: 'hidden' }}>
        <div
          className={`overlay ${isSidebarOpen ? 'open' : ''}`}
          onClick={toggleSidebar}
        ></div>
        <div
          style={{ width: '250px' }}
          className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
        >
          <SideBar />
        </div>
        <div style={{ backgroundColor: '#f0f4f6', overflow: 'auto' }} className='h-100 w-100 flex-column d-flex'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;








