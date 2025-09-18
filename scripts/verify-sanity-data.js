/**
 * Verify Sanity CMS data for .txt suffixes in solution slugs
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function verifyDataIntegrity() {
  console.log('🔍 Verifying Sanity CMS data integrity...\n');

  try {
    // Check for solution slugs with .txt suffixes
    const solutionsQuery = `*[_type == "solution" && defined(slug.current)] {
      _id,
      title,
      "slug": slug.current
    }`;

    const solutions = await client.fetch(solutionsQuery);
    console.log(`📊 Found ${solutions.length} solutions total`);

    // Check for .txt suffixes
    const solutionsWithTxt = solutions.filter(solution =>
      solution.slug && solution.slug.includes('.txt')
    );

    if (solutionsWithTxt.length > 0) {
      console.log(`❌ Found ${solutionsWithTxt.length} solutions with .txt suffixes:`);
      solutionsWithTxt.forEach(solution => {
        console.log(`   - ${solution.title}: ${solution.slug} (ID: ${solution._id})`);
      });
    } else {
      console.log('✅ No solutions found with .txt suffixes');
    }

    // Check brands
    const brandsQuery = `*[_type == "brandBasic" && defined(slug.current)] {
      _id,
      name,
      "slug": slug.current
    }`;

    const brands = await client.fetch(brandsQuery);
    console.log(`\n📊 Found ${brands.length} brands total`);

    const brandsWithTxt = brands.filter(brand =>
      brand.slug && brand.slug.includes('.txt')
    );

    if (brandsWithTxt.length > 0) {
      console.log(`❌ Found ${brandsWithTxt.length} brands with .txt suffixes:`);
      brandsWithTxt.forEach(brand => {
        console.log(`   - ${brand.name}: ${brand.slug} (ID: ${brand._id})`);
      });
    } else {
      console.log('✅ No brands found with .txt suffixes');
    }

    // Check products
    const productsQuery = `*[_type == "product" && defined(slug.current)] {
      _id,
      title,
      "slug": slug.current
    }`;

    const products = await client.fetch(productsQuery);
    console.log(`\n📊 Found ${products.length} products total`);

    const productsWithTxt = products.filter(product =>
      product.slug && product.slug.includes('.txt')
    );

    if (productsWithTxt.length > 0) {
      console.log(`❌ Found ${productsWithTxt.length} products with .txt suffixes:`);
      productsWithTxt.forEach(product => {
        console.log(`   - ${product.title}: ${product.slug} (ID: ${product._id})`);
      });
    } else {
      console.log('✅ No products found with .txt suffixes');
    }

    // Summary
    const totalTxtItems = solutionsWithTxt.length + brandsWithTxt.length + productsWithTxt.length;

    console.log(`\n📋 SUMMARY:`);
    console.log(`   Solutions with .txt: ${solutionsWithTxt.length}`);
    console.log(`   Brands with .txt: ${brandsWithTxt.length}`);
    console.log(`   Products with .txt: ${productsWithTxt.length}`);
    console.log(`   Total items with .txt: ${totalTxtItems}`);

    if (totalTxtItems === 0) {
      console.log('\n✅ Data integrity check passed! No .txt suffixes found in CMS data.');
    } else {
      console.log('\n❌ Data integrity issues found. Consider cleaning the affected items.');
    }

    return {
      solutions: solutionsWithTxt,
      brands: brandsWithTxt,
      products: productsWithTxt,
      total: totalTxtItems
    };

  } catch (error) {
    console.error('❌ Error verifying data integrity:', error);
    throw error;
  }
}

// Run the verification
if (require.main === module) {
  verifyDataIntegrity()
    .then(result => {
      process.exit(result.total > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyDataIntegrity };