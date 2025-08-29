/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under `/studio` will be handled by this file using Next.js' optional catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
 *
 * You can learn more about the Sanity Studio here:
 * https://www.sanity.io/docs/sanity-studio
 */

import { NextStudioHead } from 'next-sanity/studio/head'
import { NextStudio } from 'next-sanity/studio'
import { metadata } from 'next-sanity/studio/metadata'
import config from '../../../../sanity.config'

export { metadata }

export default function StudioPage() {
  return <NextStudio config={config} />
}

export function Head() {
  return <NextStudioHead />
}