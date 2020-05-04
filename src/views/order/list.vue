<template>
  <div>
    <div class="container">
      <div class="search">
        <el-row>
          <el-form :model="searchForm" status-icon ref="searchForm" label-width="100px" @submit.native.prevent>
            <el-col :lg="4">
              <el-form-item label="订单状态" prop="status">
                <el-select v-model="searchForm.status"  @clear="clearOrderStatus" @clearable="false" placeholder="请选择">
                  <el-option
                    v-for="item in orderStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="10">
              <el-form-item label="交易时间" prop="placeTime">
                <div class="block">
                  <el-date-picker
                    v-model="searchForm.placeTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :lg="6">
              <el-input placeholder="请输入关键字" v-model="searchForm.keyword" maxlength="40" show-word-limit class="input-with-select">
                <el-select style="width: 120px; color: black;" @clear="clearSearchType" @clearable="false" v-model="searchForm.searchType" slot="prepend" placeholder="请选择">
                  <el-option
                  v-for="item in searchTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-input>
            </el-col>
            <el-col :lg="4">
              <div class="btn-group">
                <el-button plain type="primary" @click="handleSearch('searchForm')"><i class="el-icon-search"></i> 搜索</el-button>
                <el-button plain type="primary" @click="doExportExcel('searchForm')"><i class="el-icon-search"></i> 导出</el-button>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <div class="wrap">
        <div class="category-table">
          <el-table
            v-loading="loading"
            stripe
            row-key="id"
            :data="tableData"
            :highlight-current-row="true"
            style="width: 100%"
          >
            <el-table-column prop="orderNo" label="订单号" width="200"> </el-table-column>
            <el-table-column prop="placeTime" label="下单时间" width="180"> </el-table-column>
            <el-table-column prop="address" :formatter="formatAddress" label="买家信息" width="180"> </el-table-column>
            <el-table-column prop="orderAmount" :formatter="formatOrderAmount" label="订单金额（元）" width="150"> </el-table-column>
            <el-table-column prop="payAmount" label="实付金额（元）" width="150"> </el-table-column>
            <el-table-column label="操作" fixed="right" width="120">
              <template slot-scope="scope">
                <el-button plain size="mini" @click="previewOrderDetail(scope.row)" type="primary">查看详情</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" fixed="right" width="200">
              <template slot-scope="scope">
                <div v-show="scope.row.status === 1">
                  <span style="margin-right: 10px; color: #409EFF;">待发货</span>
                  <el-button v-auth="['管理订单']" plain size="mini" @click="confirmDelivery(scope.row)" type="primary">确认发货</el-button>
                </div>
                <div v-show="scope.row.status === 2">
                  <span style="margin-right: 10px; color: #E6A23C;">待收货</span>
                  <el-button v-auth="['管理订单']" plain size="mini" @click="confirmReceipt(scope.row)" type="primary">确认收货</el-button>
                </div>
                <div v-show="scope.row.status === 0">
                  <span style="margin-right: 10px; color: #F56C6C;">待付款</span>
                  <el-button v-auth="['管理订单']" plain size="mini" @click="confirmCollection(scope.row)" type="primary">确认付款</el-button>
                </div>
                <div v-show="scope.row.status === 3">
                  <span style="margin-right: 10px; color: #67C23A;">已完成</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            :page-size="pagination.pageSize ? pagination.pageSize : 10"
            :total="pagination.pageTotal ? pagination.pageTotal : null"
            @current-change="currentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import order from '@/models/order'

export default {
  data() {
    return {
      searchForm: {
        placeTime: [],
        status: 1,
        searchType: 1,
        keyword: ''
      },
      orderStatus: [
        {
          value: 1,
          label: '待发货',
        },
        {
          value: 2,
          label: '待收货'
        },
        {
          value: 0,
          label: '待付款'
        },
        {
          value: 3,
          label: '已完成'
        }
      ],
      searchTypes: [
        {
          value: 1,
          label: '订单号'
        },
        {
          value: 2,
          label: '买家昵称'
        },
        {
          value: 3,
          label: '买家手机'
        },
        {
          value: 4,
          label: '支付单号'
        },
        {
          value: 5,
          label: '商品名称'
        }
      ],
      loading: true,
      tableData: [],
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      }
    }
  },
  created() {
    this.initSearchDate()
    this.loadOrderList(1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
    // 查看订单详情
    previewOrderDetail(row) {
      this.$router.push(`/order/detail/${row.orderNo}`)
    },
    initSearchDate() {
      const startTimeStr = moment().format('YYYY-MM-DD 00:00:00')
      const endTimeStr = moment().format('YYYY-MM-DD 23:59:59')

      const startTime = moment(startTimeStr, 'YYYY-MM-DD HH:mm:ss', true).toDate()
      const endTime = moment(endTimeStr, 'YYYY-MM-DD HH:mm:ss', true).toDate()
      this.searchForm.placeTime = [
        startTime,
        endTime
      ]
    },
    clearOrderStatus() {
      this.searchForm.status = null
    },
    clearSearchType() {
      this.searchForm.searchType = null
    },
    // 搜索订单
    handleSearch() {
      this.loadOrderList(1, this.pagination.pageSize)
    },
    // 加载订单列表
    async loadOrderList(page, size) {
      let startTime = ''
      let endTime = ''
      if (this.searchForm.placeTime !== null) {
        startTime = moment(this.searchForm.placeTime[0]).format('YYYY-MM-DD HH:mm:ss')
        endTime = moment(this.searchForm.placeTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const res = await order.getOrderList({
        status: this.searchForm.status,
        searchType: this.searchForm.searchType,
        keyword: this.searchForm.keyword,
        startTime,
        endTime,
        page,
        size
      })
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    // 导出订单
    async doExportExcel() {
      let startTime = ''
      let endTime = ''
      if (this.searchForm.placeTime !== null) {
        startTime = moment(this.searchForm.placeTime[0]).format('YYYY-MM-DD HH:mm:ss')
        endTime = moment(this.searchForm.placeTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const res = await order.exportOrderExcel({
        status: this.searchForm.status,
        searchType: this.searchForm.searchType,
        keyword: this.searchForm.keyword,
        startTime,
        endTime
      })
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        window.open(res.ossLink)
      }
    },
    // 切换分页
    currentChange(pageNum) {
      this.loadOrderList(pageNum, this.pagination.pageSize)
    },
    async confirmDelivery(row) {
      this.$confirm('确认已发出物流？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await order.modifyOrderStatus(row.orderNo, 1)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.loadOrderList(1, this.pagination.pageSize)
        }
      })
    },
    async confirmReceipt(row) {
      this.$confirm('确认买家已收到商品？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await order.modifyOrderStatus(row.orderNo, 2)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.loadOrderList(1, this.pagination.pageSize)
        }
      })
    },
    async confirmCollection(row) {
      this.$confirm('确认已收到买家付款？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await order.modifyOrderStatus(row.orderNo, 3)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.loadOrderList(1, this.pagination.pageSize)
        }
      })
    },
    formatAddress(row) {
      return `${row.address.contacts}（${row.address.mobile}）`
    },
    formatOrderAmount(row) {
      return row.goodsAmount + row.dispatchAmount
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 200px;
  .wrap {
    padding: 0 20px;
  }
  .search {
    padding: 20px 0px 0px;
    .btn-group {
      display: flex;
      align-items: center;
      margin-left: 20px;
      padding: 4px 0;
    }
  }
}
</style>
