import { post, get, put } from '@/lin/plugins/axios'

const SUPER_VALUE = 1

export default class User {
  // 用户名
  username = null

  // 邮箱
  email = null

  // 手机号
  mobile = null

  // 头像
  avatar = null

  // 权限分组id
  groupId = null

  // 是否为超级管理员
  isSuper = null

  // 昵称
  nickname = null

  // 拥有的权限
  auths = []

  constructor(id, username, email, mobile, avatar, groupId, auths) {
    this.username = username
    this.email = email
    this.mobile = mobile
    this.avatar = avatar
    this.groupId = groupId
    this.isSuper = id === SUPER_VALUE
    this.nickname = username
    this.auths = auths || []
  }

  /**
   * 登陆获取tokens
   * @param {string} username 用户名
   * @param {string} password 密码
   */
  static async getToken(username, password) {
    return post('cms/user/login', {
      username,
      password,
    })
  }

  /**
   * 获取当前用户信息和所拥有的权限
   */
  static async getInformation() {
    const data = await get('cms/user/info')
    const info = data.user
    return new User(info.id, info.username, info.email, info.mobile, info.avatar, info.groupId, data.auths)
  }

  /**
   * 用户修改密码
   * @param {string} newPassword 新密码
   * @param {string} oldPassword 旧密码
   */
  static updatePassword({ oldPassword, newPassword }) {
    return put('cms/user/change_password', {
      newPassword,
      oldPassword,
    })
  }
}
