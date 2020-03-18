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
      icon: 'el-icon-s-shop',
    },
    {
      title: '新增商品',
      type: 'view',
      name: 'addGoods',
      route: '/goods/add',
      filePath: 'views/goods/GoodsEdit.vue',
      inNav: true,
      icon: 'el-icon-s-shop',
    }
  ],
}

export default spuRouter
