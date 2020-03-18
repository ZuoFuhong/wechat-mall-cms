<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="title plus">
        <span>宫格列表</span>
        <el-button type="primary" plain style="margin-left: 30px;" @click="addGridCategory">添加宫格</el-button>
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
            <el-table-column prop="picture" label="图片" width="150">
              <template slot-scope="scope">
                <img class="categoryPicture" :src="scope.row.picture" alt="" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="150"> </el-table-column>
            <el-table-column prop="categoryName" label="商品分类"> </el-table-column>
            <el-table-column label="操作" fixed="right" width="230">
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
    </div>
    <grid-category-edit v-else @editClose="editClose" :gridCategoryId="gridCategoryId"></grid-category-edit>
  </div>
</template>

<script>
import GridCategoryEdit from './GridCategoryEdit'
import gridCategory from '@/models/grid_category'

export default {
  components: {
    GridCategoryEdit,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      gridCategoryId: 0,
      showEdit: false,
    }
  },
  async created() {
    await this.getGridCategorys()
  },
  methods: {
    async getGridCategorys() {
      const res = await gridCategory.getGridCategoryList(1, this.pagination.pageSize)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    handleEdit(val) {
      this.gridCategoryId = val.id
      this.showEdit = true
    },
    async handleDelete(val) {
      this.$confirm('此操作将永久删除该宫格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await gridCategory.deleteGridCategory(val.id)
        if (res.error_code === undefined) {
          this.getGridCategorys()
          this.$message({
            type: 'success',
            message: '删除成功！',
          })
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    },
    addGridCategory() {
      this.gridCategoryId = 0
      this.showEdit = true
    },
    currentChange(page) {
      console.log(page)
    },
    editClose() {
      this.showEdit = false
      this.getGridCategorys()
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
