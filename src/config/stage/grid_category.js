const gridCategoryRouter = {
  route: null,
  name: null,
  title: '宫格管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-s-data',
  filePath: 'views/grid_category/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '宫格列表',
      type: 'view',
      name: 'categoryList',
      route: '/grid_category/list',
      filePath: 'views/grid_category/GridCategoryList.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default gridCategoryRouter
