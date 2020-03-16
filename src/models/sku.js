import { get, post, _delete } from '@/lin/plugins/axios'

class Sku {
  async getSkuList(page, size) {
    return get(`cms/sku/list?page=${page}&size=${size}`)
  }

  async getSku(id) {
    return get(`cms/sku/${id}`)
  }

  async editSku({ id, title, price, code, stock, goodsId, online, picture, specs }) {
    return post('cms/sku/edit', {
      id, title, price, code, stock, goodsId, online, picture, specs
    })
  }

  async deleteSku(id) {
    return _delete(`cms/sku/${id}`)
  }
}

export default new Sku()
