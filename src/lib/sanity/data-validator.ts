// 品牌-产品关联数据验证工具
import { client, withRetry } from './client';
import { groq } from 'next-sanity';

export interface DataValidationResult {
  isValid: boolean;
  issues: DataIssue[];
  stats: {
    totalBrands: number;
    activeBrands: number;
    totalProducts: number;
    activeProducts: number;
    validAssociations: number;
    brokenAssociations: number;
  };
}

export interface DataIssue {
  type: 'missing_brand' | 'missing_product' | 'broken_association' | 'inactive_data' | 'duplicate_slug';
  severity: 'error' | 'warning' | 'info';
  message: string;
  details?: any;
}

// 验证品牌-产品关联数据的完整性
export async function validateBrandProductAssociations(): Promise<DataValidationResult> {
  const startTime = Date.now();
  console.log('🔍 [DataValidator] Starting brand-product association validation...');

  const issues: DataIssue[] = [];
  let stats = {
    totalBrands: 0,
    activeBrands: 0,
    totalProducts: 0,
    activeProducts: 0,
    validAssociations: 0,
    brokenAssociations: 0
  };

  try {
    // 1. 检查品牌数据
    console.log('📋 [DataValidator] Checking brand data...');
    const brandsQuery = groq`
      *[_type == "brandBasic"] {
        _id,
        name,
        "slug": slug.current,
        isActive,
        isFeatured
      }
    `;

    const brands = await withRetry(() => client.fetch(brandsQuery), 3, 1000);
    stats.totalBrands = brands.length;
    stats.activeBrands = brands.filter(b => b.isActive).length;

    // 检查品牌slug重复
    const brandSlugs = brands.map(b => b.slug).filter(Boolean);
    const duplicateBrandSlugs = brandSlugs.filter((slug, index) => brandSlugs.indexOf(slug) !== index);
    if (duplicateBrandSlugs.length > 0) {
      issues.push({
        type: 'duplicate_slug',
        severity: 'error',
        message: `发现重复的品牌slug: ${duplicateBrandSlugs.join(', ')}`,
        details: { duplicates: duplicateBrandSlugs }
      });
    }

    // 检查没有slug的品牌
    const brandsWithoutSlug = brands.filter(b => !b.slug);
    if (brandsWithoutSlug.length > 0) {
      issues.push({
        type: 'missing_brand',
        severity: 'error',
        message: `${brandsWithoutSlug.length} 个品牌没有slug`,
        details: { brands: brandsWithoutSlug.map(b => b.name) }
      });
    }

    // 2. 检查产品数据
    console.log('📦 [DataValidator] Checking product data...');
    const productsQuery = groq`
      *[_type == "product"] {
        _id,
        title,
        "slug": slug.current,
        isActive,
        brand,
        "brandSlug": brand->slug.current,
        "brandName": brand->name
      }
    `;

    const products = await withRetry(() => client.fetch(productsQuery), 3, 1000);
    stats.totalProducts = products.length;
    stats.activeProducts = products.filter(p => p.isActive).length;

    // 检查产品slug重复
    const productSlugs = products.map(p => p.slug).filter(Boolean);
    const duplicateProductSlugs = productSlugs.filter((slug, index) => productSlugs.indexOf(slug) !== index);
    if (duplicateProductSlugs.length > 0) {
      issues.push({
        type: 'duplicate_slug',
        severity: 'warning',
        message: `发现重复的产品slug: ${duplicateProductSlugs.slice(0, 5).join(', ')}${duplicateProductSlugs.length > 5 ? '...' : ''}`,
        details: { duplicates: duplicateProductSlugs }
      });
    }

    // 检查没有slug的产品
    const productsWithoutSlug = products.filter(p => !p.slug);
    if (productsWithoutSlug.length > 0) {
      issues.push({
        type: 'missing_product',
        severity: 'error',
        message: `${productsWithoutSlug.length} 个产品没有slug`,
        details: { products: productsWithoutSlug.map(p => p.title) }
      });
    }

    // 3. 检查品牌-产品关联
    console.log('🔗 [DataValidator] Checking brand-product associations...');

    // 没有品牌引用的产品
    const productsWithoutBrand = products.filter(p => !p.brand);
    if (productsWithoutBrand.length > 0) {
      issues.push({
        type: 'broken_association',
        severity: 'error',
        message: `${productsWithoutBrand.length} 个产品没有关联品牌`,
        details: { products: productsWithoutBrand.map(p => p.title) }
      });
      stats.brokenAssociations += productsWithoutBrand.length;
    }

    // 品牌引用无效的产品
    const productsWithBrokenBrand = products.filter(p => p.brand && !p.brandSlug);
    if (productsWithBrokenBrand.length > 0) {
      issues.push({
        type: 'broken_association',
        severity: 'error',
        message: `${productsWithBrokenBrand.length} 个产品的品牌引用无效`,
        details: { products: productsWithBrokenBrand.map(p => ({ title: p.title, brandRef: p.brand })) }
      });
      stats.brokenAssociations += productsWithBrokenBrand.length;
    }

    // 有效关联统计
    const validProducts = products.filter(p => p.brand && p.brandSlug && p.slug);
    stats.validAssociations = validProducts.length;

    // 4. 检查激活状态不一致
    const inactiveProductsInActiveBrands = products.filter(p =>
      p.brandSlug && !p.isActive && brands.find(b => b.slug === p.brandSlug)?.isActive
    );
    if (inactiveProductsInActiveBrands.length > 0) {
      issues.push({
        type: 'inactive_data',
        severity: 'warning',
        message: `${inactiveProductsInActiveBrands.length} 个产品在活跃品牌下但状态为非活跃`,
        details: {
          products: inactiveProductsInActiveBrands.slice(0, 5).map(p => ({
            title: p.title,
            brand: p.brandName
          }))
        }
      });
    }

    // 5. 生成最终验证结果
    const duration = Date.now() - startTime;
    const isValid = issues.filter(i => i.severity === 'error').length === 0;

    console.log(`✅ [DataValidator] Validation completed in ${duration}ms`);
    console.log(`📊 [DataValidator] Stats:`, stats);
    console.log(`🔍 [DataValidator] Found ${issues.length} issues (${issues.filter(i => i.severity === 'error').length} errors)`);

    return {
      isValid,
      issues,
      stats
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [DataValidator] Validation failed after ${duration}ms:`, error);

    issues.push({
      type: 'broken_association',
      severity: 'error',
      message: `数据验证过程出错: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: error instanceof Error ? error.stack : error }
    });

    return {
      isValid: false,
      issues,
      stats
    };
  }
}

// 生成验证报告
export function generateValidationReport(result: DataValidationResult): string {
  const { isValid, issues, stats } = result;

  let report = `\n📊 品牌-产品关联数据验证报告\n`;
  report += `=====================================\n\n`;

  // 总体状态
  report += `🎯 总体状态: ${isValid ? '✅ 通过' : '❌ 失败'}\n\n`;

  // 统计信息
  report += `📈 数据统计:\n`;
  report += `  - 品牌总数: ${stats.totalBrands} (活跃: ${stats.activeBrands})\n`;
  report += `  - 产品总数: ${stats.totalProducts} (活跃: ${stats.activeProducts})\n`;
  report += `  - 有效关联: ${stats.validAssociations}\n`;
  report += `  - 破损关联: ${stats.brokenAssociations}\n\n`;

  // 问题详情
  if (issues.length > 0) {
    report += `🚨 发现的问题 (${issues.length}个):\n`;
    issues.forEach((issue, index) => {
      const emoji = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
      report += `  ${index + 1}. ${emoji} [${issue.severity.toUpperCase()}] ${issue.message}\n`;
    });
  } else {
    report += `✅ 未发现问题\n`;
  }

  return report;
}

// 检查特定品牌-产品组合是否存在
export async function validateSpecificCombination(brandSlug: string, productSlug: string): Promise<{
  exists: boolean;
  brandExists: boolean;
  productExists: boolean;
  associationValid: boolean;
  details?: any;
}> {
  try {
    console.log(`🔍 [DataValidator] Checking specific combination: ${brandSlug}/${productSlug}`);

    const query = groq`{
      "brand": *[_type == "brandBasic" && slug.current == $brandSlug][0] {
        _id,
        name,
        "slug": slug.current,
        isActive
      },
      "product": *[_type == "product" && slug.current == $productSlug][0] {
        _id,
        title,
        "slug": slug.current,
        isActive,
        "brandSlug": brand->slug.current,
        "brandName": brand->name
      }
    }`;

    const result = await withRetry(() => client.fetch(query, { brandSlug, productSlug }), 3, 1000);

    const brandExists = !!result.brand;
    const productExists = !!result.product;
    const associationValid = productExists && result.product.brandSlug === brandSlug;

    return {
      exists: brandExists && productExists && associationValid,
      brandExists,
      productExists,
      associationValid,
      details: {
        brand: result.brand,
        product: result.product
      }
    };

  } catch (error) {
    console.error(`❌ [DataValidator] Error validating combination ${brandSlug}/${productSlug}:`, error);
    return {
      exists: false,
      brandExists: false,
      productExists: false,
      associationValid: false,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}