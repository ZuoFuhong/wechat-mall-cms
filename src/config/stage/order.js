const orderRouter = {
  route: null,
  name: null,
  title: '订单',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-s-order',
  filePath: 'views/order/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '订单列表',
      type: 'view',
      name: 'orderList',
      route: '/order/list',
      filePath: 'views/order/list.vue',
      inNav: true,
      icon: '',
    },
    {
      title: '订单详情',
      type: 'view',
      name: 'orderDetail',
      route: '/order/detail/:orderNo',
      filePath: 'views/order/detail.vue',
      inNav: false,
      icon: ''
    },
    {
      title: '退款申请',
      type: 'view',
      name: 'orderRefund',
      route: '/order/list',
      filePath: 'views/order/list.vue',
      inNav: true,
      icon: '',
    }
  ],
}

export default orderRouter
