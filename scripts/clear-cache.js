const fs = require('fs')
const path = require('path')

function deleteDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
    console.log(`✅ Deleted ${dir}`)
  } else {
    console.log(`ℹ️  ${dir} does not exist`)
  }
}

console.log('🧹 Clearing Next.js caches...')

// 清除 .next 目录
deleteDirectory(path.join(__dirname, '..', '.next'))

// 清除 node_modules/.cache 目录  
deleteDirectory(path.join(__dirname, '..', 'node_modules', '.cache'))

console.log('✅ Cache cleared! Please restart your development server.')
console.log('Run: npm run dev')