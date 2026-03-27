import { useState, useRef, useEffect } from 'react'
import './NewsCard.css'

interface NewsCardProps {
  author: string
  role: string
  title: string
  body: string
  imageUrl?: string
  /** Admin-only: show edit action */
  onEdit?: () => void
  /** Admin-only: show delete action */
  onDelete?: () => void
}

export default function NewsCard({
  author,
  role,
  title,
  body,
  imageUrl,
  onEdit,
  onDelete,
}: NewsCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const hasActions = !!(onEdit || onDelete)

  return (
    <article className="news-card">
      {/* ── Header: avatar + author + 3-dot menu ── */}
      <div className="news-card__header">
        <div className="news-card__author">
          <div className="news-card__avatar" aria-hidden="true">
            {author[0]}
          </div>
          <div className="news-card__author-info">
            <span className="news-card__author-name">{author}</span>
            <span className="news-card__author-role">{role}</span>
          </div>
        </div>

        {/* 3-dot menu */}
        <div className="news-card__menu-wrap" ref={menuRef}>
          <button
            className="news-card__menu-btn"
            aria-label="More options"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="4.5" r="1.5" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="10" cy="15.5" r="1.5" fill="currentColor" />
            </svg>
          </button>

          {menuOpen && hasActions && (
            <div className="news-card__dropdown" role="menu">
              {onEdit && (
                <button
                  className="news-card__dropdown-item"
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); onEdit() }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L4.667 14H2v-2.667L11.333 2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  className="news-card__dropdown-item news-card__dropdown-item--delete"
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); onDelete() }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0-.667 9.333a1.333 1.333 0 0 1-1.333 1.334H5.333A1.333 1.333 0 0 1 4 13.333L3.333 4h9.334Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Body: title + text + image ── */}
      <div className="news-card__body">
        <h2 className="news-card__title">{title}</h2>
        <p className="news-card__text">{body}</p>
        {imageUrl && (
          <div className="news-card__image">
            <img src={imageUrl} alt="" />
          </div>
        )}
      </div>
    </article>
  )
}
