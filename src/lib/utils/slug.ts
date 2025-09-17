/**
 * Utility functions for handling slugs
 */

/**
 * Clean .txt suffix from slugs
 * This function removes any .txt extension that might be present in slugs
 * to ensure clean URLs are generated.
 *
 * @param slug - The slug to clean
 * @returns The cleaned slug without .txt suffix
 */
export function cleanSlug(slug: string): string {
  if (!slug) return '';
  return slug.replace(/\.txt$/, '');
}

/**
 * Clean .txt suffix from multiple slugs
 *
 * @param slugs - Array of slugs to clean
 * @returns Array of cleaned slugs
 */
export function cleanSlugs(slugs: string[]): string[] {
  return slugs.map(slug => cleanSlug(slug));
}

/**
 * Generate solution URL with clean slug
 *
 * @param locale - The locale (e.g., 'zh-CN', 'en')
 * @param brandSlug - The brand slug
 * @param solutionSlug - The solution slug (will be cleaned)
 * @returns The clean solution URL
 */
export function generateSolutionUrl(locale: string, brandSlug: string, solutionSlug: string): string {
  const cleanBrandSlug = encodeURIComponent(brandSlug);
  const cleanSolutionSlug = cleanSlug(solutionSlug);
  return `/${locale}/brands/${cleanBrandSlug}/solutions/${cleanSolutionSlug}`;
}