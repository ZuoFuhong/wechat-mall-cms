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
      title: '待发货',
      type: 'view',
      name: 'goodsList',
      route: '/order/list',
      filePath: 'views/order/list.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default orderRouter
