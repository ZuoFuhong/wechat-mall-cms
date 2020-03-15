<template>
  <div class="container">
    <div class="title">
      <span>{{ title }}</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" v-loading="loading" @submit.native.prevent>
            <el-form-item label="宫格标题" prop="title">
              <el-input size="medium" v-model="form.title" placeholder="请填写宫格标题"></el-input>
            </el-form-item>
            <el-form-item label="宫格名" prop="name">
              <el-input size="medium" v-model="form.name" type="number" placeholder="请填写宫格名"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="picture">
              <upload-imgs ref="uploadEle" :rules="rules" :multiple="true" :max-num="1" :animated-check="true" />
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
import UploadImgs from '@/components/base/upload-imgs'

export default {
  components: {
    UploadImgs,
  },
  data() {
    return {
      loading: true,
      form: {
        title: '',
        name: '',
        categoryId: '',
        picture: '',
      },
      rules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
      categoryList: [],
      value: '',
    }
  },
  props: {
    gridCategoryId: {
      type: Number,
    },
  },
  created() {
    console.log(this.gridCategoryId)
    // todo: 加载分类
    this.categoryList = [
      {
        value: 1,
        label: '黄金糕',
      },
      {
        value: 2,
        label: '双皮奶',
      },
    ]
    this.loading = false
  },
  computed: {
    title() {
      return this.gridCategoryId === 0 ? '新增宫格' : '编辑宫格'
    },
  },
  methods: {
    back() {
      this.$emit('editClose')
    },
    async getUploadFile(name) {
      console.log(await this.$refs[name].getValue())
    },
    // 清理上传的图片
    clearUploadFile() {
      this.$refs.uploadEle.clear()
    },
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
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

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
