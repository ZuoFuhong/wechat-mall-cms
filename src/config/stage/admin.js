const adminRouter = {
  route: null,
  name: null,
  title: '管理员/权限',
  type: 'folder',
  icon: 'iconfont icon-huiyuanguanli',
  filePath: 'views/admin/',
  order: null,
  inNav: true,
  permission: ['超级管理员独有权限'],
  children: [
    {
      title: '分组管理',
      type: 'view',
      name: 'group',
      route: '/admin/group/list',
      filePath: 'views/admin/group/list.vue',
      inNav: true,
      icon: 'iconfont icon-huiyuanguanli'
    },
    {
      title: '用户管理',
      type: 'view',
      name: 'user',
      route: '/admin/user/list',
      filePath: 'views/admin/user/list.vue',
      inNav: true,
      icon: 'iconfont icon-huiyuanguanli',
    },
  ],
}

export default adminRouter
