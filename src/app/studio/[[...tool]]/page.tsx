/**
 * This route is responsible for loading Sanity Studio in the browser.
 * Server component wrapper for client-side Studio
 */

import dynamic from 'next/dynamic'

// Dynamically import the client component to avoid SSR issues
const StudioClient = dynamic(() => import('./StudioClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Sanity Studio...</p>
      </div>
    </div>
  )
})

export default function StudioPage() {
  return <StudioClient />
}

// Generate static params for studio routes
export async function generateStaticParams() {
  // Return basic studio routes for static generation
  return [
    { tool: [] }, // /studio
    { tool: ['desk'] }, // /studio/desk
  ]
}