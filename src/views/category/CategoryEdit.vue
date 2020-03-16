<template>
  <div class="container">
    <div class="title">
      <span>{{ title }}</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
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
            <el-form-item label="分类名" prop="name">
              <el-input
                size="medium"
                v-model="form.name"
                placeholder="请填写分类名"
                show-word-limit
                maxlength="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input size="medium" v-model="form.sort" type="number" min="0" placeholder="请填写分类排序"></el-input>
            </el-form-item>
            <el-form-item label="显示上线" prop="online">
              <el-switch
                v-model="form.onlineBool"
                @change="changeOnlineEvent"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="上线"
                inactive-text="下线"
              ></el-switch>
            </el-form-item>
            <el-form-item label="图片" prop="picture">
              <upload-imgs
                ref="uploadEle"
                :value="initPictureData"
                :remoteFuc="uploadFile"
                :rules="fileRules"
                :multiple="false"
                :max-num="1"
                :animated-check="true"
              />
            </el-form-item>
            <el-form-item label="分类描述" prop="description">
              <el-input size="medium" v-model="form.description" placeholder="请填写分类描述"></el-input>
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
// todo: 建模 category
import UploadImgs from '@/components/base/upload-imgs'
import category from '@/models/category'
import oss from '@/models/oss'

export default {
  components: {
    UploadImgs,
  },
  data() {
    const nameFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('分类名不能为空'))
      }
      callback()
    }
    const sortFunc = (rule, value, callback) => {
      if (value < 0) {
        return callback(new Error('排序不能小于0'))
      }
      callback()
    }
    return {
      form: {
        name: '',
        sort: 0,
        onlineBool: false,
        online: 0,
        picture: '',
        description: '',
      },
      rules: {
        name: [{ validator: nameFunc, trigger: 'blur', required: true }],
        sort: [{ validator: sortFunc, trigger: 'blur', required: true }],
      },
      fileRules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
      loading: true,
      pid: 0,
      initPictureData: [],
    }
  },
  props: {
    categoryId: {
      type: Number,
    },
  },
  async created() {
    this.pid = parseInt(this.$route.params.id, 10)
    console.log('pid: ', this.pid)
    if (this.categoryId !== 0) {
      await this.getCategory(this.categoryId)
    }
    this.loading = false
  },
  computed: {
    title() {
      return this.categoryId > 0 ? '编辑分类' : '新增分类'
    },
  },
  methods: {
    async getCategory(categoryId) {
      const res = await category.getCategory(categoryId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.form = {
          name: res.name,
          sort: res.sort,
          onlineBool: res.online === 1,
          online: res.online,
          picture: res.picture,
          description: res.description,
        }
        this.initPictureData = [
          {
            id: res.id,
            display: res.picture,
          },
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
    },
    // 清理上传的图片
    clearUploadFile() {
      this.$refs.uploadEle.clear()
    },
    changeOnlineEvent(val) {
      this.form.online = val ? 1 : 0
    },
    async submitForm(formName) {
      try {
        if (this.form.name === '') {
          this.$message.error('分类名为必填项！')
          return
        }
        if (this.form.sort < 0) {
          this.$message.error('排序不能小于0！')
          return
        }
        const files = await this.getUploadFile('uploadEle')
        if (files.length === 0) {
          this.$message.error('请上传图片！')
          return
        }
        const postData = {
          id: this.categoryId,
          parentId: this.pid,
          name: this.form.name,
          sort: parseInt(this.form.sort, 10),
          online: this.form.online,
          picture: files[0].display,
          description: this.form.description,
        }
        const res = await category.editCategory(postData)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('操作成功！')
          this.resetForm(formName)
          this.clearUploadFile()
          this.back()
        }
      } catch (error) {
        this.$message.error(error)
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
