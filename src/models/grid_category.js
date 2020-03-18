import { get, post, _delete } from '@/lin/plugins/axios'

class GridCategory {
  async getGridCategoryList(page, size) {
    return get(`cms/grid_category/list?page=${page}&size=${size}`)
  }

  async getGridCategory(id) {
    return get(`cms/grid_category/${id}`)
  }

  async editGridCategory({ id, name, categoryId, picture }) {
    const postData = {
      id, name, categoryId, picture
    }
    return post('cms/grid_category/edit', postData)
  }

  async deleteGridCategory(id) {
    return _delete(`cms/grid_category/${id}`)
  }
}

export default new GridCategory()
