import adminConfig from './admin'
import shopConfig from './shop'
import marketConfig from './market'
import goodsConfig from './goods'
import orderConfig from './order'
import pluginsConfig from './plugins'
import Utils from '@/lin/utils/util'

// eslint-disable-next-line import/no-mutable-exports
let homeRouter = [
  {
    title: '首页',
    type: 'view',
    name: Symbol('dashboard'),
    route: '/dashboard',
    filePath: 'views/dashboard/dashboard.vue',
    inNav: true,
    icon: 'el-icon-s-home',
    order: 0,
  },
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/404',
    filePath: 'views/error-page/404.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
  shopConfig,
  goodsConfig,
  orderConfig,
  marketConfig,
  adminConfig,
]

const plugins = [...pluginsConfig]

// 筛除已经被添加的插件
function filterPlugin(data) {
  if (plugins.length === 0) {
    return
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      filterPlugin(item)
    })
  } else {
    const findResult = plugins.findIndex(item => data === item)
    if (findResult >= 0) {
      plugins.splice(findResult, 1)
    }
    if (data.children) {
      filterPlugin(data.children)
    }
  }
}

filterPlugin(homeRouter)

homeRouter = homeRouter.concat(plugins)

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)

// 使用 Symbol 处理 name 字段, 保证唯一性
const deepReduceName = target => {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item)
    })
    return
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      // eslint-disable-next-line no-param-reassign
      target.name = target.name || Utils.getRandomStr()
      // eslint-disable-next-line no-param-reassign
      target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item)
      })
    }
  }
}

deepReduceName(homeRouter)

export default homeRouter
