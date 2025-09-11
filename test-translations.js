const fs = require('fs');
const path = require('path');

const messagesDir = './messages';
const files = fs.readdirSync(messagesDir);
const results = {};

console.log('Testing translation files...\n');

files.forEach(file => {
  if (file.endsWith('.json')) {
    const locale = path.basename(file, '.json');
    try {
      const content = fs.readFileSync(path.join(messagesDir, file), 'utf8');
      const parsed = JSON.parse(content);
      
      // 检查基本结构
      const sections = ['common', 'navigation', 'home', 'brands', 'products', 'solutions', 'contact', 'inquiry'];
      const missingSections = sections.filter(section => !parsed[section]);
      
      // 检查关键字段
      const commonKeys = ['home', 'about', 'contact', 'brands', 'search', 'inquiry'];
      const missingKeys = commonKeys.filter(key => !parsed.common || !parsed.common[key]);
      
      results[locale] = {
        status: 'valid',
        sections: Object.keys(parsed).length,
        missingSections,
        missingKeys,
        totalKeys: countKeys(parsed)
      };
      
      console.log(`✓ ${locale}: ${results[locale].totalKeys} keys, ${results[locale].sections} sections`);
      
      if (missingSections.length > 0) {
        console.log(`   Warning: Missing sections: ${missingSections.join(', ')}`);
      }
      if (missingKeys.length > 0) {
        console.log(`   Warning: Missing common keys: ${missingKeys.join(', ')}`);
      }
      
    } catch (error) {
      results[locale] = { status: 'error', error: error.message };
      console.log(`✗ ${locale}: ${error.message}`);
    }
  }
});

function countKeys(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeys(obj[key]);
    } else {
      count++;
    }
  }
  return count;
}

console.log('\nSummary:');
const validFiles = Object.values(results).filter(r => r.status === 'valid').length;
const totalFiles = Object.keys(results).length;
console.log(`Valid files: ${validFiles}/${totalFiles}`);

if (validFiles === totalFiles) {
  console.log('All translation files are valid!');
} else {
  console.log('Some files have issues');
}

// 比较翻译完整性
const baseLocale = 'zh-CN';
if (results[baseLocale] && results[baseLocale].status === 'valid') {
  console.log('\nTranslation completeness check:');
  const baseContent = JSON.parse(fs.readFileSync(path.join(messagesDir, `${baseLocale}.json`), 'utf8'));
  
  Object.keys(results).forEach(locale => {
    if (locale !== baseLocale && results[locale].status === 'valid') {
      const localeContent = JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf8'));
      const completeness = calculateCompleteness(baseContent, localeContent);
      console.log(`${locale}: ${completeness.toFixed(1)}% complete`);
    }
  });
}

function calculateCompleteness(base, target) {
  let totalKeys = 0;
  let translatedKeys = 0;
  
  function compare(baseObj, targetObj, path = '') {
    for (const key in baseObj) {
      const currentPath = path ? `${path}.${key}` : key;
      if (typeof baseObj[key] === 'object' && baseObj[key] !== null) {
        compare(baseObj[key], targetObj[key] || {}, currentPath);
      } else {
        totalKeys++;
        if (targetObj[key] && targetObj[key].trim()) {
          translatedKeys++;
        }
      }
    }
  }
  
  compare(base, target);
  return totalKeys > 0 ? (translatedKeys / totalKeys) * 100 : 0;
}