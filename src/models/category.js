import { get, post, _delete } from '@/lin/plugins/axios'

class Category {
  async getCategoryList(pid, page, size) {
    return get(`cms/category/list?pid=${pid}&page=${page}&size=${size}`)
  }

  async getAllCategory() {
    return get('cms/category/all')
  }

  async getCategory(id) {
    return get(`cms/category/${id}`)
  }

  async editCategory({ id, parentId, name, sort, online, picture, description }) {
    return post('cms/category/edit', {
      id,
      parentId,
      name,
      sort,
      online,
      picture,
      description,
    })
  }

  async deleteCategory(id) {
    return _delete(`cms/category/${id}`)
  }
}

export default new Category()
