/**
 * This route is responsible for loading Sanity Studio in the browser.
 */

'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}

// Generate static params for static export
export async function generateStaticParams() {
  // Return empty array as this is a catch-all route for the studio
  return []
}