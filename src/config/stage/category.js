const categoryRouter = {
  route: null,
  name: null,
  title: '分类管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-s-grid',
  filePath: 'views/category/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '分类列表',
      type: 'view',
      name: 'categoryList',
      route: '/category/list',
      filePath: 'views/category/CategoryList.vue',
      inNav: true,
      icon: 'el-icon-s-grid',
    },
    {
      title: '子分类列表',
      type: 'view',
      name: 'subCategoryList',
      route: '/sub_category/:id/list',
      filePath: 'views/category/SubCategoryList.vue',
      inNav: false,
      icon: 'el-icon-s-grid',
    },
  ],
}

export default categoryRouter
