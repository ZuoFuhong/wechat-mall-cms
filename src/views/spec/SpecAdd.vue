<template>
  <div class="container">
    <div class="title">新建规格名</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" v-loading="loading" @submit.native.prevent>
            <el-form-item label="规格名名称" prop="name">
              <el-input size="medium" v-model="form.name" placeholder="请填写规格名名称"></el-input>
            </el-form-item>
            <el-form-item label="规格名描述" prop="description">
              <el-input size="medium" v-model="form.description" placeholder="请填写规格名描述"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input size="medium" v-model="form.unit" placeholder="请填写单位，如：英寸"></el-input>
            </el-form-item>
            <el-form-item label="是否标准" prop="standard">
              <el-switch
                style="display: inline-flex; align-items: center; line-height: 20px; vertical-align: middle; height: 20px;"
                v-model="form.standard"
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
export default {
  data() {
    return {
      loading: true,
      form: {
        name: '',
        description: '',
        unit: '',
        standard: '',
      },
    }
  },
  created() {
    this.loading = false
  },
  methods: {
    async submitForm(formName) {
      try {
        console.log(this.value)
        console.log(this.form)
        // todo: 上传图片
        // http://demo.lin.colorful3.com/cms/file
        // params: file_0: (binary)
        // response: [{"id":1085,"key":"file_0","path":"2020/03/04/db3f6584-5d574.png","url":"http://demo.lin.colb574.png"}]
        this.getUploadFile('uploadEle')

        // 建模，添加Banner
        // const res = await book.addBook(this.form)
        const res = {}
        if (res.error_code === 0) {
          this.$message.success(`${res.msg}`)
          this.resetForm(formName)
        }
      } catch (error) {
        this.$message.error(error.data.msg)
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
  }
  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
