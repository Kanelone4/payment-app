"use client"

import  React from "react"
import { useState, useRef, useEffect } from "react"
import { MdKeyboardArrowDown } from "react-icons/md"
import { CgProfile } from "react-icons/cg"
import { IoApps } from "react-icons/io5"
import { Modal, Button, Row, Col } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../features/authSlice"
import { useNavigate } from "react-router-dom"
import "../../layout/header/header.css"
import type { RootState } from "../../store"
import { createPortal } from "react-dom"

interface HeaderProps {
  toggleSidebar: () => void
}

interface Subscription {
  _id: string
  plan_id: string
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showAppsModal, setShowAppsModal] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 })

  const profileRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const images = [
    { src: "/assets/Images/right-time.svg", alt: "Right Time" },
    { src: "/assets/Images/right-survey.svg", alt: "Right Survey" },
    { src: "/assets/Images/right-q.svg", alt: "Right Q" },
    { src: "/assets/Images/right-desk.svg", alt: "Right Desk" },
    { src: "/assets/Images/right-bot.svg", alt: "Right Bot" },
    { src: "/assets/Images/right-player.svg", alt: "Right Player" },
    { src: "/assets/Images/right-flow.svg", alt: "Right Flow" },
    { src: "/assets/Images/right-success.svg", alt: "Right Success" },
  ]

  const handleLogout = async () => {
    try {
      dispatch(logout())
      navigate("/auth/login")
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }


  const toggleProfileDropdown = () => {
    if (profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        right: window.innerWidth - rect.right - window.scrollX,
      })
      setShowProfileDropdown(!showProfileDropdown)
    }
  }

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      } 
    }

    document.addEventListener("mousedown", handleDocumentClick)
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick)
    }
  }, [])

  return (
    <div
      style={{ padding: "10px", paddingTop: "15px" }}
      className="d-flex justify-content-between align-items-center px-4 py-3 w-100"
    >
      <button
        onClick={toggleSidebar}
        className="btn btn-icon btn-active-color-primary w-35px h-35px d-lg-none"
        id="kt_app_sidebar_mobile_toggle"
        aria-label="Toggle sidebar"
      >
        <span className="svg-icon svg-icon-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z"
              fill="currentColor"
            ></path>
            <path
              opacity="0.3"
              d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
      </button>
      <div className="d-flex align-items-center" style={{ gap: "10px", marginRight: "15%" }}>
        <h4 className="d-none d-lg-block" style={{ color: "#50cd89" }}>
          Right<span style={{ color: "#0089e1" }}>Payment</span>
        </h4>
      </div>
      <div style={{ gap: "15px" }} className="d-flex align-items-center">
        <span
          style={{ gap: "5px", cursor: "pointer", paddingLeft: "8px", paddingRight: "8px" }}
          className="d-flex align-items-center hover-bg hover-text"
        >
          <img style={{ width: "15px", height: "15px" }} src="/public/assets/Images/UsaFlag.webp" alt="USA Flag" />
          <p className="mt-3" style={{ fontSize: "14px" }}>
            English
          </p>
          <MdKeyboardArrowDown />
        </span>
        <div
          ref={profileRef}
          style={{ position: "relative" }}
          className="d-flex z-8 align-items-center text-primary hover-bg"
        >
          <CgProfile
            fontSize={42}
            color="#50cd89"
            style={{ cursor: "pointer", padding: "8px" }}
            onClick={toggleProfileDropdown}
          />
        </div>
        <span
          style={{ cursor: "pointer", padding: "8px" }}
          className="d-flex align-items-center hover-bg text-primary"
          onClick={() => setShowAppsModal(true)}
        >
          <IoApps fontSize={24} />
        </span>
      </div>

      {showProfileDropdown && (
        <ProfileDropdownPortal
          ref={dropdownRef}
          position={dropdownPosition}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <Modal show={showAppsModal} onHide={() => setShowAppsModal(false)} size="lg" centered>
        <Modal.Body>
          <Row>
            {images.map((image, index) => (
              <Col style={{ cursor: "pointer" }} key={index} xs={4} className="text-center mb-3">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  style={{ width: "26%" }}
                  className="img-fluid"
                />
                <p className="mt-2">{image.alt}</p>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <img src="/assets/Images/rightcom-xp.svg" alt="rightcom-xp" style={{ width: "10%", cursor: "pointer" }} />
        </Modal.Footer>
      </Modal>
    </div>
  )
}

interface ProfileDropdownPortalProps {
  position: { top: number; left: number; right: number }
  user: {
    prenom?: string
    nom?: string
    email?: string
    _id?: string
    subscriptions?: Subscription[] | string[]
    updatedAt?: string
  } | null
  onLogout: () => void
}

const ProfileDropdownPortal = React.forwardRef<HTMLDivElement, ProfileDropdownPortalProps>(
  ({ position, user, onLogout }, ref) => {
    return createPortal(
      <div
        ref={ref}
        className="profile-dropdown-portal"
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          right: `${position.right}px`,
          width: '250px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#212529', marginBottom: '4px' }}>
            {user?.prenom} {user?.nom}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d', wordBreak: 'break-all' }}>
            {user?.email}
          </div>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation(); // Empêche la propagation de l'événement
              onLogout();
            }}
            style={{ fontSize: '13px', padding: '4px 12px' }}
          >
            Déconnexion
          </Button>
        </div>
      </div>,
      document.body
    )
  }
)

export default Header