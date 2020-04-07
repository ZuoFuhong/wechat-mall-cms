<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title plus">
          <span>用户列表</span>
          <el-button type="primary" plain style="margin-left: 30px;" @click="addUser">添加用户</el-button>
        </div>
      </div>
      <div class="banner-table">
        <el-table
          v-loading="loading"
          stripe
          row-key="id"
          :data="tableData"
          :highlight-current-row="true"
          style="width: 100%"
        >
          <el-table-column prop="id" label="id" width="80"> </el-table-column>
          <el-table-column prop="avatar" label="头像" width="180">
            <template slot-scope="scope">
              <img class="bannerPicture" :src="scope.row.avatar" alt="" />
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" width="150"> </el-table-column>
          <el-table-column prop="mobile" label="手机号" width="150"> </el-table-column>
          <el-table-column prop="email" label="邮箱" width="150"> </el-table-column>
          <el-table-column prop="groupName" label="所属分组" width="150"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="240">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="handleEdit(scope.row)" type="primary">查看</el-button>
              <el-button plain size="mini" @click="handleDelete(scope.row)" type="danger">删除</el-button>
              <el-button plain size="mini" @click="handleChangePassword(scope.row)" type="info">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :page-size="pagination.pageSize ? pagination.pageSize : 10"
          :total="pagination.pageTotal ? pagination.pageTotal : null"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </div>
    <user-edit v-else @editClose="editClose" :userId="userId"></user-edit>
    <el-dialog title="重置密码" :visible.sync="dialogTableVisible" width="40%">
      <div class="container">
        <div class="wrap">
          <el-row>
            <el-col :lg="16" :md="20" :sm="24" :xs="24">
              <el-form :rules="dialogFormRules" :model="dialogForm" status-icon ref="dialogForm" label-width="100px" @submit.native.prevent>
                <el-form-item label="密码" prop="password">
                  <el-input size="medium" v-model="dialogForm.password" show-password maxlength="16" autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input size="medium" v-model="dialogForm.confirmPassword" show-password maxlength="16" autocomplete="off" placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <el-form-item class="submit">
                  <el-button type="primary" @click="submitForm('dialogForm')">保 存</el-button>
                  <el-button @click="resetForm('dialogForm')">重 置</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import admin from '@/models/admin'
import UserEdit from './edit'

export default {
  components: {
    UserEdit
  },
  data() {
    const passwordFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      const reg = new RegExp(/^[a-zA-Z0-9]{6,16}$/)
      if (!reg.test(value)) {
        return callback(new Error('密码必须由字母或数字组成的6~16字符，区分大小写'))
      }
      callback()
    }
    const confirmPasswordFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('确认密码不能为空'))
      }
      if (this.dialogForm.password !== this.dialogForm.confirmPassword) {
        return callback(new Error('两次输入密码不一致'))
      }
      callback()
    }
    return {
      loading: true,
      tableColumn: [
        { prop: 'id', label: 'id' },
        { prop: 'avatar', label: '头像' },
        { prop: 'username', label: '用户名' },
        { prop: 'mobile', label: '手机号' },
        { prop: 'email', label: '邮箱' },
        { prop: 'groupName', label: '所属分组' },
      ],
      tableData: [],
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      dialogTableVisible: false,
      dialogForm: {
        password: '',
        confirmPassword: ''
      },
      dialogFormRules: {
        password: [{ validator: passwordFunc, trigger: 'blur', required: true }],
        confirmPassword: [{ validator: confirmPasswordFunc, trigger: 'blur', required: true }],
      },
      showEdit: false,
      userId: 0
    }
  },
  async created() {
    await this.getUserList(1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
    async getUserList(page, size) {
      const res = await admin.getUserList(page, size)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    handleEdit(val) {
      this.userId = val.id
      this.showEdit = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await admin.deleteUser(val.id)
        if (res.error_code === undefined) {
          this.getUserList(1, this.pagination.pageTotal)
          this.$message({
            type: 'success',
            message: '删除成功！',
          })
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    },
    editClose() {
      this.showEdit = false
      this.getUserList(1, this.pagination.pageSize)
    },
    currentChange(pageNum) {
      this.getUserList(pageNum, this.pagination.pageSize)
    },
    addUser() {
      this.userId = 0
      this.showEdit = true
    },
    handleChangePassword(val) {
      this.userId = val.id
      this.dialogTableVisible = true
      this.resetForm('dialogForm')
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await admin.resetPassword(this.userId, this.dialogForm.password)
          if (res.error_code !== undefined) {
            this.$message.error(`${res.msg}`)
          } else {
            this.$message.success('操作成功！')
            this.dialogTableVisible = false
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
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      font-size: 16px;
      font-weight: 500;
      color: $parent-title-color;
    }
    .plus {
      -webkit-box-align: center;
      align-items: center;
    }
  }
  .banner-table {
    position: relative;

    .bannerPicture {
      max-width: 80px;
      max-height: 40px;
      width: auto;
      height: auto;
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-right: -10px;
      margin-top: 15px;
    }
  }
}
</style>
