import { post, get, _delete } from '@/lin/plugins/axios'

class Banner {
  async getBannerList(page, size) {
    return get(`cms/banner/list?page=${page}&size=${size}`)
  }

  async getBanner(id) {
    return get(`cms/banner/${id}`)
  }

  async addBanner({ picture, name, title, description }) {
    return post('/cms/banner/edit', {
      picture,
      name,
      title,
      description,
    })
  }

  async updateBanner({ id, picture, name, title, description }) {
    return post('/cms/banner/edit', {
      id,
      picture,
      name,
      title,
      description,
    })
  }

  async deleteBanner(id) {
    return _delete(`cms/banner/${id}`)
  }
}

export default new Banner()
