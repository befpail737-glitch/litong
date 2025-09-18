/**
 * 专门检查品牌slug是否包含.txt后缀或其他文件扩展名的脚本
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function analyzeBrandSlugs() {
  console.log('🔍 深度分析品牌slug数据...\n');

  try {
    // 获取所有品牌的详细slug信息
    const brandsQuery = `*[_type == "brandBasic"] {
      _id,
      name,
      "slug": slug.current,
      isActive,
      isFeatured,
      _createdAt,
      _updatedAt
    } | order(name asc)`;

    const brands = await client.fetch(brandsQuery);
    console.log(`📊 总品牌数: ${brands.length}\n`);

    // 检查各种潜在问题
    const analysis = {
      totalBrands: brands.length,
      withTxtSuffix: [],
      withOtherExtensions: [],
      withSpecialChars: [],
      withSpaces: [],
      withUpperCase: [],
      duplicateSlugs: {},
      emptyOrNullSlugs: [],
      validSlugs: []
    };

    // 文件扩展名模式
    const fileExtensions = /\.(txt|html|htm|php|asp|jsp|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|tar|gz|jpg|jpeg|png|gif|svg|css|js|json|xml)$/i;
    const txtPattern = /\.txt$/i;
    const specialChars = /[^a-zA-Z0-9\-_\u4e00-\u9fff]/;
    const spaces = /\s/;
    const upperCase = /[A-Z]/;

    brands.forEach(brand => {
      const slug = brand.slug;

      if (!slug || slug === '') {
        analysis.emptyOrNullSlugs.push({
          id: brand._id,
          name: brand.name,
          slug: slug,
          isActive: brand.isActive
        });
        return;
      }

      // 检查.txt后缀
      if (txtPattern.test(slug)) {
        analysis.withTxtSuffix.push({
          id: brand._id,
          name: brand.name,
          slug: slug,
          isActive: brand.isActive
        });
      }

      // 检查其他文件扩展名
      if (fileExtensions.test(slug) && !txtPattern.test(slug)) {
        analysis.withOtherExtensions.push({
          id: brand._id,
          name: brand.name,
          slug: slug,
          extension: slug.match(fileExtensions)[1],
          isActive: brand.isActive
        });
      }

      // 检查特殊字符
      if (specialChars.test(slug)) {
        analysis.withSpecialChars.push({
          id: brand._id,
          name: brand.name,
          slug: slug,
          isActive: brand.isActive
        });
      }

      // 检查空格
      if (spaces.test(slug)) {
        analysis.withSpaces.push({
          id: brand._id,
          name: brand.name,
          slug: slug,
          isActive: brand.isActive
        });
      }

      // 检查大写字母
      if (upperCase.test(slug)) {
        analysis.withUpperCase.push({
          id: brand._id,
          name: brand.name,
          slug: slug,
          isActive: brand.isActive
        });
      }

      // 检查重复slug
      if (analysis.duplicateSlugs[slug]) {
        analysis.duplicateSlugs[slug].push({
          id: brand._id,
          name: brand.name,
          isActive: brand.isActive
        });
      } else {
        analysis.duplicateSlugs[slug] = [{
          id: brand._id,
          name: brand.name,
          isActive: brand.isActive
        }];
      }

      // 如果没有问题，归类为有效slug
      if (!txtPattern.test(slug) &&
          !fileExtensions.test(slug) &&
          !specialChars.test(slug) &&
          !spaces.test(slug)) {
        analysis.validSlugs.push({
          id: brand._id,
          name: brand.name,
          slug: slug,
          isActive: brand.isActive
        });
      }
    });

    // 筛选出真正重复的slug
    const duplicates = {};
    Object.keys(analysis.duplicateSlugs).forEach(slug => {
      if (analysis.duplicateSlugs[slug].length > 1) {
        duplicates[slug] = analysis.duplicateSlugs[slug];
      }
    });
    analysis.duplicateSlugs = duplicates;

    // 输出分析结果
    console.log('📋 品牌SLUG分析报告');
    console.log('=' .repeat(50));

    console.log(`\n✅ 总品牌数: ${analysis.totalBrands}`);
    console.log(`✅ 有效slug数: ${analysis.validSlugs.length}`);

    if (analysis.withTxtSuffix.length > 0) {
      console.log(`\n❌ 包含.txt后缀的品牌 (${analysis.withTxtSuffix.length}):`);
      analysis.withTxtSuffix.forEach(brand => {
        console.log(`   - ${brand.name}: "${brand.slug}" (ID: ${brand.id}, 激活: ${brand.isActive})`);
      });
    } else {
      console.log('\n✅ 没有发现包含.txt后缀的品牌slug');
    }

    if (analysis.withOtherExtensions.length > 0) {
      console.log(`\n⚠️  包含其他文件扩展名的品牌 (${analysis.withOtherExtensions.length}):`);
      analysis.withOtherExtensions.forEach(brand => {
        console.log(`   - ${brand.name}: "${brand.slug}" (.${brand.extension}) (ID: ${brand.id})`);
      });
    } else {
      console.log('\n✅ 没有发现包含其他文件扩展名的品牌slug');
    }

    if (analysis.withSpecialChars.length > 0) {
      console.log(`\n⚠️  包含特殊字符的品牌 (${analysis.withSpecialChars.length}):`);
      analysis.withSpecialChars.forEach(brand => {
        console.log(`   - ${brand.name}: "${brand.slug}" (ID: ${brand.id})`);
      });
    }

    if (analysis.withSpaces.length > 0) {
      console.log(`\n⚠️  包含空格的品牌 (${analysis.withSpaces.length}):`);
      analysis.withSpaces.forEach(brand => {
        console.log(`   - ${brand.name}: "${brand.slug}" (ID: ${brand.id})`);
      });
    }

    if (analysis.withUpperCase.length > 0) {
      console.log(`\n⚠️  包含大写字母的品牌 (${analysis.withUpperCase.length}):`);
      analysis.withUpperCase.forEach(brand => {
        console.log(`   - ${brand.name}: "${brand.slug}" (ID: ${brand.id})`);
      });
    }

    if (Object.keys(analysis.duplicateSlugs).length > 0) {
      console.log(`\n❌ 重复的slug (${Object.keys(analysis.duplicateSlugs).length}):`);
      Object.keys(analysis.duplicateSlugs).forEach(slug => {
        console.log(`   - "${slug}":`);
        analysis.duplicateSlugs[slug].forEach(brand => {
          console.log(`     * ${brand.name} (ID: ${brand.id}, 激活: ${brand.isActive})`);
        });
      });
    } else {
      console.log('\n✅ 没有发现重复的slug');
    }

    if (analysis.emptyOrNullSlugs.length > 0) {
      console.log(`\n❌ 空白或null的slug (${analysis.emptyOrNullSlugs.length}):`);
      analysis.emptyOrNullSlugs.forEach(brand => {
        console.log(`   - ${brand.name}: "${brand.slug}" (ID: ${brand.id})`);
      });
    } else {
      console.log('\n✅ 没有发现空白或null的slug');
    }

    console.log('\n' + '=' .repeat(50));
    console.log('📊 总结:');
    console.log(`   - .txt后缀: ${analysis.withTxtSuffix.length}`);
    console.log(`   - 其他扩展名: ${analysis.withOtherExtensions.length}`);
    console.log(`   - 特殊字符: ${analysis.withSpecialChars.length}`);
    console.log(`   - 包含空格: ${analysis.withSpaces.length}`);
    console.log(`   - 包含大写: ${analysis.withUpperCase.length}`);
    console.log(`   - 重复slug: ${Object.keys(analysis.duplicateSlugs).length}`);
    console.log(`   - 空白slug: ${analysis.emptyOrNullSlugs.length}`);
    console.log(`   - 有效slug: ${analysis.validSlugs.length}`);

    const totalIssues = analysis.withTxtSuffix.length +
                       analysis.withOtherExtensions.length +
                       Object.keys(analysis.duplicateSlugs).length +
                       analysis.emptyOrNullSlugs.length;

    if (totalIssues === 0) {
      console.log('\n🎉 数据质量检查通过！所有品牌slug都符合规范。');
    } else {
      console.log(`\n⚠️  发现 ${totalIssues} 个潜在问题需要关注。`);
    }

    return analysis;

  } catch (error) {
    console.error('❌ 分析品牌slug时出错:', error);
    throw error;
  }
}

// 运行分析
if (require.main === module) {
  analyzeBrandSlugs()
    .then(result => {
      console.log('\n✅ 品牌slug分析完成');
      const totalIssues = result.withTxtSuffix.length +
                         result.withOtherExtensions.length +
                         Object.keys(result.duplicateSlugs).length +
                         result.emptyOrNullSlugs.length;
      process.exit(totalIssues > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { analyzeBrandSlugs };