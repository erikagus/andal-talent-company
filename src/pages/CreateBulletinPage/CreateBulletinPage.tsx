import { useRef, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Button, TextField } from '../../design-system'
import { PaperPlaneTilt } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import './CreateBulletinPage.css'

export default function CreateBulletinPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const { currentUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [post,       setPost]       = useState<{ title: string; content: string } | null>(null)
  const [title,      setTitle]      = useState('')
  const [publishing, setPublishing] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    editorProps: {
      attributes: { class: 'rich-editor__content' },
    },
  })

  // Step 1 — fetch post data once when editId is available (editor not needed here)
  useEffect(() => {
    if (!editId) return
    supabase
      .from('posts')
      .select('title, content')
      .eq('id', editId)
      .single()
      .then(({ data, error }) => {
        console.log('[CreateBulletinPage] fetch post — data:', data, 'error:', error)
        if (error || !data) return
        setTitle(data.title ?? '')
        setPost({ title: data.title ?? '', content: data.content ?? '' })
      })
  }, [editId])

  // Step 2 — push content into Tiptap once both editor and post are ready
  useEffect(() => {
    if (editor && post?.content) {
      editor.commands.setContent(post.content)
    }
  }, [editor, post])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    e.target.value = ''

    // Insert a temporary blob URL so the user sees the image immediately
    const blobUrl = URL.createObjectURL(file)
    editor.chain().focus().setImage({ src: blobUrl }).run()

    // Upload to Supabase Storage and replace the blob URL with the permanent public URL
    const fileName = `post-${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('Avatar').upload(fileName, file, { upsert: true })
    if (error) {
      console.error('[CreateBulletinPage] image upload error:', error)
      return
    }
    const { data } = supabase.storage.from('Avatar').getPublicUrl(fileName)
    const publicUrl = data.publicUrl
    console.log('[CreateBulletinPage] image public URL:', publicUrl)

    // Replace blob URL with the permanent Supabase Storage URL in the editor HTML
    const currentHtml = editor.getHTML()
    const updatedHtml = currentHtml.replace(blobUrl, publicUrl)
    editor.commands.setContent(updatedHtml, false)
  }

  async function handlePublish() {
    if (!title.trim() || !editor) return
    const content = editor.getHTML()
    console.log('[CreateBulletinPage] handlePublish →', { editId, title: title.trim(), content })
    setPublishing(true)
    if (editId) {
      const { error } = await supabase
        .from('posts')
        .update({ title: title.trim(), content, updated_at: new Date().toISOString() })
        .eq('id', editId)
      console.log('[CreateBulletinPage] update error:', error)
      setPublishing(false)
      if (error) {
        alert('Save failed: ' + error.message)
      } else {
        navigate(-1)
      }
    } else {
      const { error } = await supabase.from('posts').insert({
        title:     title.trim(),
        content,
        author_id: currentUser?.id ?? null,
      })
      console.log('[CreateBulletinPage] insert error:', error)
      setPublishing(false)
      if (!error) navigate('/')
    }
  }

  if (!editor) return null

  return (
    <div className="create-page">
      <Navbar />

      <main className="create-page__content page-content">

        {/* ── Heading ── */}
        <div className="create-page__heading">
          <h1 className="create-page__title">
            {editId ? 'Edit Bulletin' : 'Create New Bulletin'}
          </h1>
          <p className="create-page__subtitle">
            Fill in the details below to post to the company page.
          </p>
        </div>

        {/* ── Form card ── */}
        <div className="create-page__form-card">

          <div className="create-page__section">
            <span className="create-page__section-label">News</span>

            <div className="create-page__fields">
              {/* Title */}
              <TextField
                showLabel
                labelText="Title News"
                mandatory
                placeholder="Input title news"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Rich text editor */}
              <div className="rich-editor">
                <div className="rich-editor__toolbar">

                  {/* Bold */}
                  <button
                    className={`rich-editor__btn ${editor.isActive('bold') ? 'rich-editor__btn--active' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
                    aria-label="Bold" type="button"
                  >
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                      <path d="M2 1h4.5a2.5 2.5 0 0 1 0 5H2V1ZM2 6h5a2.5 2.5 0 0 1 0 5H2V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Italic */}
                  <button
                    className={`rich-editor__btn ${editor.isActive('italic') ? 'rich-editor__btn--active' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
                    aria-label="Italic" type="button"
                  >
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                      <path d="M3 1h4M3 11h4M6 1 4 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {/* Underline */}
                  <button
                    className={`rich-editor__btn ${editor.isActive('underline') ? 'rich-editor__btn--active' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
                    aria-label="Underline" type="button"
                  >
                    <svg width="10" height="13" viewBox="0 0 10 13" fill="none" aria-hidden="true">
                      <path d="M2 1v5a3 3 0 0 0 6 0V1M1 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>

                  <div className="rich-editor__separator" />

                  {/* Align Left */}
                  <button
                    className={`rich-editor__btn ${editor.isActive({ textAlign: 'left' }) ? 'rich-editor__btn--active' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run() }}
                    aria-label="Align left" type="button"
                  >
                    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
                      <path d="M1 1h11M1 5h7M1 9h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {/* Align Center */}
                  <button
                    className={`rich-editor__btn ${editor.isActive({ textAlign: 'center' }) ? 'rich-editor__btn--active' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run() }}
                    aria-label="Align center" type="button"
                  >
                    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
                      <path d="M1 1h11M3 5h7M2 9h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>

                  <div className="rich-editor__separator" />

                  {/* Bullet list */}
                  <button
                    className={`rich-editor__btn ${editor.isActive('bulletList') ? 'rich-editor__btn--active' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
                    aria-label="Bullet list" type="button"
                  >
                    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
                      <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor"/>
                      <circle cx="1.5" cy="5" r="1.5" fill="currentColor"/>
                      <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor"/>
                      <path d="M5 1.5h7M5 5h7M5 8.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {/* Ordered list */}
                  <button
                    className={`rich-editor__btn ${editor.isActive('orderedList') ? 'rich-editor__btn--active' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
                    aria-label="Ordered list" type="button"
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path d="M1 1v3M1 1h1M1 4h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M1 7h2l-2 2.5h2M1 11.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 2.5h6M6 7h6M6 11.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>

                  <div className="rich-editor__separator" />

                  {/* Image upload */}
                  <button
                    className="rich-editor__btn"
                    onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click() }}
                    aria-label="Insert image" type="button"
                  >
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
                      <rect x="1" y="1" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="4.5" cy="4" r="1" fill="currentColor"/>
                      <path d="M1 8l3-3 2.5 2.5L9 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="rich-editor__file-input"
                    onChange={handleImageUpload}
                  />

                </div>

                {/* Tiptap editor area */}
                <EditorContent editor={editor} className="rich-editor__editor-wrap" />
              </div>
            </div>
          </div>

          <hr className="create-page__divider" />

          {/* Action bar */}
          <div className="create-page__action-bar">
            <div className="create-page__right-btns">
              <Button
                variant="Solid"
                size="Medium"
                color="Primary"
                rightIcon={PaperPlaneTilt}
                onClick={handlePublish}
                disabled={publishing || !title.trim()}
              >
                {publishing ? 'Publishing…' : (editId ? 'Save Changes' : 'Publish')}
              </Button>
              <Button variant="Outline" size="Medium" color="Primary">
                Preview
              </Button>
              <Button
                variant="Plain"
                size="Medium"
                color="Secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
