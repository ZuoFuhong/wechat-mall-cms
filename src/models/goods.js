import { get, post, _delete } from '@/lin/plugins/axios'

class Goods {
  async getGoodsList(page, size) {
    return get(`cms/goods/list?page=${page}&size=${size}`)
  }

  async getGoods(id) {
    return get(`cms/goods/${id}`)
  }

  async editGoods({ id, brandName, title, price, discountPrice, categoryId, online, picture, bannerPicture, detailPicture, tags, description, specList }) {
    return post('cms/goods/edit', {
      id, brandName, title, price, discountPrice, categoryId, online, picture, bannerPicture, detailPicture, tags, description, specList
    })
  }

  async deleteGoods(id) {
    return _delete(`cms/goods/${id}`)
  }

  async getGoodsSpec(id) {
    return get(`cms/goods/spec?id=${id}`)
  }
}

export default new Goods()
