import { get, post, _delete } from '@/lin/plugins/axios'

class Admin {
  async getGroupList(page, size) {
    return get(`cms/admin/groups?page=${page}&size=${size}`)
  }

  async getGroup(id) {
    return get(`cms/admin/group?id=${id}`)
  }

  async editGroup({ id, name, description, auths }) {
    return post('cms/admin/group', {
      id, name, description, auths
    })
  }

  async deleteGroup(id) {
    return _delete(`cms/admin/group?id=${id}`)
  }

  async getAuthsModule() {
    return get('cms/admin/authority')
  }

  async getUserList(page, size) {
    return get(`cms/admin/users?page=${page}&size=${size}`)
  }

  async getUser(id) {
    return get(`cms/admin/user?id=${id}`)
  }

  async editUser({ id, username, email, mobile, avatar, groupId }) {
    return post('cms/admin/user', {
      id, username, email, mobile, avatar, groupId
    })
  }

  async deleteUser(id) {
    return _delete(`cms/admin/user?id=${id}`)
  }

  async resetPassword(userId, password) {
    return post('cms/admin/reset_password', {
      userId, password
    })
  }
}

export default new Admin()
