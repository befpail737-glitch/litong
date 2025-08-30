#!/usr/bin/env node

/**
 * Monitor and verify production admin panel fixes
 */

const https = require('https');

const baseUrl = 'https://elec-distributor.com';
const testRoutes = [
  { path: '/zh/admin/', name: 'Admin Login' },
  { path: '/zh/admin/dashboard/', name: 'Dashboard' },
  { path: '/zh/admin/products/', name: 'Products' },
  { path: '/zh/admin/brands/', name: 'Brands' }
];

console.log('🔍 Verifying Production Admin Panel Fixes...\n');
console.log('🌐 Target: https://elec-distributor.com\n');

async function checkNavigation(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { 
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        // Check if navigation contains locale-prefixed links
        const hasLocalePrefixedNav = data.includes('href="/zh/admin/dashboard"') || 
                                     data.includes('href="/zh/admin/products"') ||
                                     data.includes('href="/zh/admin/brands"');
        
        resolve({
          status: res.statusCode,
          hasCorrectNav: hasLocalePrefixedNav,
          data: data.substring(0, 1000) // First 1000 chars for debugging
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, error: err.message, hasCorrectNav: false });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ status: 0, error: 'timeout', hasCorrectNav: false });
    });

    req.end();
  });
}

async function verifyFix() {
  console.log('⏳ Checking if navigation links are fixed...\n');
  
  for (const route of testRoutes) {
    const url = `${baseUrl}${route.path}`;
    console.log(`🔍 Testing ${route.name}...`);
    
    const result = await checkNavigation(url);
    
    if (result.status === 200) {
      if (result.hasCorrectNav) {
        console.log(`✅ ${route.name} - Navigation FIXED (locale prefixes found)`);
      } else {
        console.log(`❌ ${route.name} - Navigation NOT YET FIXED (old navigation found)`);
        if (result.data) {
          console.log(`   Sample HTML: ${result.data.substring(0, 200)}...`);
        }
      }
    } else {
      console.log(`❌ ${route.name} - HTTP ${result.status} ${result.error || ''}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🔄 Deployment may still be in progress...');
  console.log('📝 If navigation is not yet fixed, please wait a few minutes for Cloudflare Pages to deploy the changes.');
}

// Run verification
verifyFix().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});