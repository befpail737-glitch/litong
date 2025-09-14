/**
 * This route is responsible for loading Sanity Studio in the browser.
 * Simplified version to ensure static generation works
 */

import StudioClient from './StudioClient'

// Force static generation for this page
export const dynamic = 'force-static'
export const revalidate = false

export default function StudioPage() {
  return <StudioClient />
}

// Generate static params for studio routes - ensure this works with static export
export async function generateStaticParams() {
  console.log('🔧 Generating static params for Studio page')

  // Return comprehensive studio routes for static generation
  const params = [
    { tool: [] }, // /studio
    { tool: ['desk'] }, // /studio/desk (main workspace)
    { tool: ['vision'] }, // /studio/vision (GROQ playground)
  ]

  console.log('🔧 Studio static params:', params)
  return params
}