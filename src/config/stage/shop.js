const shopRouter = {
  route: null,
  name: null,
  title: '店铺',
  type: 'folder',
  icon: 'el-icon-s-shop',
  filePath: 'views/banner/',
  order: null,
  inNav: true,
  children: [
    {
      title: 'Banner',
      type: 'view',
      name: 'bannerList',
      route: '/shop/banner/list',
      filePath: 'views/shop/banner/index.vue',
      inNav: true,
      icon: 'el-icon-postcard',
    },
    {
      title: '宫格',
      type: 'view',
      name: 'gridCategory',
      route: '/shop/grid_category/list',
      filePath: 'views/shop/grid_category/index.vue',
      inNav: true,
      icon: 'el-icon-menu',
    }
  ],
}

export default shopRouter
