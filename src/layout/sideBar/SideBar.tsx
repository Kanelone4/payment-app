import React from 'react';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { PiNewspaperClippingBold } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import SideBarMenu from './SideBarMenu';

interface SideBarProps {
  isSidebarOpen: boolean; 
}

const SideBar: React.FC<SideBarProps> = ({ isSidebarOpen }) => {
  const Menus = [
    {
      Icon: MdOutlineSpaceDashboard,
      MainTitle: "Dashboard",
      Path: "/",
      SubTitles: []
    },
    {
      Icon: MdPayments,
      MainTitle: "Subscriptions",
      SubTitles: [{ Title: "Add New", path: "/add-new" }, { Title: "List of subscriptions", path: "/list" }],
    },
    {
      Icon: PiNewspaperClippingBold,
      MainTitle: "Factures",
      Path: "/factures",
      SubTitles: []
    },
    {
      Icon: IoMdNotificationsOutline,
      MainTitle: "Notifications",
      Path: "/notifications",
      SubTitles: []
    },
    {
      Icon: IoSettingsOutline,
      MainTitle: "Settings",
      Path: "/settings",
      SubTitles: []
    }
  ];

  const [dropDownMenu, setDropDownMenu] = React.useState<string[]>(
    Menus.map((item) => item.MainTitle)
  );

  return (
    <div className='h-100 d-flex p-4' style={{ width: '250px' }}>
      <div style={{ gap: '10px' }} className='d-flex flex-column h-100 w-100'>
        {isSidebarOpen && (
          <div className="d-lg-none mb-4">
            <h4 style={{ color: '#50cd89' }}>
              Right<span style={{ color: '#0089e1' }}>Payment</span>
            </h4>
          </div>
        )}

        {Menus.map((menu, idx) => (
          <div className='d-flex' key={idx}>
            <SideBarMenu
              Icon={menu.Icon}
              MainTitle={menu.MainTitle}
              SubTitles={menu.SubTitles}
              Path={menu.Path}
              dropDownMenu={dropDownMenu}
              setDropDownMenu={setDropDownMenu}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;