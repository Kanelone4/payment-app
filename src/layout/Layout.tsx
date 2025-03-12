import React from 'react';
import SideBar from './sideBar/SideBar';
import Header from './header/header';

const Layout = ({children} : any) => {
  return (
    <div className='d-flex flex-column h-100'>
      <div className='z-8 position-sticky top-20'>
        <Header />
      </div>
      <div style={{backgroundColor:'#f8f8f8', height:'2px'}}>

      </div>
    <div  className="d-flex w-100">
      <div style={{width:'15%'}} className='z-8 position-sticky top-20 '>
      <SideBar />
      </div>
     <div style={{backgroundColor:'#f8f8f8'}} className=''>
     {children} 
     </div>
    </div>
     </div>
    
   
  );
};

export default Layout;
