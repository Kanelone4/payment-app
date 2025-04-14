"use client"

import React, { useState, useRef, useEffect, FC } from "react"
import { MdKeyboardArrowDown } from "react-icons/md"
import { CgProfile } from "react-icons/cg"
import { IoApps } from "react-icons/io5"
import { Button } from "react-bootstrap"
import { useDispatch} from "react-redux"
import { logout } from "../../features/authSlice"
import { useNavigate } from "react-router-dom"
import "../../layout/header/header.css"
import type { RootState } from "../../store"
import { createPortal } from "react-dom"
import type { ThunkDispatch } from "redux-thunk"
import type { AnyAction } from "redux"
import { useSelector } from "react-redux"

interface HeaderProps {
  toggleSidebar: () => void
}

interface Subscription {
  _id: string
  plan_id: string
}

interface Image {
  src: string
  alt: string
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showAppsDropdown, setShowAppsDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 })
  const [appsDropdownPosition, setAppsDropdownPosition] = useState({ top: 0, left: 0, right: 0 })

  const profileRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const appsRef = useRef<HTMLSpanElement>(null)
  const appsDropdownRef = useRef<HTMLDivElement>(null)


  const user = useSelector((state: RootState) => {
    return state.auth.user
  })

  
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>()
  const navigate = useNavigate()

  const images: Image[] = [
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
      await dispatch(logout())
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
      setShowAppsDropdown(false)
    }
  }

  const toggleAppsDropdown = () => {
    if (appsRef.current) {
      const rect = appsRef.current.getBoundingClientRect()
      setAppsDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        right: window.innerWidth - rect.right - window.scrollX,
      })
      setShowAppsDropdown(!showAppsDropdown)
      setShowProfileDropdown(false)
    }
  }


  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      // Gestion du profil dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false)
      }
      
      // Gestion du apps dropdown
      if (
        appsDropdownRef.current &&
        !appsDropdownRef.current.contains(event.target as Node) &&
        appsRef.current &&
        !appsRef.current.contains(event.target as Node)
      ) {
        setShowAppsDropdown(false)
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
            />
            <path
              opacity="0.3"
              d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
              fill="currentColor"
            />
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
          ref={appsRef}
          style={{ cursor: "pointer", padding: "8px", position: "relative" }}
          className="d-flex align-items-center hover-bg text-primary"
          onClick={toggleAppsDropdown}
        >
          <IoApps fontSize={24} />
        </span>
      </div>

      {showProfileDropdown && (
        <ProfileDropdownPortal ref={dropdownRef} position={dropdownPosition} user={user} onLogout={handleLogout} />
      )}

      {showAppsDropdown && (
        <AppsDropdownPortal 
          ref={appsDropdownRef} 
          position={appsDropdownPosition} 
          images={images} 
          onHide={() => setShowAppsDropdown(false)}
        />
      )}
    </div>
  )
}

interface ProfileDropdownPortalProps {
  position: { top: number; left: number; right: number }
  user: {
    _id: string
    nom: string
    prenom: string
    email: string
    role: string
    createdAt?: string
    subscriptions?: Array<Subscription | string>
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
          position: "absolute",
          top: `${position.top}px`,
          right: `${position.right}px`,
          width: "250px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "#212529", marginBottom: "4px" }}>
            {user?.prenom} {user?.nom}
          </div>
          <div style={{ fontSize: "14px", color: "#6c757d", wordBreak: "break-all" }}>{user?.email}</div>
          {user?.createdAt && (
            <div style={{ fontSize: "12px", color: "#adb5bd", marginTop: "8px" }}>
              Membre depuis: {new Date(user.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
        <div style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onLogout()
            }}
            style={{ fontSize: "13px", padding: "4px 12px" }}
          >
            Déconnexion
          </Button>
        </div>
      </div>,
      document.body
    )
  }
)

ProfileDropdownPortal.displayName = "ProfileDropdownPortal"
interface AppsDropdownPortalProps {
  position: { top: number; left: number; right: number }
  images: Image[]
  onHide: () => void
}

const AppsDropdownPortal = React.forwardRef<HTMLDivElement, AppsDropdownPortalProps>(
  ({ position, images, onHide }, ref) => {
    return createPortal(
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: `${position.top}px`,
          right: `${position.right}px`,
          width: "320px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
          padding: "16px",
        }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          padding: "8px"
        }}>
          {images.map((image, index) => (
            <div 
              key={index} 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f5f5f5";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "";
                (e.currentTarget as HTMLDivElement).style.transform = "";
              }}
              onClick={() => {
                onHide();
                // Ajoutez ici une navigation ou une action spécifique si nécessaire
              }}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "contain",
                  marginBottom: "8px"
                }} 
              />
              <p style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: 500,
                color: "#333",
                textAlign: "center"
              }}>{image.alt}</p>
            </div>
          ))}
        </div>
        <div style={{ 
          textAlign: "center", 
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: "1px solid #f0f0f0"
        }}>
          <img 
            src="/assets/Images/rightcom-xp.svg" 
            alt="rightcom-xp" 
            style={{
              height: "24px",
              objectFit: "contain"
            }} 
          />
        </div>
      </div>,
      document.body
    );
  }
);

AppsDropdownPortal.displayName = "AppsDropdownPortal"

export default Header