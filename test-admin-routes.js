#!/usr/bin/env node

/**
 * Automated test script to verify admin routes are working correctly
 * Tests all admin routes for 200 status codes
 */

const http = require('http');

const baseUrl = 'http://localhost:3000';
const locale = 'zh';
const testRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/products',
  '/admin/brands', 
  '/admin/articles',
  '/admin/solutions',
  '/admin/news',
  '/admin/users',
  '/admin/settings',
  '/admin/sanity'
];

console.log('🧪 Starting Admin Routes Test...\n');

async function testRoute(path) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/${locale}${path}`;
    
    const req = http.request(url, { method: 'HEAD' }, (res) => {
      const status = res.statusCode;
      const success = status === 200;
      
      console.log(`${success ? '✅' : '❌'} ${url} → ${status}`);
      
      resolve({
        path: url,
        status,
        success
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${url} → ERROR: ${err.message}`);
      resolve({
        path: url,
        status: 0,
        success: false,
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`❌ ${url} → TIMEOUT`);
      resolve({
        path: url,
        status: 0,
        success: false,
        error: 'timeout'
      });
    });

    req.end();
  });
}

async function runTests() {
  const results = [];
  
  for (const route of testRoutes) {
    const result = await testRoute(route);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Routes:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   ${r.path} (${r.error || r.status})`);
    });
    process.exit(1);
  } else {
    console.log('\n🎉 All admin routes are working correctly!');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});