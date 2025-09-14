/**
 * Client-side Sanity Studio component
 * Simplified for static generation compatibility
 */

'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioClient() {
  console.log('🎨 StudioClient component loaded')
  return <NextStudio config={config} />
}