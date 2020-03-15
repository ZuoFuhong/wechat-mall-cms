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
      icon: '',
    },
    {
      title: '添加Banner',
      type: 'view',
      name: 'bannerAdd',
      route: '/banner/add',
      filePath: 'views/banner/BannerAdd.vue',
      inNav: true,
      icon: '',
    },
    {
      title: '编辑Banner',
      type: 'view',
      name: 'bannerEdit',
      route: '/banner/edit/:id',
      filePath: 'views/banner/BannerEdit.vue',
      inNav: false,
      icon: '',
    },
  ],
}

export default bannerRouter
