const spuRouter = {
  route: null,
  name: null,
  title: '商品管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-s-shop',
  filePath: 'views/goods/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '商品列表',
      type: 'view',
      name: 'goodsList',
      route: '/goods/list',
      filePath: 'views/goods/GoodsList.vue',
      inNav: true,
      icon: '',
    }
  ],
}

export default spuRouter
