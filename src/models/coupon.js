import { get, post, _delete } from '@/lin/plugins/axios'

class Coupon {
  async getCouponList(page, size) {
    return get(`cms/coupon/list?page=${page}&size=${size}`)
  }

  async editCoupon({ id, title, fullMoney, minus, rate, type, startTime, endTime, description, online }) {
    return post('cms/coupon/edit', {
      id, title, fullMoney, minus, rate, type, startTime, endTime, description, online
    })
  }

  async getCoupon(id) {
    return get(`cms/coupon/${id}`)
  }

  async deleteCoupon(id) {
    return _delete(`cms/coupon/${id}`)
  }
}

export default new Coupon()
