import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { House, Note, SignOut } from '@phosphor-icons/react'
import { Button } from '../../design-system'
import { useAuth } from '../../context/AuthContext'
import LoginModal from '../LoginModal/LoginModal'
import logoCompany from '../../assets/logo-company.png'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Employees see the bulletin feed directly at "/" — no tab navigation needed.
  // Tabs are only shown to admins (Home + Manage Posting).
  const tabs = currentUser?.role === 'admin'
    ? [
        { label: 'Home',           path: '/',               icon: House },
        { label: 'Manage Posting', path: '/manage-posting', icon: Note  },
      ]
    : []

  const initials = currentUser
    ? currentUser.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : ''

  return (
    <>
      <header className="navbar">
        <div className="navbar__container">
          {/* Brand */}
          <div className="navbar__brand">
            <div className="navbar__logo">
              <img src={logoCompany} alt="PT Nusantara Teknologi Digital" />
            </div>
            <span className="navbar__company">PT Nusantara Teknologi Digital</span>
          </div>

          {/* Right side */}
          <div className="navbar__right">
            {currentUser ? (
              <>
                {/* User info */}
                <div className="navbar__user">
                  <div className="navbar__user-info">
                    <span className="navbar__user-name">{currentUser.name}</span>
                    <span className="navbar__user-role">
                      {{ admin: 'Admin', employee: 'Employee', new_employee: 'New Employee' }[currentUser.role]}
                    </span>
                  </div>
                  {currentUser.avatar_url ? (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                        src={currentUser.avatar_url}
                        alt={currentUser.name}
                      />
                    </div>
                  ) : (
                    <div className="navbar__avatar">{initials}</div>
                  )}
                </div>

                {/* Logout */}
                <button className="navbar__icon-btn" aria-label="Log out" onClick={logout} title="Log out">
                  <SignOut size={20} />
                </button>
              </>
            ) : (
              <Button
                variant="Solid"
                size="Small"
                color="Primary"
                onClick={() => setShowLoginModal(true)}
              >
                Log In
              </Button>
            )}
          </div>
        </div>

        {/* Nav tabs — only shown when logged in */}
        {currentUser && (
          <nav className="navbar__tabs">
            <div className="navbar__tabs-container">
              {tabs.map((tab) => {
                const active = location.pathname === tab.path
                const Icon = tab.icon
                return (
                  <button
                    key={tab.path}
                    className={`navbar__tab ${active ? 'navbar__tab--active' : ''}`}
                    onClick={() => navigate(tab.path)}
                  >
                    <Icon size={20} weight={active ? 'fill' : 'regular'} aria-hidden="true" />
                    {tab.label}
                    {active && <span className="navbar__tab-indicator" />}
                  </button>
                )
              })}
            </div>
            <div className="navbar__divider" />
          </nav>
        )}
      </header>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  )
}
