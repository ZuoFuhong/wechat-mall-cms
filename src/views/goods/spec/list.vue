<template>
  <div>
    <div class="container">
      <div class="title">
        <span>规格名列表</span>
        <el-button type="primary" plain style="margin-left: 30px;" @click="addSpec">添加规格</el-button>
      </div>
      <div class="category-table">
        <el-table
          v-loading="loading"
          stripe
          row-key="id"
          :data="tableData"
          :highlight-current-row="true"
          style="width: 100%"
        >
          <el-table-column prop="id" label="id" width="80"></el-table-column>
          <el-table-column prop="name" label="名称" width="150"> </el-table-column>
          <el-table-column prop="description" label="描述" width="275"> </el-table-column>
          <el-table-column prop="unit" label="单位" width="150"> </el-table-column>
          <el-table-column prop="standard" :formatter="formatStatus" label="标准" width="150"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="handleEdit(scope.row)" type="primary">编辑</el-button>
              <el-button plain size="mini" v-auth="['管理规格']" @click="handleDelete(scope.row)" type="danger">删除</el-button>
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
    <el-dialog title="新增规格名" :visible.sync="dialogTableVisible" width="50%">
      <div class="container" style="padding-bottom: 0px;">
        <div class="wrap">
          <el-row>
            <el-col :lg="20">
              <el-form :rules="dialogFormRules" :model="dialogForm" status-icon ref="dialogForm" label-width="100px" @submit.native.prevent>
                <el-form-item label="规格名名称" prop="name">
                  <el-input size="medium" v-model="dialogForm.name" maxlength="8" show-word-limit autocomplete="off" placeholder="请输入规格名名称"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                  <el-input size="medium" v-model="dialogForm.unit" maxlength="5" show-word-limit autocomplete="off" placeholder="请输入单位，如：英寸"></el-input>
                </el-form-item>
                <el-form-item label="规格名描述" prop="description">
                  <el-input size="medium" v-model="dialogForm.description" maxlength="30" show-word-limit autocomplete="off" placeholder="请输入规格名描述"></el-input>
                </el-form-item>
                <el-form-item label="是否标准" prop="standard">
                  <el-switch
                    v-model="standardStatus"
                    @change="handleStandardStatus"
                    active-text="标准"
                    inactive-text="非标准">
                  </el-switch>
                </el-form-item>
                <el-form-item class="submit">
                  <el-button v-auth="['管理规格']" type="primary" @click="submitForm('dialogForm')">保 存</el-button>
                  <el-button v-auth="['管理规格']" @click="resetForm('dialogForm')">重 置</el-button>
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
import Spec from '@/models/spec'

export default {
  components: {},
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
      tableData: [],
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      specId: 0,
      dialogTableVisible: false,
      dialogFormRules: {
        name: [{ validator: nameFunc, trigger: 'blur', required: true }],
        unit: [{ validator: unitFunc, trigger: 'blur', required: true }],
      },
      dialogForm: {
        name: '',
        unit: '',
        description: '',
        standard: 0
      },
      standardStatus: false
    }
  },
  async created() {
    await this.getSpecList(1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
    // 新增规格
    async addSpec() {
      this.dialogTableVisible = true
    },
    handleStandardStatus(val) {
      this.dialogForm.standard = val ? 1 : 0
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.dialogForm)
          const postData = {
            id: 0,
            name: this.dialogForm.name,
            unit: this.dialogForm.unit,
            description: this.dialogForm.description,
            standard: this.dialogForm.standard
          }
          const res = await Spec.editSpec(postData)
          if (res.error_code !== undefined) {
            this.$message.error(`${res.msg}`)
          } else {
            this.$message.success('新增成功！')
            this.getSpecList(1, this.pagination.pageSize)
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
    async getSpecList(pageNum, pageSize) {
      const res = await Spec.getSpecList(pageNum, pageSize)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    formatStatus(row) {
      return row.online === 1 ? '标准' : '非标准'
    },
    handleEdit(val) {
      this.$router.push(`/goods/spec/edit/${val.id}`)
    },
    handleDelete(val) {
      console.log(val)
      this.$confirm('此操作将永久删除改规格, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await Spec.deleteSpec(val.id)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('删除成功！')
          this.getSpecList(1, this.pagination.pageSize)
        }
      })
    },
    currentChange(pageNum) {
      this.getSpecList(pageNum, this.pagination.pageSize)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px 200px;
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
  }

  .submit {
    float: left;
  }
  .category-table {
    position: relative;

    .categoryPicture {
      max-width: 100px;
      max-height: 50px;
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
