interface Subtitle{
    Title : string;
    path:string
}
interface MenuProps {
    Icon : IconType,
    MainTitle: string,
    SubTitles: Subtitle[];
    Path?: string;
    dropDownMenu: string[];
    setDropDownMenu: React.Dispatch<React.SetStateAction<string[]>>
}

import React, {  } from 'react'
import { IconType } from 'react-icons'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom'

const SideBarMenu = ({Icon, MainTitle, SubTitles, Path, dropDownMenu, setDropDownMenu}: MenuProps) => {

  const toggleMenu = () => {
    
    setDropDownMenu(prev => prev.includes(MainTitle) ? prev.filter(item => item !== MainTitle) : [...prev, MainTitle]);
  }
  const isDropDownMenuOpen = dropDownMenu.includes(MainTitle);
  const { pathname} = useLocation();
  return (
    <div className=''>
        <Link  style={{textDecoration:'none', color:'#9194a3'}} to ={Path? Path : ''} onClick={toggleMenu}>
      <div className={`d-flex align-items-center ${pathname === Path ? 'text-primary' : ''}`} style={{gap:'5px', cursor:'pointer'}} >
         <Icon fontSize={16} />
         <div className='fw-bold'>
        {MainTitle}
      </div>
      {SubTitles?.length > 0  && 
     ( isDropDownMenuOpen ? (
        <MdKeyboardArrowUp />
      ) : (
        <MdKeyboardArrowDown />
      ))}
      </div>
      </Link>
      {
       isDropDownMenuOpen && 
     
      <div>
        {SubTitles?.map((SubTitle, idx)=>(
        <Link style={{textDecoration:'none', color:'#9194a3'}} to = {SubTitle.path}> 
        <div style={{cursor:'pointer', color:'#9194a3'}} className={ `my-2 ${pathname === SubTitle.path ? 'text-primary' : '' }`} key={idx}>
                {SubTitle.Title}
        </div>
        </Link>
        ))}
      </div>
       }
    </div>
  )
}

export default SideBarMenu
