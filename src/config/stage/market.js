const marketRouter = {
  route: null,
  name: null,
  title: '营销',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-present',
  filePath: 'views/market/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '优惠券',
      type: 'view',
      name: 'couponList',
      route: '/market/coupon/list',
      filePath: 'views/market/coupon/list.vue',
      inNav: true,
      icon: 'el-icon-s-ticket',
      permission: ['查看优惠券']
    }
  ],
}

export default marketRouter
