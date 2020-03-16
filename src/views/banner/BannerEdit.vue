<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="title">修改Banner</div>
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form :rules="rules" :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
              <el-form-item label="名称" prop="name">
                <el-input size="medium" v-model="form.name" placeholder="请填写名称"></el-input>
              </el-form-item>
              <el-form-item label="标题" prop="title">
                <el-input size="medium" v-model="form.title" placeholder="请填写标题"></el-input>
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
  data() {
    const nameFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('名称不能为空'))
      }
      callback()
    }
    const titleFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('标题不能为空'))
      }
      callback()
    }
    return {
      form: {
        name: '',
        title: '',
        picture: '',
        description: '',
      },
      rules: {
        name: [{ validator: nameFunc, trigger: 'blur', required: true }],
        title: [{ validator: titleFunc, trigger: 'blur', required: true }],
      },
      fileRules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
      tableColumn: [
        { prop: 'id', label: 'id' },
        { prop: 'picture', label: '图片' },
        { prop: 'name', label: '名称' },
        { prop: 'keyword', label: '关键字' },
        { prop: 'type', label: '描述' },
      ],
      tableData: [],
      pagination: {
        pageSize: 10,
        pageTotal: 100,
      },
      showEdit: false,
      bannerItemId: 0,
      initPictureData: [],
      bannerId: 0,
    }
  },
  async created() {
    // todo: 查询banner详情
    this.bannerId = parseInt(this.$route.params.id, 10)
    console.log('bannerId: ', this.bannerId)
    await this.getBanner(this.bannerId)
  },
  methods: {
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
        if (this.form.name === '') {
          this.$message.error('名称为必填项！')
          return
        }
        if (this.form.title === '') {
          this.$message.error('标题为必填项！')
          return
        }
        if (files.length === 0) {
          this.$message.error('请上传Banner图片')
          return
        }
        const res = await banner.updateBanner({
          id: this.bannerId,
          picture: files[0].display,
          name: this.form.name,
          title: this.form.title,
          description: this.form.description,
        })
        if (res.error_code === undefined) {
          this.$message.success('操作成功！')
          this.resetForm(formName)
          this.clearUploadFile()
        } else {
          this.$message.error(`${res.msg}`)
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
