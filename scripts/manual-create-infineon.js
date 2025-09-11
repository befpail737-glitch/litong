const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
  // 移除token，使用公开访问
})

async function createInfineonData() {
  console.log('准备手动输入的英飞凌品牌数据：')
  console.log('\n=== 英飞凌品牌信息 ===')
  console.log('品牌名称：Infineon')
  console.log('URL标识：infineon')
  console.log('品牌介绍：英飞凌科技股份公司是全球领先的半导体解决方案供应商，致力于让生活更便捷、更安全、更环保。微电子技术是数字化转型的关键驱动力，英飞凌通过产品和解决方案推动这一转型进程，连接现实与数字世界。')
  console.log('官方网站：https://www.infineon.com')
  console.log('国家/地区：DE (德国)')
  console.log('成立年份：1999')
  console.log('总部地址：德国慕尼黑')
  console.log('是否启用：是')
  console.log('是否推荐：是')
  
  console.log('\n=== 英飞凌解决方案信息 ===')
  console.log('标题：英飞凌AURIX微控制器汽车电子解决方案')
  console.log('URL标识：infineon-aurix-automotive-solution')
  console.log('品牌名称：Infineon')
  console.log('方案简介：基于英飞凌AURIX微控制器的汽车电子控制系统解决方案，提供高性能、高可靠性的汽车电子控制。')
  console.log('目标市场：automotive (汽车)')
  console.log('复杂度：complex (复杂)')
  
  console.log('\n=== 方案描述内容 ===')
  console.log('英飞凌AURIX微控制器是专为汽车应用设计的高性能32位微控制器，集成了多个CPU内核、硬件安全模块和丰富的外设接口。')
  console.log('\n主要特性：')
  console.log('• 三个32位TriCore CPU内核，最高频率300MHz')
  console.log('• 集成硬件安全模块（HSM），符合EVITA安全等级')
  console.log('• 丰富的汽车专用外设：CAN-FD、FlexRay、以太网等')
  console.log('• 支持AUTOSAR软件架构')
  
  console.log('\n请在Sanity Studio中手动创建以上内容')
  console.log('1. 访问 http://localhost:3334')
  console.log('2. 选择"品牌（简化版）"创建新品牌')
  console.log('3. 选择"解决方案"创建新解决方案')
}

createInfineonData()