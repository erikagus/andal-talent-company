import { Button } from 'design-system'
import type { Birthday } from '../../mock/data'
import './BirthdayWidget.css'

interface BirthdayWidgetProps {
  birthdays: Birthday[]
  onViewAll?: () => void
}

export default function BirthdayWidget({ birthdays, onViewAll }: BirthdayWidgetProps) {
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
        {birthdays.map((person, i) => (
          <li key={person.id} className="bday-widget__item">
            <div className="bday-widget__row">
              {/* Avatar with 🎉 badge */}
              <div className="bday-widget__avatar-wrap">
                {person.avatar
                  ? <img src={person.avatar} alt={person.name} className="bday-widget__avatar bday-widget__avatar--img" />
                  : <div className="bday-widget__avatar" aria-hidden="true">{person.name[0]}</div>
                }
                <span className="bday-widget__badge" aria-hidden="true">🎉</span>
              </div>

              {/* Profile */}
              <div className="bday-widget__profile">
                <div className="bday-widget__info">
                  <span className="bday-widget__name">{person.name}</span>
                  <span className="bday-widget__position">{person.role}</span>
                </div>
                <span className="bday-widget__date">{person.date}</span>
              </div>
            </div>

            {i < birthdays.length - 1 && <hr className="bday-widget__divider" />}
          </li>
        ))}
      </ul>

      {/* ── View All ── */}
      <Button variant="Outline" size="Large" color="Primary" onClick={onViewAll}>
        View All
      </Button>
    </div>
  )
}
