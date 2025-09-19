const { createClient } = require('@sanity/client');

// Test the optimized queries directly
const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

// Enhanced retry mechanism with aggressive timeout
async function withRetry(
  fn,
  maxRetries = 2,
  delay = 500,
  timeoutMs = 8000
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), timeoutMs);
      });

      return await Promise.race([fn(), timeoutPromise]);
    } catch (error) {
      console.error(`❌ Attempt ${i + 1}/${maxRetries} failed:`, error.message);

      if (i === maxRetries - 1) {
        console.error(`🚨 All ${maxRetries} attempts failed, throwing error`);
        throw error;
      }

      const currentDelay = delay * Math.pow(2, i);
      console.log(`⏳ Retrying in ${currentDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }
}

async function testOptimizedQueries() {
  console.log('🧪 Testing optimized Sanity queries...');

  try {
    // Test 1: Product combinations with timeout protection
    console.log('\n📦 Testing product combinations query:');
    const startTime1 = Date.now();

    const query1 = `*[_type == "product" && isActive == true && defined(slug.current) && defined(brand->slug.current)] | order(_updatedAt desc) [0...15] {
      "productSlug": slug.current,
      "brandSlug": brand->slug.current
    }`;

    const combinations = await withRetry(() => client.fetch(query1), 2, 500, 8000);
    const duration1 = Date.now() - startTime1;

    console.log(`✅ Product combinations completed in ${duration1}ms`);
    console.log(`   Found ${combinations?.length || 0} combinations`);
    console.log('   Sample:', combinations?.slice(0, 3) || []);

    // Test 2: Solution combinations with timeout protection
    console.log('\n💡 Testing solution combinations query:');
    const startTime2 = Date.now();

    const query2 = `*[_type == "solution" && isPublished == true && defined(slug.current) && defined(primaryBrand->slug.current)] | order(_updatedAt desc) [0...10] {
      "solutionSlug": slug.current,
      "brandSlug": primaryBrand->slug.current
    }`;

    const solutionCombinations = await withRetry(() => client.fetch(query2), 2, 500, 8000);
    const duration2 = Date.now() - startTime2;

    console.log(`✅ Solution combinations completed in ${duration2}ms`);
    console.log(`   Found ${solutionCombinations?.length || 0} combinations`);
    console.log('   Sample:', solutionCombinations?.slice(0, 3) || []);

    // Test 3: Simplified product base query (no complex nested fields)
    console.log('\n🔍 Testing simplified product base query:');
    const startTime3 = Date.now();

    const query3 = `*[_type == "product" && isActive == true] | order(_createdAt desc) [0...5] {
      _id,
      _type,
      partNumber,
      "slug": slug.current,
      title,
      shortDescription,
      image,
      brand->{
        name,
        "slug": slug.current,
        logo
      },
      category->{
        name,
        "slug": slug.current
      },
      isActive,
      isFeatured,
      isNew,
      _createdAt,
      _updatedAt
    }`;

    const products = await withRetry(() => client.fetch(query3), 2, 500, 8000);
    const duration3 = Date.now() - startTime3;

    console.log(`✅ Simplified product query completed in ${duration3}ms`);
    console.log(`   Found ${products?.length || 0} products`);
    console.log('   Sample:', products?.[0] ? {
      id: products[0]._id,
      title: products[0].title,
      partNumber: products[0].partNumber,
      brand: products[0].brand?.name
    } : 'No products');

    console.log('\n🎉 All optimized queries passed!');
    console.log('📊 Performance Summary:');
    console.log(`   Product combinations: ${duration1}ms`);
    console.log(`   Solution combinations: ${duration2}ms`);
    console.log(`   Product base query: ${duration3}ms`);
    console.log(`   Total test time: ${Date.now() - startTime1}ms`);

  } catch (error) {
    console.error('❌ Query test failed:', error);
  }
}

testOptimizedQueries();