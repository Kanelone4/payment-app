import React from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoApps } from "react-icons/io5";

const Header: React.FC = () => {
  return (
   
    <div style={{padding:'10px',paddingTop:'15px'}} className='d-flex justify-content-between align-items-center px-4 w-100 '>
      <h4 style={{color:'#50cd89'}}>Right<span style={{color:'#0089e1'}}>Payment</span></h4>
      <div style={{gap:'20px'}} className='d-flex '>
        <span style={{gap:'5px'}} className='d-flex'>
          <img style={{width:'15px', height:'15px'}} src="/public/assets/Images/UsaFlag.webp" alt="" />
          <p>English</p>
          <MdKeyboardArrowDown />
        </span>
        
          <span>
          <CgProfile fontSize={20} color='#50cd89' />
          </span>

          <span>
         < IoApps  fontSize={20} color='#0089e1'/>
          </span>
      
      </div>
      </div>
    // <nav className="navbar navbar-expand navbar-light">
    //   <div className="container-fluid">
    //     <div className="collapse navbar-collapse justify-content-end">
    //       <ul className="navbar-nav">
    //         <li className="nav-item">
    //           <a className="nav-link" href="#">Lang</a>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link" href="#">XP acc</a>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link" href="#">App launcher</a>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </nav>
  );
};

export default Header;
