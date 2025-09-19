const { createClient } = require('@sanity/client');

// Create a direct client to test Sanity connection
const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false // Ensure we get the latest data
});

async function diagnoseData() {
  console.log('🔍 Starting Sanity data diagnosis...');

  try {
    // Test 1: Check total document counts
    console.log('\n📊 Document Counts:');
    const stats = await client.fetch(`{
      "totalProducts": count(*[_type == "product"]),
      "publishedProducts": count(*[_type == "product" && !(_id in path("drafts.**"))]),
      "activeProducts": count(*[_type == "product" && !(_id in path("drafts.**")) && isActive == true]),
      "productsWithBrands": count(*[_type == "product" && !(_id in path("drafts.**")) && defined(brand)]),
      "productsWithSlugs": count(*[_type == "product" && !(_id in path("drafts.**")) && defined(slug.current)]),
      "totalBrands": count(*[_type == "brandBasic"]),
      "activeBrands": count(*[_type == "brandBasic" && isActive == true]),
      "brandsWithSlugs": count(*[_type == "brandBasic" && defined(slug.current)]),
      "totalSolutions": count(*[_type == "solution"]),
      "publishedSolutions": count(*[_type == "solution" && isPublished == true])
    }`);
    console.log(stats);

    // Test 2: Get sample products
    console.log('\n🔍 Sample Products:');
    const products = await client.fetch(`
      *[_type == "product" && !(_id in path("drafts.**"))][0...5] {
        _id,
        partNumber,
        title,
        "slug": slug.current,
        isActive,
        "brand": brand->name,
        "brandSlug": brand->slug.current,
        _createdAt
      }
    `);
    console.log('Found products:', products?.length || 0);
    products?.forEach((p, i) => {
      console.log(`  ${i+1}. ${p.title || p.partNumber} (${p.slug}) - Brand: ${p.brand} (${p.brandSlug}) - Active: ${p.isActive}`);
    });

    // Test 3: Get sample brands
    console.log('\n🏢 Sample Brands:');
    const brands = await client.fetch(`
      *[_type == "brandBasic"][0...10] {
        _id,
        name,
        "slug": slug.current,
        isActive,
        isFeatured,
        _createdAt
      }
    `);
    console.log('Found brands:', brands?.length || 0);
    brands?.forEach((b, i) => {
      console.log(`  ${i+1}. ${b.name} (${b.slug}) - Active: ${b.isActive} - Featured: ${b.isFeatured}`);
    });

    // Test 4: Check brand-product associations
    console.log('\n🔗 Brand-Product Associations:');
    const associations = await client.fetch(`
      *[_type == "product" && !(_id in path("drafts.**")) && defined(brand) && defined(slug.current)][0...10] {
        "productSlug": slug.current,
        "brandSlug": brand->slug.current,
        "productName": title,
        "brandName": brand->name,
        isActive
      }
    `);
    console.log('Found associations:', associations?.length || 0);
    associations?.forEach((a, i) => {
      console.log(`  ${i+1}. Product: ${a.productName} (${a.productSlug}) -> Brand: ${a.brandName} (${a.brandSlug}) - Active: ${a.isActive}`);
    });

    // Test 5: Check solutions
    console.log('\n💡 Sample Solutions:');
    const solutions = await client.fetch(`
      *[_type == "solution"][0...5] {
        _id,
        title,
        "slug": slug.current,
        isPublished,
        "primaryBrand": primaryBrand->name,
        "primaryBrandSlug": primaryBrand->slug.current,
        _createdAt
      }
    `);
    console.log('Found solutions:', solutions?.length || 0);
    solutions?.forEach((s, i) => {
      console.log(`  ${i+1}. ${s.title} (${s.slug}) - Brand: ${s.primaryBrand} (${s.primaryBrandSlug}) - Published: ${s.isPublished}`);
    });

    console.log('\n✅ Diagnosis complete!');

  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  }
}

diagnoseData();