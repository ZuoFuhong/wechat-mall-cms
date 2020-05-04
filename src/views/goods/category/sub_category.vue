<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="title plus">
        <span>子分类列表</span>
        <el-button type="primary" plain style="margin-left: 30px;" @click="addCategory">添加子分类</el-button>
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
            <el-table-column prop="picture" label="图片" width="180">
              <template slot-scope="scope">
                <img class="categoryPicture" :src="scope.row.picture" alt="" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="150"> </el-table-column>
            <el-table-column prop="status" :formatter="formatStatus" label="状态" width="120"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button plain size="mini" @click="handleEdit(scope.row)" type="primary">编辑</el-button>
                <el-button plain size="mini" v-auth="['管理商品分类']" @click="handleDelete(scope.row)" type="danger">删除</el-button>
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
    </div>
    <category-edit v-else @editClose="editClose" :categoryId="categoryId"></category-edit>
  </div>
</template>

<script>
import CategoryEdit from './edit'
import category from '@/models/category'

export default {
  components: {
    CategoryEdit,
  },
  data() {
    return {
      loading: true,
      tableData: [],
      pagination: {
        pageSize: 10,
        pageTotal: 100,
      },
      showEdit: false,
      pid: 0,
      categoryId: 0,
    }
  },
  async created() {
    this.pid = this.$route.params.id
    console.log('pid: ', this.pid)
    await this.getCategorys()
    this.loading = false
  },
  methods: {
    async getCategorys() {
      const res = await category.getCategoryList(this.pid, 1, this.pagination.pageSize)
      if (res.error_code !== undefined) {
        this.$message.error(`查询异常: ${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    formatStatus(row) {
      return row.online === 1 ? '上线' : '下线'
    },
    handleEdit(val) {
      this.categoryId = val.id
      this.showEdit = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await category.deleteCategory(val.id)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('删除成功！')
          this.getCategorys()
        }
      })
    },
    addCategory() {
      this.categoryId = 0
      this.showEdit = true
    },
    async editClose() {
      this.showEdit = false
      await this.getCategorys()
    },
    currentChange(pageNum) {
      this.getCategoryList(this.pid, pageNum, this.pagination.pageSize)
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
