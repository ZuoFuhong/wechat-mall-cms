<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">
          <span>优惠券列表</span>
          <el-button type="primary" plain style="margin-left: 30px;" @click="addCoupon">添加优惠券</el-button>
        </div>
      </div>
      <div class="banner-table">
        <el-table
          v-loading="loading"
          stripe
          row-key="id"
          :data="tableData"
          :highlight-current-row="true"
          style="width: 100%"
        >
          <el-table-column prop="id" label="id" width="80"> </el-table-column>
          <el-table-column prop="title" label="标题" width="200"> </el-table-column>
          <el-table-column prop="type" :formatter="formatCouponType" label="券类型" width="150"> </el-table-column>
          <el-table-column prop="fullMoney" :formatter="formatFullMoney" label="满减额（元）" width="150"> </el-table-column>
          <el-table-column prop="discountAmount" :formatter="formatterDiscountAmount" label="优惠额" width="150"> </el-table-column>
          <el-table-column prop="online" :formatter="formatOnlineStatus" label="是否上架" width="150"> </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="180"> </el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="180"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="175">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="handleEdit(scope.row)" type="primary">查看</el-button>
              <el-button plain size="mini" @click="handleDelete(scope.row)" type="danger">删除</el-button>
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
    <coupon-edit v-else @editClose="editClose" :couponId="couponId"></coupon-edit>
  </div>
</template>

<script>
import coupon from '@/models/coupon'
import CouponEdit from './CouponEdit'

export default {
  components: {
    CouponEdit
  },
  data() {
    return {
      tableColumn: [
        { prop: 'id', label: 'id' },
        { prop: 'title', label: '标题' },
        { prop: 'type', label: '券类型' },
        { prop: 'fullMoney', label: '满减额' },
        { prop: 'discountAmount', label: '优惠额' },
        { prop: 'online', label: '是否上架' },
        { prop: 'startTime', label: '开始时间' },
        { prop: 'endTime', label: '结束时间' },
      ],
      tableData: [],
      loading: true,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      showEdit: false,
      couponId: 0
    }
  },
  async created() {
    await this.getCouponList(1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
    async getCouponList(page, size) {
      const res = await coupon.getCouponList(page, size)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    handleEdit(val) {
      this.couponId = val.id
      this.showEdit = true
    },
    addCoupon() {
      this.couponId = 0
      this.showEdit = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await coupon.deleteCoupon(val.id)
        if (res.error_code === undefined) {
          this.getCouponList(1, this.pagination.pageSize)
          this.$message({
            type: 'success',
            message: '删除成功！',
          })
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    },
    formatFullMoney(row) {
      let fullMoney = 0.00
      switch (row.type) {
        case 1:
          fullMoney = row.fullMoney.toString()
          break
        case 2:
          fullMoney = 0.00
          break
        case 3:
          fullMoney = 0.00
          break
        case 4:
          fullMoney = row.fullMoney.toString()
          break
        default:
          fullMoney = 0.00
      }
      return fullMoney
    },
    formatCouponType(row) {
      let couponType = '-'
      switch (row.type) {
        case 1:
          couponType = '满减券'
          break
        case 2:
          couponType = '折扣券'
          break
        case 3:
          couponType = '无门槛券'
          break
        case 4:
          couponType = '满减折扣券'
          break
        default:
          couponType = ''
      }
      return couponType
    },
    formatterDiscountAmount(row) {
      let discountAmount = ''
      switch (row.type) {
        case 1:
          discountAmount = `${row.minus}元`
          break
        case 2:
          discountAmount = `${row.rate * 10}折`
          break
        case 3:
          discountAmount = `${row.minus}元`
          break
        case 4:
          discountAmount = `${row.rate * 10}折`
          break
        default:
          discountAmount = ''
      }
      return discountAmount
    },
    formatOnlineStatus(row) {
      return row.online === 1 ? '上架' : '下架'
    },
    currentChange() {
      this.getCouponList(1, this.pagination.pageSize)
    },
    editClose() {
      this.showEdit = false
      this.getCouponList(1, this.pagination.pageSize)
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      font-size: 16px;
      font-weight: 500;
      color: $parent-title-color;
    }
    .plus {
      -webkit-box-align: center;
      align-items: center;
    }
  }
  .banner-table {
    position: relative;

    .bannerPicture {
      max-width: 100px;
      max-height: 50px;
      width: auto;
      height: auto;
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-right: -10px;
      margin-top: 15px;
    }
  }
}
</style>
