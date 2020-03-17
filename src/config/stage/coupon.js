const couponRouter = {
  route: null,
  name: null,
  title: '优惠券管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-bank-card',
  filePath: 'views/coupon/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '优惠券列表',
      type: 'view',
      name: 'couponList',
      route: '/coupon/list',
      filePath: 'views/coupon/CouponList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    }
  ],
}

export default couponRouter
