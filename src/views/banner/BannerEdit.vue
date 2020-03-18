<template>
  <div class="container">
    <div class="title">
      <span>{{ title }}</span>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col :lg="10" :md="20" :sm="24" :xs="24">
          <el-form :rules="rules" :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="标题" prop="title">
              <el-input size="medium" v-model="form.title" maxlength="10" show-word-limit placeholder="请填写标题"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="picture">
              <upload-imgs
                :value="initPictureData"
                :remoteFuc="uploadFile"
                ref="uploadEle"
                :rules="fileRules"
                :multiple="false"
                :max-num="1"
                :animated-check="true"
              />
            </el-form-item>
            <el-form-item label="Banner描述" prop="description">
              <el-input
                size="medium"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入描述"
                v-model="form.description"
              >
              </el-input>
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
import banner from '@/models/banner'
import oss from '@/models/oss'

export default {
  components: {
    UploadImgs,
  },
  props: {
    bannerId: {
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
    const pictureFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('图片不能为空'))
      }
      callback()
    }
    return {
      form: {
        title: '',
        picture: '',
        description: '',
      },
      rules: {
        title: [{ validator: titleFunc, trigger: 'blur', required: true }],
        picture: [{ validator: pictureFunc, trigger: 'blur', required: true }],
      },
      fileRules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
      initPictureData: []
    }
  },
  async created() {
    console.log('bannerId: ', this.bannerId)
    if (this.bannerId !== 0) {
      await this.getBanner(this.bannerId)
    }
  },
  computed: {
    title() {
      return this.bannerId === 0 ? '新增Banner' : '更新Banner'
    }
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const res = await banner.updateBanner({
              id: this.bannerId,
              picture: this.form.picture,
              title: this.form.title,
              description: this.form.description,
            })
            if (res.error_code === undefined) {
              this.$message.success('操作成功！')
              this.back()
            } else {
              this.$message.error(`${res.msg}`)
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          return false
        }
      })
    },
    async getBanner(bannerId) {
      try {
        const res = await banner.getBanner(bannerId)
        if (res.error_code !== undefined) {
          this.$message.erorr(`${res.msg}`)
          return
        }
        this.form = res
        this.initPictureData = [
          {
            id: res.id,
            display: res.picture,
          },
        ]
      } catch (error) {
        if (error.error_code === 10020) {
          this.tableData = []
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
      this.form.picture = data.url
    },
    // 清理上传的图片
    clearUploadFile() {
      this.$refs.uploadEle.clear()
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
  .plus {
    -webkit-box-align: center;
    align-items: center;
  }
}
</style>
