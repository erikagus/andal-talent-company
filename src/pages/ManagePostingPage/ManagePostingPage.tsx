import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'design-system'
import { Plus, ArrowUp, Funnel, MagnifyingGlass, Eye, PencilSimple, Trash } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import './ManagePostingPage.css'

const POSTS = [
  { id: 1, title: 'Peluncuran Fitur Baru - Tim Engineering', date: 'May 15, 2025' },
  { id: 2, title: 'Update Apps Baru',                        date: 'May 14, 2025' },
  { id: 3, title: 'Training Session - Effective Communication', date: 'Feb 23, 2024' },
  { id: 4, title: 'Business Development',                    date: 'May 12, 2023' },
  { id: 5, title: 'Accounting Staff',                        date: 'Apr 21, 2023' },
  { id: 6, title: 'Business Development',                    date: 'Jan 19, 2023' },
]

export default function ManagePostingPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState(POSTS)
  const [titleSearch, setTitleSearch] = useState('')
  const [dateSearch, setDateSearch] = useState('')

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(titleSearch.toLowerCase()) &&
    p.date.toLowerCase().includes(dateSearch.toLowerCase())
  )

  function handleDelete(id: number) {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="manage-page">
      <Navbar />

      <main className="manage-page__content page-content">

        {/* ── Toolbar: heading + Create News ── */}
        <div className="manage-page__toolbar">
          <div className="manage-page__heading">
            <h1 className="manage-page__title">Admin Bulletin Overview</h1>
            <p className="manage-page__subtitle">
              View and manage your latest news posts and updates from the admin.
            </p>
          </div>
          <Button
            variant="Solid"
            size="Medium"
            color="Primary"
            leftIcon={Plus}
            onClick={() => navigate('/create-bulletin')}
          >
            Create News
          </Button>
        </div>

        {/* ── Table ── */}
        <div className="manage-page__table-wrap">
          <table className="manage-table">
            <thead>
              <tr className="manage-table__header-row">

                {/* Title column header */}
                <th className="manage-table__th manage-table__th--title">
                  <div className="manage-table__th-top">
                    <span className="manage-table__th-label">Title</span>
                    <div className="manage-table__th-icons">
                      <button className="manage-table__icon-btn" aria-label="Sort title">
                        <ArrowUp size={16} />
                      </button>
                      <button className="manage-table__icon-btn" aria-label="Filter title">
                        <Funnel size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="manage-table__th-search">
                    <MagnifyingGlass size={16} className="manage-table__search-icon" />
                    <input
                      className="manage-table__search-input"
                      placeholder="Search"
                      value={titleSearch}
                      onChange={(e) => setTitleSearch(e.target.value)}
                    />
                  </div>
                </th>

                {/* Date Published column header */}
                <th className="manage-table__th manage-table__th--date">
                  <div className="manage-table__th-top">
                    <span className="manage-table__th-label">Date Published</span>
                    <div className="manage-table__th-icons">
                      <button className="manage-table__icon-btn" aria-label="Sort date">
                        <ArrowUp size={16} />
                      </button>
                      <button className="manage-table__icon-btn" aria-label="Filter date">
                        <Funnel size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="manage-table__th-search">
                    <MagnifyingGlass size={16} className="manage-table__search-icon" />
                    <input
                      className="manage-table__search-input"
                      placeholder="Search"
                      value={dateSearch}
                      onChange={(e) => setDateSearch(e.target.value)}
                    />
                  </div>
                </th>

                {/* Action column header */}
                <th className="manage-table__th manage-table__th--action">
                  <div className="manage-table__th-top">
                    <span className="manage-table__th-label">Action</span>
                  </div>
                </th>

              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="manage-table__row">
                  <td className="manage-table__td manage-table__td--title">{post.title}</td>
                  <td className="manage-table__td">{post.date}</td>
                  <td className="manage-table__td">
                    <div className="manage-table__actions">
                      <button className="manage-table__action-btn" aria-label="View">
                        <Eye size={24} />
                      </button>
                      <button
                        className="manage-table__action-btn"
                        aria-label="Edit"
                        onClick={() => navigate(`/create-bulletin?edit=${post.id}`)}
                      >
                        <PencilSimple size={24} />
                      </button>
                      <button
                        className="manage-table__action-btn manage-table__action-btn--delete"
                        aria-label="Delete"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash size={24} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="manage-table__empty">No bulletins found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}
