const specRouter = {
  route: null,
  name: null,
  title: '规格管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-c-scale-to-original',
  filePath: 'views/spec/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加规格名',
      type: 'view',
      name: 'specAdd',
      route: '/spec/add',
      filePath: 'views/spec/SpecAdd.vue',
      inNav: true,
      icon: '',
    },
    {
      title: '规格值详情',
      type: 'view',
      name: 'specEdit',
      route: '/spec/edit/:id',
      filePath: 'views/spec/SpecEdit.vue',
      inNav: false,
      icon: '',
    },
    {
      title: '规格名列表',
      type: 'view',
      name: 'specList',
      route: '/spec/list',
      filePath: 'views/spec/SpecList.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default specRouter
