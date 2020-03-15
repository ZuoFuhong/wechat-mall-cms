<template>
  <div>
    <div class="container">
      <div class="title">
        <span>修改规格值</span>
        <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      </div>
      <div class="wrap">
        <el-row>
          <el-col :lg="10" :md="20" :sm="24" :xs="24">
            <el-form
              :rules="rules"
              :model="form"
              status-icon
              ref="form"
              label-width="100px"
              v-loading="loading"
              @submit.native.prevent
            >
              <el-form-item label="规格值名称" prop="value">
                <el-input size="medium" v-model="form.value" maxlength="10" show-word-limit placeholder="请填写规格值名称"></el-input>
              </el-form-item>
              <el-form-item label="扩展" prop="extend">
                <el-input size="medium" v-model="form.extend" placeholder="请填写规格值扩展"></el-input>
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
  </div>
</template>

<script>
import Spec from '@/models/spec'

export default {
  props: {
    specAttrId: {
      type: Number,
    },
    specId: {
      type: Number
    }
  },
  data() {
    const valueFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('规格名名称不能为空'))
      }
      callback()
    }
    return {
      loading: true,
      form: {
        value: '',
        extend: '',
      },
      rules: {
        value: [{ validator: valueFunc, trigger: 'blur', required: true }],
      }
    }
  },
  async created() {
    console.log(this.specId)
    console.log(this.specAttrId)
    if (this.specAttrId !== 0) {
      await this.getSpecAttr(this.specAttrId)
    }
    this.loading = false
  },
  methods: {
    async getSpecAttr(specAttrId) {
      const res = await Spec.getSpecAttr(specAttrId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.form = {
          value: res.value,
          extend: res.extend
        }
      }
    },
    back() {
      this.$emit('editClose')
    },
    async submitForm(formName) {
      try {
        if (this.form.value === '') {
          this.$message.error('规格值名称为必填字段！')
          return
        }
        const postData = {
          id: this.specAttrId,
          specId: this.specId,
          value: this.form.value,
          extend: this.form.extend
        }
        const res = await Spec.editSpecAttr(postData)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('操作成功！')
          this.resetForm(formName)
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
  },
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
}
</style>
