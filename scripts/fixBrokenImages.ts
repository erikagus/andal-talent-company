/**
 * One-time migration: remove broken blob: image URLs from existing posts.
 *
 * Blob URLs (blob:http://...) are temporary and die when the browser tab
 * closes. Any post saved before the Supabase Storage upload fix will have
 * <img src="blob:..."> tags in its content that are permanently unrecoverable.
 *
 * This script removes those broken <img> tags entirely, leaving all other
 * content (text, valid images) intact.
 *
 * Run with:
 *   npx tsx scripts/fixBrokenImages.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ghtveusdadtiobtnakvr.supabase.co'
const SUPABASE_KEY = 'sb_publishable_cvFfl5KidRek3HfJ0g61cQ_CMKPQz7z'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/** Remove every <img> tag whose src starts with "blob:" */
function removeBlobImages(html: string): string {
  // Matches self-closing and non-self-closing img tags with a blob src
  return html.replace(/<img[^>]*src="blob:[^"]*"[^>]*\/?>/gi, '')
}

async function run() {
  console.log('Fetching all posts from Supabase…')

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content')

  if (error) {
    console.error('Failed to fetch posts:', error)
    process.exit(1)
  }

  if (!posts || posts.length === 0) {
    console.log('No posts found.')
    return
  }

  console.log(`Found ${posts.length} post(s). Scanning for blob: images…\n`)

  let fixed = 0

  for (const post of posts) {
    const original: string = post.content ?? ''

    if (!original.includes('blob:')) continue

    const cleaned = removeBlobImages(original)

    if (cleaned === original) continue // nothing changed (blob: was elsewhere, not in img src)

    console.log(`→ Fixing post: "${post.title}" (id: ${post.id})`)

    const { error: updateError } = await supabase
      .from('posts')
      .update({ content: cleaned })
      .eq('id', post.id)

    if (updateError) {
      console.error(`  ✗ Failed to update post ${post.id}:`, updateError)
    } else {
      console.log(`  ✓ Updated successfully`)
      fixed++
    }
  }

  console.log(`\nDone. ${fixed} post(s) cleaned.`)
}

run()
