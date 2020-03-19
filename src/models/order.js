import { get } from '@/lin/plugins/axios'

class Order {
  async getOrderStatement(page, size) {
    return get(`cms/order/order_statement?page=${page}&size=${size}`)
  }
}

export default new Order()
