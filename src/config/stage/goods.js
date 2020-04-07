const spuRouter = {
  route: null,
  name: null,
  title: '商品',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-sell',
  filePath: 'views/goods/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '商品分类',
      type: 'view',
      name: 'goods_category',
      route: '/goods/category/list',
      filePath: 'views/goods/category/list.vue',
      inNav: true,
      icon: '',
    },
    {
      title: '子分类',
      type: 'view',
      name: 'sub_category',
      route: '/goods/sub_category/:id/list',
      filePath: 'views/goods/category/sub_category.vue',
      inNav: false,
      icon: '',
    },
    {
      title: '规格尺寸',
      type: 'view',
      name: 'specList',
      route: '/goods/spec/list',
      filePath: 'views/goods/spec/list.vue',
      inNav: true,
      icon: '',
    },
    {
      title: '编辑规格',
      type: 'view',
      name: 'specEdit',
      route: '/goods/spec/edit/:id',
      filePath: 'views/goods/spec/edit.vue',
      inNav: false,
      icon: '',
    },
    {
      title: '商品管理',
      type: 'view',
      name: 'goodsList',
      route: '/goods/list',
      filePath: 'views/goods/GoodsList.vue',
      inNav: true,
      icon: 'el-icon-sell',
    },
    {
      title: '库存管理',
      type: 'view',
      name: 'skuList',
      route: '/goods/sku/list',
      filePath: 'views/goods/sku/list.vue',
      inNav: true,
      icon: 'el-icon-truck',
    },
  ],
}

export default spuRouter
