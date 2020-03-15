<template>
  <div class="container">
    <div class="title">新建规格名</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="10" :md="20" :sm="24" :xs="24">
          <el-form :rules="rules" :model="form" status-icon ref="form" label-width="100px" v-loading="loading" @submit.native.prevent>
            <el-form-item label="规格名名称" prop="name">
              <el-input size="medium" v-model="form.name" maxlength="5" show-word-limit placeholder="请填写规格名名称"></el-input>
            </el-form-item>
            <el-form-item label="规格名描述" prop="description">
              <el-input size="medium" v-model="form.description" placeholder="请填写规格名描述"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input size="medium" v-model="form.unit" maxlength="5" show-word-limit placeholder="请填写单位，如：英寸"></el-input>
            </el-form-item>
            <el-form-item label="是否标准" prop="standard">
              <el-switch
                style="display: inline-flex; align-items: center; line-height: 20px; vertical-align: middle; height: 20px;"
                @change="doSwitchStandard"
                v-model="form.standardStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="非标准"
                inactive-text="标准"
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
import Spec from '@/models/spec'

export default {
  data() {
    const nameFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('规格名名称不能为空'))
      }
      callback()
    }
    const unitFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('单位不能为空'))
      }
      callback()
    }
    return {
      loading: true,
      form: {
        name: '',
        description: '',
        unit: '',
        standardStatus: false,
        standard: 0,
      },
      rules: {
        name: [{ validator: nameFunc, trigger: 'blur', required: true }],
        unit: [{ validator: unitFunc, trigger: 'blur', required: true }],
      }
    }
  },
  created() {
    this.loading = false
  },
  methods: {
    async submitForm(formName) {
      try {
        if (this.form.name === '') {
          this.$message.error('规格名名称为必填项！')
          return
        }
        if (this.form.unit === '') {
          this.$message.error('单位为必填项！')
          return
        }
        console.log(this.form)
        const postData = {
          id: 0,
          name: this.form.name,
          description: this.form.description,
          unit: this.form.unit,
          standard: this.form.standard
        }
        const res = await Spec.editSpec(postData)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('添加成功！')
          this.resetForm(formName)
        }
      } catch (error) {
        console.log(error)
      }
    },
    doSwitchStandard(val) {
      this.form.standard = val ? 1 : 0
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
  }
  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
