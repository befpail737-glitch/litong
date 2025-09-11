// 导入所有schema类型
import { product } from './product'
// import { brand } from './brand' // 暂时移除，避免useHook错误
// import { brandSimple } from './brand-simple' // 暂时移除，避免useHook错误
// import { brandMinimal } from './brand-minimal' // 暂时移除，避免useHook错误
import { brandBasic } from './brand-basic'
import { productCategory } from './productCategory'
import { productSubcategory } from './productSubcategory'
import { article } from './article'
import { author } from './author'
import { articleCategory } from './articleCategory'
import { solution } from './solution'
import { industry } from './industry'
import { application } from './application'
import { inquiry } from './inquiry'
import { quote } from './quote'
import company from './company'

// 导出所有schema类型
export const schemaTypes = [
  // 产品相关
  product,
  // brand, // 暂时移除复杂版品牌，避免useHook错误
  // brandSimple, // 暂时移除简化版品牌，避免useHook错误
  // brandMinimal, // 暂时移除最简版品牌，避免useHook错误
  brandBasic, // 使用基础版品牌
  productCategory,
  productSubcategory,
  
  // 内容相关
  article,
  author,
  articleCategory,
  
  // 解决方案相关
  solution,
  industry,
  application,
  
  // 业务相关
  inquiry,
  quote,
  
  // 公司相关
  company,
]