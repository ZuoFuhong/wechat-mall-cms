<template>
  <div>
    <div class="container" v-if="!showEdit">
      <el-row>
        <el-col :span="10">
          <div class="title">修改规格名</div>
          <div class="wrap">
            <el-row>
              <el-col :lg="16" :md="20" :sm="24" :xs="24">
                <el-form
                  :rules="rules"
                  :model="form"
                  status-icon
                  ref="form"
                  label-width="100px"
                  v-loading="loading"
                  @submit.native.prevent
                >
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
                      v-model="form.standardStatus"
                      @change="doSwitchStandard"
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
        </el-col>
        <el-col :span="14">
          <div class="title plus">
            <span>规格值列表</span>
            <el-button type="primary" plain style="margin-left: 30px;" @click="addSpecAttr">添加规格值</el-button>
          </div>
          <div class="wrap">
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
                <el-table-column prop="value" label="规格值名称" width="220"></el-table-column>
                <el-table-column prop="extend" label="扩展"> </el-table-column>
                <el-table-column label="操作" fixed="right" width="180">
                  <template slot-scope="scope">
                    <el-button plain size="mini" @click="handleEdit(scope.row)" type="primary">编辑</el-button>
                    <el-button plain size="mini" @click="handleDelete(scope.row)" type="danger">删除</el-button>
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
        </el-col>
      </el-row>
    </div>
    <spec-attr-edit v-else @editClose="editClose" :specId="specId" :specAttrId="specAttrId"></spec-attr-edit>
  </div>
</template>

<script>
import SpecAttrEdit from './SpecAttrEdit'
import Spec from '@/models/spec'

export default {
  components: {
    SpecAttrEdit,
  },
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
      form: {
        name: '',
        description: '',
        unit: '',
        standard: '',
        standardStatus: false
      },
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      tableData: [],
      specAttrId: 0,
      showEdit: false,
      rules: {
        name: [{ validator: nameFunc, trigger: 'blur', required: true }],
        unit: [{ validator: unitFunc, trigger: 'blur', required: true }],
      },
      specId: 0
    }
  },
  async created() {
    const specId = parseInt(this.$route.params.id, 10)
    this.specId = specId
    console.log(specId)
    await this.getSpec(specId)
    await this.getSpecAttrList(specId)
    this.loading = false
  },
  methods: {
    async getSpec(specId) {
      const res = await Spec.getSpec(specId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.form = {
          name: res.name,
          description: res.description,
          unit: res.unit,
          standard: res.standard,
          standardStatus: res.standard === 1
        }
      }
    },
    async getSpecAttrList(specId) {
      const res = await Spec.getSpecAttrList(specId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res
      }
    },
    doSwitchStandard(val) {
      this.form.standard = val ? 1 : 0
    },
    async submitForm() {
      try {
        if (this.form.name === '') {
          this.$message.error('规格名名称为必填项！')
          return
        }
        if (this.form.unit === '') {
          this.$message.error('单位为必填项！')
          return
        }
        const postData = {
          id: this.specId,
          name: this.form.name,
          description: this.form.description,
          unit: this.form.unit,
          standard: this.form.standard
        }
        console.log(postData)
        const res = await Spec.editSpec(postData)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('添加成功！')
          this.getSpec(this.specId)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addSpecAttr() {
      this.specAttrId = 0
      this.showEdit = true
    },
    handleEdit(val) {
      this.specAttrId = val.id
      this.showEdit = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该属性, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await Spec.deleteSpecAttr(val.id)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('删除成功！')
          this.getSpecAttrList(this.specId)
        }
      })
    },
    editClose() {
      this.showEdit = false
      this.getSpecAttrList(this.specId)
    },
    currentChange(page) {
      console.log(page)
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
  .plus {
    -webkit-box-align: center;
    align-items: center;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-right: -10px;
    margin-top: 15px;
  }
}
</style>
