#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to simplify generateStaticParams
const filesToSimplify = [
  'src/app/[locale]/brands/[slug]/products/[id]/page.tsx',
  'src/app/[locale]/brands/[slug]/solutions/[id]/page.tsx',
  'src/app/[locale]/brands/[slug]/products/page.tsx',
  'src/app/[locale]/brands/[slug]/solutions/page.tsx',
  'src/app/[locale]/brands/[slug]/support/page.tsx',
  'src/app/[locale]/products/[slug]/page.tsx',
  'src/app/[locale]/solutions/[slug]/page.tsx'
];

function simplifyGenerateStaticParams(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Find and replace complex generateStaticParams with emergency version
  const newGenerateStaticParams = `// Emergency模式：禁用复杂静态生成
export async function generateStaticParams() {
  console.log('🚨 Emergency mode: skipping static generation for', __filename);
  return []; // 让页面变为动态路由
}`;

  // Replace the function using regex
  const regex = /export async function generateStaticParams\(\)[^}]*{[\s\S]*?^}/m;

  if (content.match(regex)) {
    content = content.replace(regex, newGenerateStaticParams);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Simplified: ${filePath}`);
  } else {
    console.log(`⚠️ No generateStaticParams found in: ${filePath}`);
  }
}

console.log('🚨 Emergency simplification starting...');

filesToSimplify.forEach(file => {
  const fullPath = path.join(__dirname, file);
  simplifyGenerateStaticParams(fullPath);
});

console.log('🚨 Emergency simplification completed!');