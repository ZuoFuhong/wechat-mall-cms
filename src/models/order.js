import { get, put } from '@/lin/plugins/axios'

class Order {
  async getOrderStatement(page, size) {
    return get(`cms/order/order_statement?page=${page}&size=${size}`)
  }

  // 查询订单列表, -999 表示全部
  async getOrderList({ status, searchType, keyword, startTime, endTime, page, size }) {
    return get(`cms/order/list?status=${status}&stype=${searchType}&k=${keyword}&st=${startTime}&et=${endTime}&p=${page}&s=${size}`)
  }

  async getOrderDetail(orderNo) {
    return get(`cms/order?orderNo=${orderNo}`)
  }

  async exportOrderExcel({ status, searchType, keyword, startTime, endTime }) {
    return get(`cms/order/export?status=${status}&stype=${searchType}&k=${keyword}&st=${startTime}&et=${endTime}`)
  }

  // 更新订单状态
  async modifyOrderStatus(orderNo, otype) {
    return put('cms/order/modify_status', {
      orderNo,
      otype
    })
  }

  // 修改订单备注
  async modifyOrderRemark(orderNo, remark) {
    return put('cms/order/modify_remark', {
      orderNo,
      remark
    })
  }

  // 订单-商品改价
  async modifyOrderGoods(orderNo, goodsId, price) {
    return put('cms/order/modify_goods', {
      orderNo,
      goodsId,
      price
    })
  }
}

export default new Order()
