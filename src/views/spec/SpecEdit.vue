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
                      v-model="form.standard"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
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
                <el-table-column prop="name" label="规格值名称" width="150"></el-table-column>
                <el-table-column prop="extend" label="扩展" width="120"> </el-table-column>
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
    <spec-attr-edit v-else @editClose="editClose" :specAttrId="specAttrId"></spec-attr-edit>
  </div>
</template>

<script>
import SpecAttrEdit from './SpecAttrEdit'

export default {
  components: {
    SpecAttrEdit,
  },
  data() {
    return {
      loading: true,
      form: {
        name: '',
        description: '',
        unit: '',
        standard: '',
      },
      pagination: {
        pageSize: 1,
        pageTotal: 10,
      },
      tableData: [],
      specAttrId: 0,
      showEdit: false,
    }
  },
  created() {
    console.log('specId: ', this.$route.params.id)
    this.loading = false
    this.tableData = [
      {
        id: 1,
        name: '青蓝色',
        extend: '',
      },
      {
        id: 2,
        name: '蓝色',
        extend: '',
      },
    ]
  },
  methods: {
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
    addSpecAttr() {
      this.specAttrId = 0
      this.showEdit = true
    },
    handleEdit(val) {
      this.specAttrId = val.id
      this.showEdit = true
    },
    handleDelete(val) {
      console.log('val: ', val)
    },
    editClose() {
      this.showEdit = false
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
