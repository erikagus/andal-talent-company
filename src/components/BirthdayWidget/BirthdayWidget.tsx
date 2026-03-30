import { useState, useEffect } from 'react'
import { Button } from '../../design-system'
import { supabase } from '../../lib/supabase'
import './BirthdayWidget.css'

interface BirthdayUser {
  id: string
  name: string
  job_position: string
  avatar_url: string | null
  birthday: string // YYYY-MM-DD
}

function formatBirthdayLabel(birthday: string): string {
  const today = new Date()
  const bday = new Date(birthday)
  const year = today.getFullYear()

  const bdayThis  = new Date(year, bday.getMonth(), bday.getDate())
  const todayMid  = new Date(year, today.getMonth(), today.getDate())
  const tomorrow  = new Date(year, today.getMonth(), today.getDate() + 1)

  if (bdayThis.getTime() === todayMid.getTime()) return 'Today'
  if (bdayThis.getTime() === tomorrow.getTime()) return 'Tomorrow'

  return bdayThis.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface BirthdayWidgetProps {
  onViewAll?: () => void
}

export default function BirthdayWidget({ onViewAll }: BirthdayWidgetProps) {
  const [users, setUsers] = useState<BirthdayUser[]>([])

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1 // 1–12
    supabase
      .from('users')
      .select('id, name, job_position, avatar_url, birthday')
      .not('birthday', 'is', null)
      .then(({ data, error }) => {
        console.log('[BirthdayWidget] fetch — data:', data, 'error:', error)
        if (!data) return
        const filtered = (data as BirthdayUser[]).filter(
          (u) => new Date(u.birthday).getMonth() + 1 === currentMonth
        )
        setUsers(filtered)
      })
  }, [])

  return (
    <div className="bday-widget">
      {/* ── Header ── */}
      <div className="bday-widget__header">
        <svg className="bday-widget__cake" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 10h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10Z" fill="var(--schemes-brand-brand-primary, #7066FF)" opacity="0.2"/>
          <path d="M3 10h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10Z" stroke="var(--schemes-brand-brand-primary, #7066FF)" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M7 10V7m5 3V7m5 3V7" stroke="var(--schemes-brand-brand-primary, #7066FF)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 7c0-1.5 2-1.5 2-3s-2-1.5-2-3M12 7c0-1.5 2-1.5 2-3s-2-1.5-2-3M17 7c0-1.5 2-1.5 2-3s-2-1.5-2-3" stroke="var(--schemes-brand-brand-primary, #7066FF)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="bday-widget__title">Birthdays</span>
      </div>

      {/* ── List ── */}
      <ul className="bday-widget__list">
        {users.length === 0 && (
          <li className="bday-widget__empty">No birthdays this month</li>
        )}
        {users.map((user, i) => (
          <li key={user.id} className="bday-widget__item">
            <div className="bday-widget__row">
              {/* Avatar with 🎉 badge */}
              <div className="bday-widget__avatar-wrap">
                {void console.log('[BirthdayWidget] avatar_url for', user.name, ':', user.avatar_url)}
                {user.avatar_url
                  ? <img
                      src={user.avatar_url}
                      alt={user.name}
                      onError={(e) => console.log('[BirthdayWidget] img error:', e, user.avatar_url)}
                      className="bday-widget__avatar bday-widget__avatar--img"
                    />
                  : <div className="bday-widget__avatar" aria-hidden="true">{user.name[0]}</div>
                }
                <span className="bday-widget__badge" aria-hidden="true">🎉</span>
              </div>

              {/* Profile */}
              <div className="bday-widget__profile">
                <div className="bday-widget__info">
                  <span className="bday-widget__name">{user.name}</span>
                  <span className="bday-widget__position">{user.job_position}</span>
                </div>
                <span className="bday-widget__date">{formatBirthdayLabel(user.birthday)}</span>
              </div>
            </div>

            {i < users.length - 1 && <hr className="bday-widget__divider" />}
          </li>
        ))}
      </ul>

      {/* ── View All ── */}
      <Button variant="Outline" size="Medium" color="Primary" onClick={onViewAll}>
        View All
      </Button>
    </div>
  )
}
