import { getSolution, getSolutions } from './queries';

export async function getSolutionBySlug(slug: string) {
  try {
    return await getSolution(slug);
  } catch (error) {
    console.error(`Error fetching solution by slug "${slug}":`, error);
    return null;
  }
}

export async function getAllSolutions() {
  try {
    const result = await getSolutions({ limit: 1000 });
    return result.solutions || [];
  } catch (error) {
    console.error('Error fetching all solutions:', error);
    return [];
  }
}

export { getSolution, getSolutions } from './queries';