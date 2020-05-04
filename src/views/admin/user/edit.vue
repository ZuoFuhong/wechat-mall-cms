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
            <el-form-item label="用户名" prop="username">
              <el-input size="medium" v-model="form.username" :disabled="userId !== 0" maxlength="16" autocomplete="off" show-word-limit minlength="3"  placeholder="请填写用户名"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
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
            <el-form-item label="手机号" prop="mobile">
              <el-input size="medium" v-model="form.mobile" maxlength="11" autocomplete="off" show-word-limit placeholder="请填写手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input size="medium" type="email" v-model="form.email" maxlength="20" autocomplete="off" show-word-limit placeholder="请填写邮箱"></el-input>
            </el-form-item>
            <el-form-item label="选择分组" prop="groupId">
              <el-select v-model="form.groupId" placeholder="请选择">
                <el-option
                  v-for="item in groupList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
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
import admin from '@/models/admin'

export default {
  components: {
    UploadImgs,
  },
  props: {
    userId: {
      type: Number
    }
  },
  data() {
    const nameFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      const reg = new RegExp(/^[a-zA-Z0-9]{5,16}$/)
      if (!reg.test(value)) {
        return callback(new Error('用户名必须由字母或数字组成的5~16字符，区分大小写'))
      }
      callback()
    }
    const avatarFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('用户头像不能空'))
      }
      callback()
    }
    const mobileFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      const reg = new RegExp(/^1[358]\d{9}$/)
      if (!reg.test(value)) {
        return callback(new Error('请输入正确手机号'))
      }
      callback()
    }
    const groupFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('请选择分组'))
      }
      callback()
    }
    return {
      form: {
        username: '',
        title: '',
        avatar: '',
        mobile: '',
        email: '',
        description: '',
        groupId: null
      },
      groupList: [],
      rules: {
        username: [{ validator: nameFunc, trigger: 'blur', required: true }],
        avatar: [{ validator: avatarFunc, trigger: 'blur', required: true }],
        mobile: [{ validator: mobileFunc, trigger: 'blur', required: true }],
        groupId: [{ validator: groupFunc, trigger: 'blur', required: true }],
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
    console.log(this.userId)
    await this.getGroupList()
    if (this.userId !== 0) {
      await this.getUser(this.userId)
    }
  },
  computed: {
    title() {
      return this.userId === 0 ? '新增用户' : '更新用户'
    }
  },
  methods: {
    async getUser(userId) {
      try {
        const res = await admin.getUser(userId)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
          return
        }
        this.form.username = res.username
        this.form.email = res.email
        this.form.mobile = res.mobile
        this.form.groupId = res.groupId
        this.form.avatar = res.avatar
        this.initPictureData = [
          {
            id: res.id,
            display: res.avatar,
          },
        ]
      } catch (error) {
        console.log(error)
      }
    },
    async getGroupList() {
      const res = await admin.getGroupList(1, 100)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.groupList = res.list
      }
    },
    async getUploadFile(name) {
      return this.$refs[name].getValue()
    },
    // 重写插件中上传文件
    async uploadFile(file, call) {
      const data = await oss.uploadFileToOSS(file, 'assets/')
      call(data)
      this.form.avatar = data.url
    },
    // 清理上传的图片
    clearUploadFile() {
      this.$refs.uploadEle.clear()
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          try {
            const postData = {
              id: this.userId,
              username: this.form.username,
              email: this.form.email,
              mobile: this.form.mobile,
              avatar: this.form.avatar,
              groupId: this.form.groupId
            }
            const res = await admin.editUser(postData)
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
    back() {
      this.$emit('editClose')
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
