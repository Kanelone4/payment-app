// Header.tsx

import React, { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoApps } from "react-icons/io5";
import { Modal, Button, Row, Col } from 'react-bootstrap'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { logout } from '../../features/authSlice'; 
import { useNavigate } from 'react-router-dom'; 
import '../../layout/header/header.css';
import { RootState } from '../../store'; // Importez RootState depuis store.ts

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showAppsModal, setShowAppsModal] = useState(false); 
  const [showProfileModal, setShowProfileModal] = useState(false); 

  const user = useSelector((state: RootState) => state.auth.user); // Accédez à state.auth.user
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const images = [
    { src: '/assets/Images/right-time.svg', alt: 'Right Time' },
    { src: '/assets/Images/right-survey.svg', alt: 'Right Survey' },
    { src: '/assets/Images/right-q.svg', alt: 'Right Q' },
    { src: '/assets/Images/right-desk.svg', alt: 'Right Desk' },
    { src: '/assets/Images/right-bot.svg', alt: 'Right Bot' },
    { src: '/assets/Images/right-player.svg', alt: 'Right Player' },
    { src: '/assets/Images/right-flow.svg', alt: 'Right Flow' },
    { src: '/assets/Images/right-success.svg', alt: 'Right Success' },
  ];

  const handleLogout = async () => {
    try {
      dispatch(logout()); // Dispatchez l'action logout
      navigate('/auth/login'); // Redirigez vers la page de connexion
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div style={{ padding: '10px', paddingTop: '15px' }} className='d-flex justify-content-between align-items-center px-4 py-3 w-100'>
      <button
        onClick={toggleSidebar}
        className="btn btn-icon btn-active-color-primary w-35px h-35px d-lg-none"
        id="kt_app_sidebar_mobile_toggle"
        aria-label="Toggle sidebar"
      >
        <span className="svg-icon svg-icon-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z" fill="currentColor"></path>
            <path opacity="0.3" d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z" fill="currentColor"></path>
          </svg>
        </span>
      </button>

      <div className="d-flex align-items-center" style={{ gap: '10px', marginRight: '15%' }}>
        <div className="d-lg-none">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#50cd89" />
            <path d="M20 10L25 15H15L20 10Z" fill="#ffffff" />
            <path d="M20 30L15 25H25L20 30Z" fill="#ffffff" />
          </svg>
        </div>

        <h4 className="d-none d-lg-block" style={{ color: '#50cd89' }}>
          Right<span style={{ color: '#0089e1' }}>Payment</span>
        </h4>
      </div>

      <div style={{ gap: '15px' }} className='d-flex align-items-center'>
        <span style={{ gap: '5px', cursor: 'pointer', paddingLeft: '8px', paddingRight: '8px' }} className='d-flex align-items-center hover-bg hover-text'>
          <img style={{ width: '15px', height: '15px' }} src="/public/assets/Images/UsaFlag.webp" alt="USA Flag" />
          <p className='mt-3' style={{ fontSize: '14px' }}>English</p>
          <MdKeyboardArrowDown />
        </span>

        <div style={{ position: 'relative' }} className='d-flex z-8 align-items-center text-primary hover-bg'>
          <CgProfile
            fontSize={42}
            color='#50cd89'
            style={{ cursor: 'pointer', padding: '8px' }}
            onClick={() => setShowProfileModal(true)} // Ouvrir la modale du profil au clic
          />
        </div>

        <span
          style={{ cursor: 'pointer', padding: '8px' }}
          className='d-flex align-items-center hover-bg text-primary'
          onClick={() => setShowAppsModal(true)} // Ouvrir la modale des applications au clic
        >
          <IoApps fontSize={24} />
        </span>
      </div>

      {/* Modale des applications */}
      <Modal show={showAppsModal} onHide={() => setShowAppsModal(false)} size="lg" centered>
        <Modal.Body>
          <Row>
            {images.map((image, index) => (
              <Col key={index} xs={4} className="text-center mb-3">
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{ width: '26%' }}
                  className="img-fluid"
                />
                <p className="mt-2">{image.alt}</p>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'center' }}>
           <img src='/assets/Images/rightcom-xp.svg' alt="rightcom-xp" style={{ width: '10%' }} />
        </Modal.Footer>
      </Modal>

      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p><strong>Nom:</strong> {user?.nom}</p>
            <p><strong>Prénom:</strong> {user?.prenom}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Fermer
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Déconnexion
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Header;