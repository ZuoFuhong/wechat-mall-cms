<template>
  <div class="container">
    <div class="title">
      <span>{{ title }}</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="10" :md="20" :sm="24" :xs="24">
          <el-form :rules="rules" :model="form" status-icon ref="form" label-width="100px" v-loading="loading" @submit.native.prevent>
            <el-form-item label="宫格标题" prop="title">
              <el-input size="medium" v-model="form.title" maxlength="5" show-word-limit placeholder="请填写宫格标题"></el-input>
            </el-form-item>
            <el-form-item label="宫格名" prop="name">
              <el-input size="medium" v-model="form.name" maxlength="10" show-word-limit placeholder="请填写宫格名"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择">
                <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="picture">
              <upload-imgs
              :value="initPictureData"
              :remoteFuc="uploadFile"
              ref="uploadEle" :rules="fileRules" :multiple="false" :max-num="1" :animated-check="true" />
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
import oss from '@/models/oss'
import category from '@/models/category'
import gridCategory from '@/models/grid_category'

export default {
  components: {
    UploadImgs,
  },
  data() {
    const titleFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('宫格标题不能为空'))
      }
      callback()
    }
    const nameFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('宫格名不能为空'))
      }
      callback()
    }
    return {
      loading: true,
      form: {
        title: '',
        name: '',
        categoryId: null,
        picture: '',
      },
      initPictureData: [],
      rules: {
        title: [{ validator: titleFunc, trigger: 'blur', required: true }],
        name: [{ validator: nameFunc, trigger: 'blur', required: true }],
      },
      fileRules: {
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
  async created() {
    console.log(this.gridCategoryId)
    if (this.gridCategoryId !== 0) {
      await this.getGridCategory(this.gridCategoryId)
    }
    await this.getCategoryList()
    this.loading = false
  },
  computed: {
    title() {
      return this.gridCategoryId === 0 ? '新增宫格' : '编辑宫格'
    },
  },
  methods: {
    async getGridCategory(id) {
      const res = await gridCategory.getGridCategory(id)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.form = {
          title: res.title,
          name: res.name,
          categoryId: res.categoryId,
          picture: res.picture
        }
        this.initPictureData = [
          {
            id: res.id,
            display: res.picture
          }
        ]
      }
    },
    async getCategoryList() {
      const res = await category.getCategoryList(0, 1, 100)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        for (let i = 0; i < res.list.length; i++) {
          this.categoryList.push({
            value: res.list[i].id,
            label: res.list[i].name
          })
        }
      }
    },
    back() {
      this.$emit('editClose')
    },
    async getUploadFile(name) {
      return this.$refs[name].getValue()
    },
    // 重写插件中上传文件
    async uploadFile(file, call) {
      const data = await oss.uploadFileToOSS(file, 'assets/')
      call(data)
    },
    // 清理上传的图片
    clearUploadFile() {
      this.$refs.uploadEle.clear()
    },
    async submitForm(formName) {
      try {
        const files = await this.getUploadFile('uploadEle')
        if (this.form.title === '') {
          this.$message.error('宫格标题为必填项！')
          return
        }
        if (this.form.name === '') {
          this.$message.error('宫格名为必填项！')
          return
        }
        if (!this.form.categoryId) {
          this.$message.error('请选择分类！')
          return
        }
        if (files.length === 0) {
          this.$message.error('请上传图片！')
          return
        }
        console.log(files)
        const postData = {
          id: this.gridCategoryId,
          title: this.form.title,
          name: this.form.name,
          categoryId: this.form.categoryId,
          picture: files[0].display
        }
        const res = await gridCategory.editGridCategory(postData)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('操作成功！')
          this.resetForm(formName)
          this.clearUploadFile()
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
