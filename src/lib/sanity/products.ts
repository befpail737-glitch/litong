import { getProduct, getProducts } from './queries';

export async function getProductBySlug(slug: string) {
  try {
    return await getProduct(slug);
  } catch (error) {
    console.error(`Error fetching product by slug "${slug}":`, error);
    return null;
  }
}

export async function getAllProducts() {
  try {
    const result = await getProducts({ limit: 1000 });
    return result.products || [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

export { getProduct, getProducts } from './queries';