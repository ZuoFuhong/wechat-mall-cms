<template>
  <div>
    <div class="container">
      <div class="title">规格名列表</div>
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
</template>

<script>
import Spec from '@/models/spec'

export default {
  components: {},
  data() {
    return {
      loading: true,
      tableData: [],
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      specId: 0,
    }
  },
  async created() {
    await this.getSpecList(1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
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
      this.$router.push(`/spec/edit/${val.id}`)
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
