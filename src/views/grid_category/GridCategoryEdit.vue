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
            <el-form-item label="宫格名" prop="name">
              <el-input size="medium" v-model="form.name" maxlength="6" show-word-limit placeholder="请填写宫格名"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="categoryId">
              <el-cascader v-model="optionCategory" :options="categoryOptions" clearable @change="handleOptionCategory"></el-cascader>
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
    const nameFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('宫格名不能为空'))
      }
      callback()
    }
    const pictureFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('图片不能为空'))
      }
      callback()
    }
    const categoryFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('请选择商品分类'))
      }
      callback()
    }
    return {
      loading: true,
      form: {
        name: '',
        categoryId: null,
        picture: '',
      },
      initPictureData: [],
      rules: {
        name: [{ validator: nameFunc, trigger: 'blur', required: true }],
        picture: [{ validator: pictureFunc, trigger: 'blur', required: true }],
        categoryId: [{ validator: categoryFunc, trigger: 'blur', required: true }],
      },
      fileRules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
      optionCategory: [],
      categoryOptions: []
    }
  },
  props: {
    gridCategoryId: {
      type: Number,
    },
  },
  async created() {
    console.log(this.gridCategoryId)
    await this.getAllCategory()
    if (this.gridCategoryId !== 0) {
      await this.getGridCategory(this.gridCategoryId)
    }
    this.loading = false
  },
  computed: {
    title() {
      return this.gridCategoryId === 0 ? '新增宫格' : '编辑宫格'
    },
  },
  methods: {
    // 全部分类
    async getAllCategory() {
      const res = await category.getAllCategory()
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.categoryOptions = res
      }
    },
    // 事件-选择的分类
    handleOptionCategory() {
      if (this.optionCategory.length === 2) {
        const [, b] = this.optionCategory
        this.form.categoryId = b
      } else {
        this.form.categoryId = 0
      }
    },
    // 查询分类
    async getCategory(pid) {
      const res = await category.getCategoryList(pid, 1, 100)
      if (res.error_code !== undefined) {
        console.log(res.msg)
      } else {
        const tmpArr = []
        for (let i = 0; i < res.list.length; i++) {
          const item = res.list[i]
          tmpArr.push({
            value: item.id,
            label: item.name,
            leaf: item.parentId !== 0
          })
        }
        return tmpArr
      }
    },
    async getGridCategory(id) {
      const res = await gridCategory.getGridCategory(id)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.form = {
          name: res.name,
          categoryId: res.subCategoryId,
          picture: res.picture
        }
        this.initPictureData = [
          {
            id: res.id,
            display: res.picture
          }
        ]
        this.optionCategory = [
          res.categoryId, res.subCategoryId
        ]
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
      this.form.picture = data.url
    },
    // 清理上传的图片
    clearUploadFile() {
      this.$refs.uploadEle.clear()
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const postData = {
              id: this.gridCategoryId,
              name: this.form.name,
              categoryId: this.form.categoryId,
              picture: this.form.picture
            }
            const res = await gridCategory.editGridCategory(postData)
            if (res.error_code !== undefined) {
              this.$message.error(`${res.msg}`)
            } else {
              this.$message.success('操作成功！')
              this.back()
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          return false
        }
      })
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
