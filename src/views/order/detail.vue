<template>
  <div>
    <el-row>
      <el-steps class="order-steps" :active="orderInfo.status + 1" align-center>
        <el-step title="买家下单" :description="orderInfo.placeTime"></el-step>
        <el-step title="买家付款" :description="payTime"></el-step>
        <el-step title="商家发货" :description="deliverTime"></el-step>
        <el-step title="订单完成" :description="finishTime"></el-step>
      </el-steps>
    </el-row>
    <el-row class="order-info">
      <el-col :span="12" class="left">
        <p class="item"><span class="item-title">订单编号：</span>{{orderInfo.orderNo}}</p>
        <p class="item"><span class="item-title">付款方式：</span>微信支付</p>
        <p class="item"><span class="item-title">买家：</span>{{buyer}}</p>
        <p class="item"><span class="item-title">收货人：</span>{{takeAddress}}</p>
        <p class="item"><span class="item-title">备注：</span>{{orderInfo.remark}}</p>
        <!-- <el-button size="mini" type="primary" class="edit-btn" @click="handleEditAddress">修改订单取货信息</el-button> -->
      </el-col>
      <el-col :span="12" class="right">
        <div v-show="orderInfo.status === 0">
          <p class="order-status"><span class="title">订单状态：</span><span class="status">待付款</span>（等待买家付款）</p>
          <el-button v-auth="['管理订单']" size="mini" type="primary" class="confirm-btn" @click="confirmCollection">确认付款</el-button>
          <!-- <el-button size="mini" type="danger" class="change-price-btn" @click="handleChangePrice">订单改价</el-button> -->
        </div>
        <div v-show="orderInfo.status === 1">
          <p class="order-status"><span class="title">订单状态：</span><span class="status">待发货</span>（买家已经付款，请商家尽快发货）</p>
          <el-button v-auth="['管理订单']" size="mini" type="primary" class="confirm-btn" @click="confirmDelivery">确认发货</el-button>
          <p class="hint">友情提示：如果无法进行发货，请及时联系买家进行妥善处理</p>
        </div>
        <div v-show="orderInfo.status === 2">
          <p class="order-status"><span class="title">订单状态：</span><span class="status">待收货</span>（商家已发货，等待买家收货并交易完成）</p>
          <el-button v-auth="['管理订单']" size="mini" type="primary" class="confirm-btn" @click="confirmReceipt">确认收货</el-button>
          <p class="hint">友情提示： 请及时关注物流状态，确保买家及时收到商品; 如果买家未收到货物或有退换货请求，请及时联系买家妥善处理</p>
        </div>
        <div v-show="orderInfo.status === 3">
          <p class="order-status"><span class="title">订单状态：</span><span class="status">已完成</span></p>
          <p class="hint">友情提示： 交易成功，如买家有售后申请，请与买家进行协商，妥善处理</p>
        </div>
      </el-col>
    </el-row>
    <el-row class="goods-info">
      <p class="title">商品信息</p>
      <el-table
        :data="orderInfo.goodsList"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="商品标题"
          width="350">
          <template slot-scope="scope">
            <img class="image-picture" :src="scope.row.picture" alt="" />
            <p>{{scope.row.title}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="specs"
          label="规格/编号">
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价（元）"
          width="180">
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
          width="180">
        </el-table-column>
        <el-table-column
          :formatter="formatterGoodsAmount"
          prop="amount"
          label="金额（元）"
          width="180">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="order-amount">
      <p class="item"><span class="title">商品：</span>￥{{orderInfo.goodsAmount}}</p>
      <!-- <p class="item"><span class="title">运费：</span>￥{{orderInfo.dispatchAmount}}</p> -->
      <p class="item"><span class="title">优惠额：</span>￥{{orderInfo.discountAmount}}</p>
      <p class="item"><span class="title">合计：</span><span style="color: red;">￥{{orderInfo.payAmount}}</span></p>
    </el-row>
  </div>
</template>

<script>
import order from '@/models/order'

export default {
  data() {
    return {
      orderNo: '',
      tableData: [],
      orderInfo: {
        buyer: {},
        address: {}
      }
    }
  },
  created() {
    this.orderNo = this.$route.params.orderNo
    this.loadOrderDetail()
  },
  computed: {
    buyer() {
      const { buyer } = this.orderInfo
      return buyer.nickname
    },
    takeAddress() {
      const orderAddress = this.orderInfo.address
      return `${orderAddress.provinceStr} ${orderAddress.cityStr} ${orderAddress.areaStr} ${orderAddress.address}, ${orderAddress.contacts}, ${orderAddress.mobile}`
    },
    payTime() {
      return this.orderInfo.status > 0 ? this.orderInfo.payTime : ''
    },
    deliverTime() {
      return this.orderInfo.status > 1 ? this.orderInfo.deliverTime : ''
    },
    finishTime() {
      return this.orderInfo.status > 2 ? this.orderInfo.finishTime : ''
    }
  },
  methods: {
    handleEditAddress() {
      this.dialogTableVisible = true
    },
    formatterGoodsAmount(row) {
      return row.price * row.num
    },
    // 加载订单详情
    async loadOrderDetail() {
      const res = await order.getOrderDetail(this.orderNo)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.orderInfo = res
      }
    },
    async confirmDelivery() {
      this.$confirm('确认已发出物流？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await order.modifyOrderStatus(this.orderNo, 1)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.loadOrderDetail()
        }
      })
    },
    async confirmReceipt() {
      this.$confirm('确认买家已收到商品？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await order.modifyOrderStatus(this.orderNo, 2)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.loadOrderDetail()
        }
      })
    },
    async confirmCollection() {
      this.$confirm('确认已收到买家付款？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await order.modifyOrderStatus(this.orderNo, 3)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.loadOrderDetail()
        }
      })
    },
    handleChangePrice() {
      // todo: 订单改价
    }
  }
}
</script>

<style lang="scss" scoped>
.order-amount {
  margin: 10px 25px;
  .item {
    font-size: 14px;
    line-height: 20px;
    padding-left: 89%;
  }
}
.goods-info {
  margin: 0 25px;
  .title {
    font-size: 20px;
    font-weight: bold;
    line-height: 30rpx;
    padding-bottom: 20px;
  }
  .image-picture {
    max-width: 100px;
    max-height: 50px;
    width: auto;
    height: auto;
  }
}
.order-steps {
  margin-top: 40px;
}
.order-info {
  margin: 25px;
  padding: 30px 20px;
  background-color: #ffffff;
  .left {
    .item {
      font-size: 14px;
      line-height: 28px;
      .item-title {
        color: #999;
      }
    }
    .edit-btn {
      margin-top: 20px;
    }
  }
  .right {
    .order-status {
      font-size: 14px;
      line-height: 28rpx;
      .title {
        color: #999;
      }
      .status {
        font-weight: bold;
        font-size: 20px;
      }
    }
    .confirm-btn {
      margin-top: 50px;
    }
    .hint {
      font-size: 14px;
      color: #999;
      line-height: 28px;
      margin-top: 22px;
    }
  }
}
</style>
