const bannerRouter = {
  route: null,
  name: null,
  title: 'Banner管理',
  type: 'folder',
  icon: 'el-icon-postcard',
  filePath: 'views/banner/',
  order: null,
  inNav: true,
  children: [
    {
      title: 'Banner列表',
      type: 'view',
      name: 'bannerList',
      route: '/banner/list',
      filePath: 'views/banner/BannerList.vue',
      inNav: true,
      icon: 'el-icon-postcard',
    }
  ],
}

export default bannerRouter
