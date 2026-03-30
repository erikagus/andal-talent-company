import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRive } from '@rive-app/react-canvas'
import { Laptop, Keyboard, Headphones, IdentificationBadge } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { useAuth } from '../../context/AuthContext'
import confettiRiv from '../../assets/confetti.riv'
import avatarImg from '../../assets/portrait-asian-teen-boy.jpg'
import './OnboardingPage.css'

/* ── Equipment data ────────────────────────────────────────────────── */

const EQUIPMENT = [
  {
    id: 1,
    name: '16" MacBook Pro M3',
    serial: 'Serial: AC-2024-8842-MBP',
    Icon: Laptop,
  },
  {
    id: 2,
    name: 'Wireless Mouse & Keyboard',
    serial: 'Magic Mouse & Magic Keyboard Bundle',
    Icon: Keyboard,
  },
  {
    id: 3,
    name: 'Noise-Cancelling Headset',
    serial: 'Enterprise Series - Wireless',
    Icon: Headphones,
  },
  {
    id: 4,
    name: 'Company ID Badge',
    serial: 'Standard Employee Access Keycard',
    Icon: IdentificationBadge,
  },
]

/* ── Rive confetti overlay ─────────────────────────────────────────── */

function ConfettiOverlay() {
  const { RiveComponent, rive } = useRive({
    src: confettiRiv,
    autoplay: true,
  })

  // Replay every 10 seconds
  useEffect(() => {
    if (!rive) return
    const id = setInterval(() => {
      rive.reset()
      rive.play()
    }, 10000)
    return () => clearInterval(id)
  }, [rive])

  return (
    <div className="onboarding-page__confetti" aria-hidden="true">
      <RiveComponent />
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { currentUser, promoteToEmployee } = useAuth()
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const allChecked = checked.size === EQUIPMENT.length

  function toggle(id: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="onboarding-page">
      <ConfettiOverlay />
      <Navbar />

      <main className="onboarding-page__main">
        {/* ── Modal card ─────────────────────────────────────────── */}
        <div className="ob-modal">
          {/* Colored top stripe */}
          <div className="ob-modal__stripe" />

          {/* Body */}
          <div className="ob-modal__body">

            {/* Header: avatar + title + subtitle */}
            <div className="ob-modal__header">
              <div className="ob-modal__avatar-wrap">
                <img
                className="ob-modal__avatar"
                src={avatarImg}
                alt={currentUser?.name ?? 'User avatar'}
              />
                <svg className="ob-modal__spinner" viewBox="0 0 100 100" aria-hidden="true">
                  {/*
                    Outer wavy shape: 8 scallops via quadratic beziers
                      valleys (inner points) at r=42, peaks (control pts) at r=49
                    Inner hole: circle r=40 (avatar edge), 2px gap at valleys
                    fill-rule="evenodd" subtracts inner circle → hollow ring
                  */}
                  <path
                    fillRule="evenodd"
                    d="
                      M 92,50
                      Q 95.27,68.75 79.70,79.70
                      Q 68.75,95.27 50,92
                      Q 31.25,95.27 20.30,79.70
                      Q 4.73,68.75  8,50
                      Q 4.73,31.25 20.30,20.30
                      Q 31.25,4.73  50,8
                      Q 68.75,4.73  79.70,20.30
                      Q 95.27,31.25 92,50 Z
                      M 90,50
                      A 40,40 0 1 1 10,50
                      A 40,40 0 1 1 90,50 Z
                    "
                  />
                </svg>
              </div>
              <h1 className="ob-modal__title">
                Welcome to PT Nusantara Teknologi Digital,{' '}
                <span className="ob-modal__title-name">{currentUser?.name ?? 'there'}</span>!
              </h1>
              <p className="ob-modal__subtitle">
                Let's get you set up. Please acknowledge the equipment assigned to you below.
              </p>
            </div>

            {/* Checklist */}
            <div className="ob-modal__checklist">
              {EQUIPMENT.map(({ id, name, serial, Icon }) => {
                const done = checked.has(id)
                return (
                  <button
                    key={id}
                    className={`ob-item ${done ? 'ob-item--checked' : ''}`}
                    onClick={() => toggle(id)}
                    aria-pressed={done}
                  >
                    {/* Icon box */}
                    <div className="ob-item__icon-wrap">
                      <div className="ob-item__icon-box">
                        <Icon size={24} weight="duotone" className="ob-item__icon" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="ob-item__text">
                      <span className="ob-item__name">{name}</span>
                      <span className="ob-item__serial">{serial}</span>
                    </div>

                    {/* Checkbox */}
                    <div className="ob-item__checkbox-wrap" aria-hidden="true">
                      <div className="ob-item__checkbox">
                        {done && (
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Action footer */}
            <div className="ob-modal__footer">
              <button
                className={`ob-confirm-btn ${allChecked ? 'ob-confirm-btn--active' : ''}`}
                disabled={!allChecked}
                onClick={async () => { await promoteToEmployee(); navigate('/') }}
              >
                Confirm and Continue
              </button>
              <p className="ob-confirm-note">
                A digital copy of this acknowledgment will be sent to HR
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
