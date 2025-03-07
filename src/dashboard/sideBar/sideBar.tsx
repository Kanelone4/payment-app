import React, { useState } from 'react';

const SideBar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <div className="bg-light border-end d-flex flex-column" style={{ width: '250px', height: '100vh' }}>
      <h5 className="p-3 ">RightPayment</h5>
      <ul className="list-unstyled">
        <li className="mb-2">
          <button
            className="btn btn-link text-start  text-decoration-none w-100 text-left"
            onClick={toggleMenu}
            aria-expanded={open ? "true" : "false"}
            style={{ color: 'inherit', marginLeft: '30px' }}
          >
            Abonnements <span className={`caret ${open ? 'caret-down' : 'caret-right'}`}></span>
          </button>
          <div className={`collapse ${open ? 'show' : ''}`}>
          <ul className={`list-unstyled ms-3`}>
            <li className="mb-2" style={{marginLeft: '30px'}}>
              <a href="/add-new" className="text-decoration-none text-dark d-block">Add New</a>
            </li>
            <li className="mb-2" style={{marginLeft: '30px'}}>
              <a href="/list" className="text-decoration-none text-dark d-block">List</a>
            </li>
          </ul>
          </div>
        </li>
        <li className="mb-2" style={{marginLeft: '30px', fontWeight:'500', marginBottom:'20px'}}>
          <a href="/factures" className="text-decoration-none text-dark d-block w-100 ">Factures</a>
        </li>
        <li className="mb-2" style={{marginLeft: '30px', fontWeight:'500'}}>
          <a href="/notifications" className="text-decoration-none text-dark d-block w-100">Notifications</a>
        </li>
        <li className="mb-2" style={{marginLeft: '30px', fontWeight:'500', }}>
          <a href="/settings" className="text-decoration-none text-dark d-block w-100">Settings</a>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
