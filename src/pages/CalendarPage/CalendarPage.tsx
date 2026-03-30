import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, EventContentArg } from '@fullcalendar/core'
import { useRef, useState } from 'react'
import { X, Cake, Buildings, ArrowLeft } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../components'
import alexAvatar from '../../assets/portrait-asian-teen-boy.jpg'
import './CalendarPage.css'

/* ── Types ─────────────────────────────────────────────────────────── */

type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
type ColorFamily = 'brand' | 'success' | 'warning' | 'error'

interface Person {
  name: string
  role: string
  avatar?: string
}

interface ModalInfo {
  title: string
  type: 'birthday' | 'company'
  person?: Person
  start: Date
  end: Date | null
  allDay: boolean
}

/* ── Color family mapping ───────────────────────────────────────────── */
/* CSS handles the actual colors via --cal-* tokens per family class    */

const PERSON_FAMILY: Record<string, ColorFamily> = {
  'Budi Santoso':   'success',
  'Alisa Thompson': 'brand',
  'David Chen':     'warning',
  'Sarah Johnson':  'error',
  'Alex':           'success',
}

/* ── Event factories ───────────────────────────────────────────────── */

function birthdayEvent(id: string, name: string, role: string, date: string, avatar?: string) {
  const colorFamily: ColorFamily = PERSON_FAMILY[name] ?? 'brand'
  return {
    id,
    title: `${name}'s Birthday`,
    start: date,
    allDay: true,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    extendedProps: { type: 'birthday' as const, colorFamily, person: { name, role, avatar } },
  }
}

function companyEvent(id: string, title: string, start: string, end?: string, allDay = false) {
  return {
    id,
    title,
    start,
    ...(end ? { end } : {}),
    allDay,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    extendedProps: { type: 'company' as const, colorFamily: 'brand' as ColorFamily },
  }
}

/* ── Mock events ───────────────────────────────────────────────────── */

const EVENTS = [
  birthdayEvent('bday-budi',  'Budi Santoso',   'Sales Executive',          '2026-03-28', '/src/assets/budi.png'),
  birthdayEvent('bday-alisa', 'Alisa Thompson', 'Senior Software Engineer', '2026-03-29', '/src/assets/alisa.png'),
  birthdayEvent('bday-david', 'David Chen',     'Marketing Manager',        '2026-03-21', '/src/assets/david.png'),
  birthdayEvent('bday-sarah', 'Sarah Johnson',  'HR Specialist',            '2026-03-25', '/src/assets/sarah.png'),
  birthdayEvent('bday-alex',  'Alex',           'New Employee',             '2026-04-01', alexAvatar),

  companyEvent('evt-standup',  'Weekly Team Standup',               '2026-03-28T09:00:00', '2026-03-28T09:30:00'),
  companyEvent('evt-standup2', 'Weekly Team Standup',               '2026-04-01T09:00:00', '2026-04-01T09:30:00'),
  companyEvent('evt-q2',       'Q2 Planning Meeting',               '2026-03-31T10:00:00', '2026-03-31T12:00:00'),
  companyEvent('evt-training', 'Training: Effective Communication', '2026-04-02T14:00:00', '2026-04-02T16:00:00'),
  companyEvent('evt-outing',   'Company Outing',                    '2026-04-04', undefined, true),
]

/* ── Helpers ───────────────────────────────────────────────────────── */

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(date: Date, allDay: boolean): string {
  const d = date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  if (allDay) return d
  const t = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${d} • ${t}`
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function CalendarPage() {
  const navigate = useNavigate()
  const calRef = useRef<FullCalendar>(null)
  const [view, setView] = useState<ViewType>('dayGridMonth')
  const [modal, setModal] = useState<ModalInfo | null>(null)

  function changeView(v: ViewType) {
    setView(v)
    calRef.current?.getApi().changeView(v)
  }

  function handleEventClick(arg: EventClickArg) {
    const ep = arg.event.extendedProps
    setModal({
      title: arg.event.title,
      type: ep.type,
      person: ep.person,
      start: arg.event.start!,
      end: arg.event.end,
      allDay: arg.event.allDay,
    })
  }

  function renderEventContent(arg: EventContentArg) {
    const ep = arg.event.extendedProps
    const person: Person | undefined = ep.person
    const name = person?.name ?? arg.event.title

    return (
      <div className="cal-event">
        {/* Avatar / icon */}
        <div className="cal-event__avatar-wrap">
          {person?.avatar
            ? <img
                className="cal-event__avatar cal-event__avatar--photo"
                src={person.avatar}
                alt={name}
              />
            : ep.type === 'company'
              ? <div className="cal-event__avatar cal-event__avatar--icon">
                  <Buildings size={13} />
                </div>
              : <div className="cal-event__avatar cal-event__avatar--initials">
                  {initials(name)}
                </div>
          }
        </div>

        {/* Time (timed events only) */}
        {!arg.event.allDay && arg.timeText && (
          <span className="cal-event__time">{arg.timeText}</span>
        )}

        {/* Title */}
        <span className="cal-event__label">{arg.event.title}</span>
      </div>
    )
  }

  const VIEW_LABELS: Record<ViewType, string> = {
    dayGridMonth: 'Month',
    timeGridWeek: 'Week',
    timeGridDay:  'Day',
  }

  return (
    <div className="cal-page">
      <Navbar />

      <main className="cal-page__main page-content">
        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="cal-page__header">
          <div className="cal-page__heading-wrap">
            <button className="cal-page__back" onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
            <h1 className="cal-page__heading">Calendar Event</h1>
          </div>
          <div className="cal-page__view-toggle">
            {(['dayGridMonth', 'timeGridWeek', 'timeGridDay'] as const).map((v) => (
              <button
                key={v}
                className={`cal-page__view-btn ${view === v ? 'cal-page__view-btn--active' : ''}`}
                onClick={() => changeView(v)}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Calendar ────────────────────────────────────────────── */}
        <div className="cal-page__calendar">
          <FullCalendar
            ref={calRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
            dayHeaderFormat={{ weekday: 'short' }}
            dayMaxEvents={3}
            moreLinkText={(n) => `+${n} more`}
            events={EVENTS}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventClassNames={(arg) => [`cal-color-${arg.event.extendedProps.colorFamily ?? 'brand'}`]}
            nowIndicator
            scrollTime="08:00:00"
            height="auto"
          />
        </div>
      </main>

      {/* ── Event modal ─────────────────────────────────────────────── */}
      {modal && (
        <div className="cal-modal-overlay" onClick={() => setModal(null)}>
          <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cal-modal__close" onClick={() => setModal(null)} aria-label="Close">
              <X size={20} />
            </button>

            <div className="cal-modal__avatar-wrap">
              {modal.type === 'birthday' && modal.person ? (
                modal.person.avatar
                  ? <img
                      className="cal-modal__avatar cal-modal__avatar--img"
                      src={modal.person.avatar}
                      alt={modal.person.name}
                    />
                  : <div className="cal-modal__avatar">
                      {initials(modal.person.name)}
                    </div>
              ) : (
                <div className="cal-modal__avatar cal-modal__avatar--company">
                  <Buildings size={28} weight="duotone" />
                </div>
              )}
            </div>

            <div className="cal-modal__info">
              <span className="cal-modal__badge">
                {modal.type === 'birthday'
                  ? <><Cake size={14} /> Birthday</>
                  : <><Buildings size={14} /> Company Event</>
                }
              </span>
              <h2 className="cal-modal__title">{modal.title}</h2>
              {modal.person && <p className="cal-modal__role">{modal.person.role}</p>}
              <p className="cal-modal__date">{formatDate(modal.start, modal.allDay)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
