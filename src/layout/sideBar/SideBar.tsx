// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// const SideBar: React.FC = () => {
//   const [open, setOpen] = useState(false);

//   const toggleMenu = () => {
//     setOpen(!open);
//   };
//   const navigate = useNavigate();

//   const handleLogout = () => {
//       navigate('/auth/login');
//     console.log("User logged out");
//   };

//   return (
//     <div className="border-end d-flex flex-column" style={{ width: '20%', height: '100vh' }}>
//       <h5 className="p-3">RightPayment</h5>
//       <ul className="list-unstyled flex-grow-1">
//       <li className="mb-2" style={{ marginLeft: '30px', fontWeight: '500', marginBottom: '60px' }}>
//           <a href="/dashboard" className="text-decoration-none text-dark d-block w-100">Dashboard</a>
//       </li>
//         <li className="mb-2">
//           <button
//             className="btn btn-link text-start text-decoration-none w-100 text-left"
//             onClick={toggleMenu}
//             aria-expanded={open ? "true" : "false"}
//             style={{ color: 'inherit', marginLeft: '30px' }}
//           >
//             Abonnements <span className={`caret ${open ? 'caret-down' : 'caret-right'}`}></span>
//           </button>
//           <div className={`collapse ${open ? 'show' : ''}`}>
//             <ul className="list-unstyled ms-3">
//                 <li className="mb-2" style={{ marginLeft: '30px' }}>
//                 <Link to="/add-new" className="text-decoration-none text-dark d-block">
//                   Add New
//                 </Link>
//               </li>
//               <li className="mb-2" style={{ marginLeft: '30px' }}>
//                 <a href="/list" className="text-decoration-none text-dark d-block">List</a>
//               </li>
//             </ul>
//           </div>
//         </li>
//         <li className="mb-2" style={{ marginLeft: '30px', fontWeight: '500', marginBottom: '20px' }}>
//           <a href="/factures" className="text-decoration-none text-dark d-block w-100">Factures</a>
//         </li>
//         <li className="mb-2" style={{ marginLeft: '30px', fontWeight: '500' }}>
//           <a href="/notifications" className="text-decoration-none text-dark d-block w-100">Notifications</a>
//         </li>
//         <li className="mb-2" style={{ marginLeft: '30px', fontWeight: '500' }}>
//           <a href="/settings" className="text-decoration-none text-dark d-block w-100">Settings</a>
//         </li>
//         <li className="mb-2" style={{ marginLeft: '30px', fontWeight: '500', marginTop:'490px', display: 'flex', justifyContent: 'center' }}>
//           <a href="" className="text-decoration-none text-dark d-block w-100" onClick={handleLogout}>Logout</a>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default SideBar;

import React from 'react'
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { PiNewspaperClippingBold } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import SideBarMenu from './SideBarMenu';


const SideBar = () => {
  const Menus =[
    {
      Icon: MdOutlineSpaceDashboard,
      MainTitle: "Dashboard",
      Path: "/dashboard",
      SubTitles: []
    },
    {
      Icon: MdPayments ,
      MainTitle: "Subscriptions",
      SubTitles: [{Title: "Add New", path: "/add-new"}, {Title: "List of subscriptions", path: "/list"}] ,
    
    },
    {
      Icon: PiNewspaperClippingBold ,
      MainTitle: "Factures",
      Path: "/factures",
      SubTitles: []
    },
    {
      Icon: IoMdNotificationsOutline ,
      MainTitle: "Notifications",
      Path: "/notifications",
      SubTitles: []
    },
    {
      Icon: IoSettingsOutline ,
      MainTitle: "Settings",
      Path: "/settings",    
      SubTitles: []   
    }
  ]

  const [dropDownMenu, setDropDownMenu] = React.useState<string[]>([]);
  console.log(dropDownMenu)
 
  return (
    <div className=' h-100 d-flex  p-4 '>
        <div style={{gap:'15px'}} className='d-flex flex-column h-100' >
          {Menus.map((menu, idx)=>(
            <div className='d-flex' key={idx}>
              <SideBarMenu  Icon={menu.Icon} MainTitle={menu.MainTitle} SubTitles={menu.SubTitles} Path={menu.Path} dropDownMenu={dropDownMenu} setDropDownMenu={setDropDownMenu}/>
              
            </div>
          ))}
        </div>
    </div>
  )
}

export default SideBar
