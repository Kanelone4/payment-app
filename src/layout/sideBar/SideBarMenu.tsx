import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import '../../layout/sideBar/sideBarMenu.css';

interface Subtitle {
  Title: string;
  path: string;
}

interface MenuProps {
  Icon: IconType;
  MainTitle: string;
  SubTitles: Subtitle[];
  Path?: string;
  dropDownMenu: string[];
  setDropDownMenu: React.Dispatch<React.SetStateAction<string[]>>;
}

const SideBarMenu = ({ Icon, MainTitle, SubTitles, Path, dropDownMenu, setDropDownMenu }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(dropDownMenu.includes(MainTitle));
  const { pathname } = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setDropDownMenu((prev) =>
      isOpen ? prev.filter((item) => item !== MainTitle) : [...prev, MainTitle]
    );
  };

  return (
    <div>
      <Link style={{ textDecoration: 'none', color: '#808080', gap: '1px' }} to={Path ? Path : ''}>
        <div
          onClick={toggleMenu}
          className={`d-flex align-items-center ${pathname === Path ? 'active-bg text-primary' : ''}`}
          style={{ gap: '5px', cursor: 'pointer', padding: '10px', width: '220px' }}
        >
          <Icon fontSize={16} />
          <div style={{ fontWeight: '400' }} className='fs-6 '>
            {MainTitle}
          </div>
          {SubTitles?.length > 0 && (isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />)}
        </div>
      </Link>
      <div className={`submenu mt-1 ${isOpen ? 'open' : ''}`}>
        {SubTitles?.map((SubTitle, idx) => (
          <Link key={idx} style={{ textDecoration: 'none', color: '#808080' }} to={SubTitle.path}>
            <div
              style={{ cursor: 'pointer', color: '#808080', gap: '4px', marginBottom: '-7px', marginLeft: '10px' }}
              className={`d-flex align-items-center px-3 ${pathname === SubTitle.path ? 'active-bg text-primary' : ''}`}
            >
              <span style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '6px' }}>.</span> {SubTitle.Title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBarMenu;
