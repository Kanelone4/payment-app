import React from 'react';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { PiNewspaperClippingBold } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import SideBarMenu from './SideBarMenu';
import { useTranslation } from 'react-i18next';

interface SideBarProps {
  isSidebarOpen: boolean; 
}

const SideBar: React.FC<SideBarProps> = ({ isSidebarOpen }) => {
  const { t } = useTranslation('sidebar');

  const Menus = [
    {
      Icon: MdOutlineSpaceDashboard,
      MainTitle: t('menu.dashboard'),
      Path: "/",
      SubTitles: []
    },
    {
      Icon: MdPayments,
      MainTitle: t('menu.subscriptions'),
      SubTitles: [
        { Title: t('menu.addNew'), path: "/add-new" }, 
        { Title: t('menu.listSubscriptions'), path: "/list" }
      ],
    },
    {
      Icon: PiNewspaperClippingBold,
      MainTitle: t('menu.invoices'),
      Path: "/factures",
      SubTitles: []
    },
    {
      Icon: IoMdNotificationsOutline,
      MainTitle: t('menu.notifications'),
      Path: "/notifications",
      SubTitles: []
    },
    {
      Icon: IoSettingsOutline,
      MainTitle: t('menu.settings'),
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
              {t('brand.right')}<span style={{ color: '#0089e1' }}>{t('brand.payment')}</span>
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