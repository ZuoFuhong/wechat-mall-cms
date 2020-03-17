<template>
  <div class="container" >
    <div class="title">
      <span>{{ title }}</span>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col :lg="10" :md="20" :sm="24" :xs="24">
          <el-form :rules="rules" :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="标题" prop="title">
              <el-input :disabled="couponId !== 0" size="medium" v-model="form.title" placeholder="请填写标题"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" @change="doSwitchCouponType" :disabled="couponId !== 0" placeholder="请选择">
                <el-option
                  v-for="item in couponTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="满减额" v-if="couponType === 1 || couponType === 4" prop="fullMoney">
              <el-input-number
                :disabled="couponId !== 0"
                v-model="form.fullMoney"
                :precision="2"
                :step="1"
                :min="0.01"
                :max="100000"
                label="满减额"
              ></el-input-number>
            </el-form-item>
            <el-form-item v-if="couponType === 1 || couponType === 3" label="优惠额" prop="minus">
              <el-input-number
                :disabled="couponId !== 0"
                v-model="form.minus"
                :precision="2"
                :step="1"
                :min="0.01"
                :max="100000"
                label="满减额"
              ></el-input-number>
            </el-form-item>
            <el-form-item v-if="couponType === 2 || couponType === 4" label="折扣" prop="rate">
              <el-input-number
                :disabled="couponId !== 0"
                v-model="form.rate"
                :precision="2"
                :step="0.1"
                :min="0.01"
                :max="0.99"
                label="满减额"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="时间" prop="couponTime">
              <el-date-picker
                v-model="couponTime"
                :picker-options="pickerOptions0"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                placeholder="请输入优惠券描述"
                maxlength="30"
                show-word-limit
              >
              </el-input>
            </el-form-item>
            <el-form-item label="是否上架" prop="online">
              <el-switch
                v-model="onlineStatus"
                @change="doSwitchOnlineEvent"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="上架"
                inactive-text="下架"
              >
              </el-switch>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import coupon from '@/models/coupon'

export default {
  props: {
    couponId: {
      type: Number
    }
  },
  data() {
    const titleFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('标题不能为空'))
      }
      callback()
    }
    return {
      form: {
        title: '',
        type: null,
        fullMoney: 0,
        minus: 0,
        rate: 0,
        description: '',
        online: 0
      },
      couponTime: null,
      couponTypeList: [
        {
          value: 1,
          label: '满减券'
        },
        {
          value: 2,
          label: '折扣券'
        },
        {
          value: 3,
          label: '无门槛券'
        },
        {
          value: 4,
          label: '满减折扣券'
        }
      ],
      couponType: 0,
      rules: {
        title: [{ validator: titleFunc, trigger: 'blur', required: true }],
      },
      onlineStatus: false,
      // 日期选择范围：当前时间开始，一个月以内
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > moment().add(1, 'months').toDate()
        }
      }
    }
  },
  async created() {
    console.log(this.couponId)
    await this.getCoupon(this.couponId)
  },
  methods: {
    back() {
      this.$emit('editClose')
    },
    async getCoupon(couponId) {
      const res = await coupon.getCoupon(couponId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.form = {
          title: res.title,
          type: res.type,
          fullMoney: res.fullMoney,
          minus: res.minus,
          rate: res.rate,
          description: res.description,
          online: res.online
        }
        this.couponType = res.type
        this.onlineStatus = res.online === 1
        const startDate = moment(res.startTime, 'YYYY-MM-DD HH:mm:ss', true)
        const endDate = moment(res.endTime, 'YYYY-MM-DD HH:mm:ss', true)
        this.couponTime = [
          startDate, endDate
        ]
      }
    },
    doSwitchCouponType(val) {
      this.couponType = val
    },
    async submitForm() {
      try {
        if (this.form.title === '') {
          this.$message.error('标题为必填项！')
          return
        }
        if (!this.form.type) {
          this.$message.error('请选择券类型！')
          return
        }
        if (!this.couponTime) {
          this.$message.error('时间不能为空！')
          return
        }
        const startTime = moment(this.couponTime[0]).format('YYYY-MM-DD HH:mm:ss')
        const endTime = moment(this.couponTime[1]).format('YYYY-MM-DD HH:mm:ss')
        const postData = {
          id: this.couponId,
          title: this.form.title,
          fullMoney: (this.form.fullMoney).toString(),
          minus: (this.form.minus).toString(),
          rate: (this.form.rate).toString(),
          type: this.form.type,
          startTime,
          endTime,
          description: this.form.description,
          online: this.form.online
        }
        const res = await coupon.editCoupon(postData)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('操作成功！')
          this.back()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    doSwitchOnlineEvent(val) {
      this.form.online = val ? 1 : 0
    }
  },
  computed: {
    title() {
      return this.couponId === 0 ? '新增优惠券' : '更新优惠券'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 200px;
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
  .plus {
    -webkit-box-align: center;
    align-items: center;
  }
  .banner-table {
    position: relative;

    .bannerPicture {
      max-width: 100px;
      max-height: 50px;
      width: auto;
      height: auto;
    }
  }
}
</style>
