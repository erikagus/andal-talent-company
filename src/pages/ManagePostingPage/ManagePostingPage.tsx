import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../../design-system'
import { Plus, ArrowUp, Funnel, MagnifyingGlass, Eye, PencilSimple, Trash, X, Warning } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { supabase } from '../../lib/supabase'
import './ManagePostingPage.css'

interface Post {
  id: string
  title: string
  content?: string
  created_at: string
  updated_at?: string | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// ── View Modal ────────────────────────────────────────────────────────────────

function ViewModal({ post, onClose }: { post: Post; onClose: () => void }) {
  return (
    <div className="mp-modal-backdrop" onMouseDown={onClose}>
      <div className="mp-modal mp-modal--view" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="mp-modal__header">
          <div className="mp-modal__header-text">
            <h2 className="mp-modal__title">{post.title}</h2>
            <span className="mp-modal__date">{formatDate(post.created_at)}</span>
          </div>
          <button className="mp-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="mp-modal__body">
          <div
            className="mp-modal__content"
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="mp-modal-backdrop" onMouseDown={onCancel}>
      <div className="mp-confirm" onMouseDown={e => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className="mp-confirm__icon-wrap">
          <Warning size={28} weight="fill" className="mp-confirm__icon" />
        </div>
        <h3 className="mp-confirm__title">Hapus Postingan?</h3>
        <p className="mp-confirm__body">
          Postingan ini akan dihapus secara permanen dan tidak dapat dikembalikan.
          Apakah Anda yakin ingin melanjutkan?
        </p>
        <div className="mp-confirm__actions">
          <Button variant="Outline" size="Medium" color="Primary" type="button" onClick={onCancel}>
            Batal
          </Button>
          <Button variant="Solid" size="Medium" color="Error" type="button" onClick={onConfirm}>
            Ya, Hapus
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'closed' }
  | { type: 'view'; post: Post }
  | { type: 'delete'; post: Post }

export default function ManagePostingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [posts,       setPosts]       = useState<Post[]>([])
  const [titleSearch, setTitleSearch] = useState('')
  const [dateSearch,  setDateSearch]  = useState('')
  const [modal,       setModal]       = useState<ModalState>({ type: 'closed' })

  async function fetchPosts() {
    const { data, error, status, statusText } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    console.log('[ManagePostingPage] fetchPosts — status:', status, statusText)
    console.log('[ManagePostingPage] fetchPosts — data:', data)
    console.log('[ManagePostingPage] fetchPosts — error:', error)
    if (data) setPosts(data as Post[])
  }

  // location.key changes every time React Router navigates to this route,
  // so posts are always fresh after returning from CreateBulletinPage.
  useEffect(() => { fetchPosts() }, [location.key])

  const filtered = posts.filter((p) => {
    const date = formatDate(p.created_at)
    return (
      p.title.toLowerCase().includes(titleSearch.toLowerCase()) &&
      date.toLowerCase().includes(dateSearch.toLowerCase())
    )
  })

  async function handleDelete(id: string) {
    await supabase.from('posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
    setModal({ type: 'closed' })
  }

  return (
    <div className="manage-page">
      <Navbar />

      <main className="manage-page__content page-content">

        {/* ── Toolbar ── */}
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

                <th className="manage-table__th manage-table__th--title">
                  <div className="manage-table__th-inner">
                    <div className="manage-table__th-top">
                      <span className="manage-table__th-label">Title</span>
                      <div className="manage-table__th-icons">
                        <button className="manage-table__icon-btn" aria-label="Sort title"><ArrowUp size={16} /></button>
                        <button className="manage-table__icon-btn" aria-label="Filter title"><Funnel size={16} /></button>
                      </div>
                    </div>
                    <div className="manage-table__th-search">
                      <MagnifyingGlass size={16} className="manage-table__search-icon" />
                      <input className="manage-table__search-input" placeholder="Search"
                        value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} />
                    </div>
                  </div>
                </th>

                <th className="manage-table__th manage-table__th--date">
                  <div className="manage-table__th-inner">
                    <div className="manage-table__th-top">
                      <span className="manage-table__th-label">Date Published</span>
                      <div className="manage-table__th-icons">
                        <button className="manage-table__icon-btn" aria-label="Sort date"><ArrowUp size={16} /></button>
                        <button className="manage-table__icon-btn" aria-label="Filter date"><Funnel size={16} /></button>
                      </div>
                    </div>
                    <div className="manage-table__th-search">
                      <MagnifyingGlass size={16} className="manage-table__search-icon" />
                      <input className="manage-table__search-input" placeholder="Search"
                        value={dateSearch} onChange={(e) => setDateSearch(e.target.value)} />
                    </div>
                  </div>
                </th>

                <th className="manage-table__th manage-table__th--action">
                  <div className="manage-table__th-inner manage-table__th-inner--action">
                    <span className="manage-table__th-label">Action</span>
                  </div>
                </th>

              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="manage-table__row">
                  <td className="manage-table__td manage-table__td--title">{post.title}</td>
                  <td className="manage-table__td">
                    <div className="manage-table__date-cell">
                      {formatDate(post.created_at)}
                      {post.updated_at && (
                        <span className="manage-table__edited-badge">Edited</span>
                      )}
                    </div>
                  </td>
                  <td className="manage-table__td manage-table__td--action">
                    <div className="manage-table__actions">
                      <button className="manage-table__action-btn" aria-label="View"
                        onClick={() => setModal({ type: 'view', post })}>
                        <Eye size={24} />
                      </button>
                      <button className="manage-table__action-btn" aria-label="Edit"
                        onClick={() => navigate(`/create-bulletin?edit=${post.id}&from=manage`)}>
                        <PencilSimple size={24} />
                      </button>
                      <button className="manage-table__action-btn manage-table__action-btn--delete" aria-label="Delete"
                        onClick={() => setModal({ type: 'delete', post })}>
                        <Trash size={24} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={3} className="manage-table__empty">No bulletins found</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </main>

      {/* Modals */}
      {modal.type === 'view' && (
        <ViewModal post={modal.post} onClose={() => setModal({ type: 'closed' })} />
      )}
      {modal.type === 'delete' && (
        <DeleteModal
          onConfirm={() => handleDelete(modal.post.id)}
          onCancel={() => setModal({ type: 'closed' })}
        />
      )}
    </div>
  )
}
