// Simplified Sanity integration without external dependencies

// Mock client for build purposes
export const client = {
  fetch: () => Promise.resolve([]),
}

// Mock functions
export const getBrands = () => Promise.resolve([])
export const getProducts = () => Promise.resolve([])
export const getSolutions = () => Promise.resolve([])
export const getNews = () => Promise.resolve([])

// Mock image URL builder
export const urlFor = (source: any) => ({
  width: (w: number) => ({ url: () => '/placeholder-image.jpg' }),
  height: (h: number) => ({ url: () => '/placeholder-image.jpg' }),
  url: () => '/placeholder-image.jpg'
})

export default client