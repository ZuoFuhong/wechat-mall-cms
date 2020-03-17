<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="title plus">
        <span>分类列表</span>
        <el-button type="primary" plain style="margin-left: 30px;" @click="addCategory">添加分类</el-button>
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
            <el-table-column label="操作" fixed="right" width="230">
              <template slot-scope="scope">
                <el-button plain size="mini" @click="handleSubCategory(scope.row)" type="primary">子分类</el-button>
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
    </div>
    <category-edit v-else @editClose="editClose" :categoryId="categoryId"></category-edit>
  </div>
</template>

<script>
import CategoryEdit from './CategoryEdit'
import category from '@/models/category'

export default {
  // 建模，category
  components: {
    CategoryEdit,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      showEdit: false,
      categoryId: 0,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
    }
  },
  async created() {
    await this.getCategorys(0, 1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
    async getCategorys(pid, pageNum, pageSize) {
      const res = await category.getCategoryList(pid, pageNum, pageSize)
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
    handleSubCategory(val) {
      console.log('val:', val)
      const path = `/sub_category/${val.id}/list`
      this.$router.push(path)
    },
    addCategory() {
      this.categoryId = 0
      this.showEdit = true
    },
    async editClose() {
      this.showEdit = false
      await this.getCategorys()
    },
    handleEdit(val) {
      this.categoryId = val.id
      this.showEdit = true
    },
    handleDelete(val) {
      console.log('val:', val)
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await category.deleteCategory(val.id)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          await this.getCategorys()
          this.$message.success('操作成功！')
        }
      })
    },
    currentChange(pageNum) {
      this.getCategorys(0, pageNum, this.pagination.pageSize)
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
