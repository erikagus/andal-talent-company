import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'design-system'
import { Plus } from '@phosphor-icons/react'
import { Navbar, NewsCard, BirthdayWidget } from '../../components'
import { posts as initialPosts, birthdays, currentUser } from '../../mock/data'
import './HomePage.css'

const isAdmin = currentUser.role === 'admin'

export default function HomePage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState(initialPosts)

  function handleDelete(id: number) {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  function handleEdit(id: number) {
    navigate(`/create-bulletin?edit=${id}`)
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-page__main page-content">
        <div className="home-page__layout">

          {/* Feed column — 803px, gap 20px */}
          <div className="home-page__feed">
            {posts.map((post) => (
              <NewsCard
                key={post.id}
                author={post.author}
                role={post.role}
                title={post.title}
                body={post.content}
                imageUrl={post.image}
                onEdit={isAdmin ? () => handleEdit(post.id) : undefined}
                onDelete={isAdmin ? () => handleDelete(post.id) : undefined}
              />
            ))}
          </div>

          {/* Sidebar — fills remaining width, gap 24px */}
          <aside className="home-page__sidebar">
            {/* Admin only: Create News — Solid / Large / Primary + left Plus icon */}
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
            <BirthdayWidget birthdays={birthdays} />
          </aside>

        </div>
      </main>
    </div>
  )
}
