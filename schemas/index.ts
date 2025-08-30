// 产品相关
import productCategory from './productCategory'
import productSubcategory from './productSubcategory'
import product from './product'
import brand from './brand'

// 内容相关
import solution from './solution'
import companyNews from './companyNews'
import industryNews from './industryNews'

// 技术支持
import selectionGuide from './selectionGuide'
import applicationNote from './applicationNote'
import troubleshooting from './troubleshooting'
import productReview from './productReview'

// 作者
import author from './author'

// 通用
import blockContent from './blockContent'

export const schemaTypes = [
  // 产品相关
  productCategory,
  productSubcategory,
  product,
  brand,
  
  // 内容相关
  solution,
  companyNews,
  industryNews,
  
  // 技术支持
  selectionGuide,
  applicationNote,
  troubleshooting,
  productReview,
  
  // 作者
  author,
  
  // 通用
  blockContent,
]