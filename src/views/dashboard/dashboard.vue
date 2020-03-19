<template>
  <div class="container">
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ display: 'flex', cursor: 'pointer'}" @click.native="handleClick(1)">
          <div class="card-left">
            <p style="font-size: 50px;">
              <i class="el-icon-user-solid" style="color: #4b7bf7;"></i>
            </p>
          </div>
          <div class="column-box"></div>
          <div class="card-right">
            <p>今日访客</p>
            <p style="font-weight:bold;">{{ marketMetrics.visitorNum }}</p>
          </div>
        </el-card>
      </el-col>
            <el-col :span="6">
        <el-card shadow="hover" :body-style="{ display: 'flex', cursor: 'pointer'}" @click.native="handleClick(2)">
          <div class="card-left">
            <p style="font-size: 50px;">
              <i class="el-icon-s-shop" style="color: #4b7bf7;"></i>
            </p>
          </div>
          <div class="column-box"></div>
          <div class="card-right">
            <p>已售罄的商品</p>
            <p style="font-weight:bold;">{{ marketMetrics.sellOutSKUNum }}</p>
          </div>
        </el-card>
      </el-col>
            <el-col :span="6">
        <el-card shadow="hover" :body-style="{ display: 'flex', cursor: 'pointer'}" @click.native="handleClick(3)">
          <div class="card-left">
            <p style="font-size: 50px;">
              <i class="el-icon-s-order" style="color: #4b7bf7;"></i>
            </p>
          </div>
          <div class="column-box"></div>
          <div class="card-right">
            <p>待发货订单</p>
            <p style="font-weight:bold;">{{ marketMetrics.waitingOrder }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ display: 'flex', cursor: 'pointer'}" @click.native="handleClick(4)">
          <div class="card-left">
            <p style="font-size: 50px;">
              <i class="el-icon-s-claim" style="color: #4b7bf7;"></i>
            </p>
          </div>
          <div class="column-box"></div>
          <div class="card-right">
            <p>维权中的订单</p>
            <p style="font-weight:bold;">{{ marketMetrics.activistOrder }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <div style="height: 20px;"></div>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div id="saleStatement" style="width: 100%; height:400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import order from '@/models/order'
import dashboard from '@/models/dashboard'

export default {
  data() {
    return {
      marketMetrics: {
        visitorNum: 0,
        sellOutSKUNum: 0,
        waitingOrder: 0,
        activistOrder: 0,
      }
    }
  },
  async created() {
    await this.getMarketMetrics()
  },
  async mounted() {
    const orderStatement = await this.getOrderStatement(1, 10)
    const option = {
      title: {
        text: '销售报表'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['交易总金额/元', '交易订单（笔）']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: orderStatement.time
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '交易总金额/元',
          type: 'line',
          stack: '总量',
          data: orderStatement.saleAmount
        },
        {
          name: '交易订单（笔）',
          type: 'line',
          stack: '总量',
          data: orderStatement.orderNum
        }
      ]
    }
    const myChart = echarts.init(document.getElementById('saleStatement'))
    myChart.setOption(option)
  },
  methods: {
    async getMarketMetrics() {
      const res = await dashboard.getMarketMetrics()
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.marketMetrics = res
      }
    },
    async getOrderStatement(page, size) {
      const res = await order.getOrderStatement(page, size)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        const time = []
        const orderNum = []
        const saleAmount = []
        for (let i = 0; i < res.length; i++) {
          time.unshift(res[i].time)
          orderNum.unshift(res[i].orderNum)
          saleAmount.unshift(res[i].saleAmount)
        }
        return {
          time, orderNum, saleAmount
        }
      }
    },
    handleClick(val) {
      // 调整页面
      console.log(val)
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;

  .card-left {
    width:25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .column-box {
    width:2px;
    height: 50px;
    background: #e6e6e6;
  }
  .card-right {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
