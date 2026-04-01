import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../../design-system'
import { Plus } from '@phosphor-icons/react'
import { Navbar, NewsCard, BirthdayWidget } from '../../components'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { getRelativeTime } from '../../utils/relativeTime'
import './HomePage.css'

interface Post {
  id: string
  title: string
  content: string
  image_url?: string
  author_id: string
  author?: { name: string; job_position: string }
  created_at: string
  updated_at?: string | null
}

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'
  const [posts, setPosts] = useState<Post[]>([])

  // location.key changes every time React Router navigates to this route,
  // so posts are always fresh after returning from CreateBulletinPage.
  useEffect(() => {
    supabase
      .from('posts')
      .select('*, author:users!author_id(name, job_position)')
      .order('created_at', { ascending: false })
      .then(({ data, error, status, statusText }) => {
        console.log('[HomePage] fetchPosts — status:', status, statusText)
        console.log('[HomePage] fetchPosts — data:', data)
        console.log('[HomePage] fetchPosts — error:', error)
        if (data) setPosts(data as Post[])
      })
  }, [location.key])

  async function handleDelete(id: string) {
    await supabase.from('posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  function handleEdit(id: string) {
    navigate(`/create-bulletin?edit=${id}&from=home`)
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-page__main page-content">
        <div className="home-page__layout">

          <div className="home-page__feed">
            {posts.map((post) => (
              <NewsCard
                key={post.id}
                author={post.author?.name ?? 'Admin'}
                role={post.author?.job_position ?? 'Admin'}
                title={post.title}
                body={post.content}
                imageUrl={post.image_url}
                date={getRelativeTime(post.created_at)}
                edited={!!post.updated_at}
                onEdit={isAdmin ? () => handleEdit(post.id) : undefined}
                onDelete={isAdmin ? () => handleDelete(post.id) : undefined}
              />
            ))}
          </div>

          <aside className="home-page__sidebar">
            {isAdmin && (
              <Button
                variant="Solid"
                size="Large"
                color="Primary"
                leftIcon={Plus}
                onClick={() => navigate('/create-bulletin')}
              >
                Create News
              </Button>
            )}
            <BirthdayWidget onViewAll={() => navigate('/calendar')} />
          </aside>

        </div>
      </main>
    </div>
  )
}
