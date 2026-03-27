import { useNavigate, useLocation } from 'react-router-dom'
import { House, Note } from '@phosphor-icons/react'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { label: 'Home', path: '/', icon: House },
    { label: 'Manage Posting', path: '/manage-posting', icon: Note },
  ]

  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">
          <div className="navbar__logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="var(--schemes-brand-brand-primary, #7066FF)" />
              <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="sans-serif">A</text>
            </svg>
          </div>
          <span className="navbar__company">PT Nike Indonesia</span>
        </div>

        <div className="navbar__right">
          <button className="navbar__icon-btn" aria-label="Notifications">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="navbar__user">
            <div className="navbar__user-info">
              <span className="navbar__user-name">Admin User</span>
              <span className="navbar__user-role">Admin</span>
            </div>
            <div className="navbar__avatar">AU</div>
          </div>
        </div>
      </div>

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
    </header>
  )
}
