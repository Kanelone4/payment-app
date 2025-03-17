import React from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoApps } from "react-icons/io5";
import '../../layout/header/header.css';

const Header: React.FC = () => {
  return (
    <div style={{ padding: '10px', paddingTop: '15px' }} className='d-flex justify-content-between align-items-center px-4 py-3 w-100'>
      <h4 style={{ color: '#50cd89' }}>Right<span style={{ color: '#0089e1' }}>Payment</span></h4>
      <div style={{ gap: '20px' }} className='d-flex align-items-center'>
        <span style={{ gap: '5px', cursor: 'pointer', paddingLeft: '8px', paddingRight: '8px' }} className='d-flex align-items-center hover-bg hover-text'>
          <img style={{ width: '15px', height: '15px' }} src="/public/assets/Images/UsaFlag.webp" alt="USA Flag" />
          <p className='mt-3'>English</p>
          <MdKeyboardArrowDown />
        </span>
        <div style={{ position: 'relative' }} className='d-flex z-8 align-items-center text-primary hover-bg'>
          <CgProfile fontSize={45} color='#50cd89'  style={{ cursor: 'pointer', padding: '10px' }} />
          
        </div>  
        <span
          style={{ cursor: 'pointer', padding: '10px' }}
          className='d-flex align-items-center hover-bg text-primary'>
          <IoApps fontSize={25}  />
        </span>
      </div>      
    </div>
  );
};

export default Header;