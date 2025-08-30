#!/usr/bin/env node

/**
 * Test production admin routes at https://elec-distributor.com
 */

const https = require('https');

const baseUrl = 'https://elec-distributor.com';
const locale = 'zh';
const testRoutes = [
  '/admin/',
  '/admin/dashboard/',
  '/admin/products/',
  '/admin/brands/', 
  '/admin/articles/',
  '/admin/solutions/',
  '/admin/news/',
  '/admin/users/',
  '/admin/settings/',
  '/admin/sanity/'
];

console.log('🧪 Testing Production Admin Routes...\n');
console.log('🌐 Target: https://elec-distributor.com\n');

async function testRoute(path) {
  return new Promise((resolve) => {
    const url = `${baseUrl}/${locale}${path}`;
    
    const req = https.request(url, { 
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      const status = res.statusCode;
      const success = status === 200 || status === 302;
      
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

    req.on('timeout', () => {
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
    
    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n📊 Production Test Summary:');
  console.log('============================');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Working: ${passed}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log(`📊 Total:   ${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Routes:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   ${r.path} → ${r.error || r.status}`);
    });
  }
  
  console.log('\n📋 Detailed Results:');
  results.forEach(r => {
    const statusText = r.error ? `ERROR: ${r.error}` : r.status;
    console.log(`   ${r.success ? '✅' : '❌'} ${r.path} → ${statusText}`);
  });
  
  return results;
}

// Run tests
runTests().then(results => {
  const failed = results.filter(r => !r.success).length;
  process.exit(failed > 0 ? 1 : 0);
}).catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});