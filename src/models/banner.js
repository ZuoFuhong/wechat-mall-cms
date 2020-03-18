import { post, get, _delete } from '@/lin/plugins/axios'

class Banner {
  async getBannerList(page, size) {
    return get(`cms/banner/list?page=${page}&size=${size}`)
  }

  async getBanner(id) {
    return get(`cms/banner/${id}`)
  }

  async addBanner({ picture, title, description }) {
    return post('/cms/banner/edit', {
      picture,
      title,
      description,
    })
  }

  async updateBanner({ id, picture, title, description }) {
    return post('/cms/banner/edit', {
      id,
      picture,
      title,
      description,
    })
  }

  async deleteBanner(id) {
    return _delete(`cms/banner/${id}`)
  }
}

export default new Banner()
