import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core'
import { useRef, useState, useEffect } from 'react'
import { X, Cake, Buildings, ArrowLeft } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../components'
import { supabase } from '../../lib/supabase'
import './CalendarPage.css'

/* ── Types ─────────────────────────────────────────────────────────── */

type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
type ColorFamily = 'brand' | 'success' | 'warning' | 'error'

interface Person {
  name: string
  role: string
  avatar_url?: string | null
}

interface ModalInfo {
  title: string
  type: 'birthday' | 'company'
  person?: Person
  start: Date
  end: Date | null
  allDay: boolean
}

interface BirthdayUser {
  id: string
  name: string
  job_position: string
  avatar_url: string | null
  birthday: string // YYYY-MM-DD
}

/* ── Color families cycling for birthday events ─────────────────────── */

const COLOR_FAMILIES: ColorFamily[] = ['brand', 'success', 'warning', 'error']

/* ── Static company events ─────────────────────────────────────────── */

function companyEvent(id: string, title: string, start: string, end?: string, allDay = false): EventInput {
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

const COMPANY_EVENTS: EventInput[] = [
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

/** Map a birthday date (any year) to this calendar year */
function birthdayThisYear(birthday: string): string {
  const [, month, day] = birthday.split('-')
  return `${new Date().getFullYear()}-${month}-${day}`
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function CalendarPage() {
  const navigate = useNavigate()
  const calRef = useRef<FullCalendar>(null)
  const [view, setView] = useState<ViewType>('dayGridMonth')
  const [modal, setModal] = useState<ModalInfo | null>(null)
  const [birthdayEvents, setBirthdayEvents] = useState<EventInput[]>([])

  useEffect(() => {
    supabase
      .from('users')
      .select('id, name, job_position, avatar_url, birthday')
      .not('birthday', 'is', null)
      .then(({ data, error }) => {
        console.log('[CalendarPage] birthday fetch — data:', data, 'error:', error)
        if (!data) return
        const events: EventInput[] = (data as BirthdayUser[]).map((user, i) => ({
          id: `bday-${user.id}`,
          title: `${user.name}'s Birthday`,
          start: birthdayThisYear(user.birthday),
          allDay: true,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          extendedProps: {
            type: 'birthday' as const,
            colorFamily: COLOR_FAMILIES[i % COLOR_FAMILIES.length],
            person: {
              name: user.name,
              role: user.job_position,
              avatar_url: user.avatar_url,
            } satisfies Person,
          },
        }))
        setBirthdayEvents(events)
      })
  }, [])

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
          {person?.avatar_url
            ? <img
                className="cal-event__avatar cal-event__avatar--photo"
                src={person.avatar_url}
                alt={name}
                onError={(e) => console.log('[CalendarPage] img error:', e, person.avatar_url)}
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
            events={[...COMPANY_EVENTS, ...birthdayEvents]}
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
                modal.person.avatar_url
                  ? <img
                      className="cal-modal__avatar cal-modal__avatar--img"
                      src={modal.person.avatar_url}
                      alt={modal.person.name}
                      onError={(e) => console.log('[CalendarPage] modal img error:', e, modal.person?.avatar_url)}
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
