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
          <el-table-column prop="standard" label="标准" width="150"> </el-table-column>
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
export default {
  components: {},
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 1,
        pageTotal: 10,
      },
      specId: 0,
    }
  },
  created() {
    this.tableData = [
      {
        id: 1,
        name: '颜色',
        description: '',
        unit: '英寸',
        standard: '是',
      },
      {
        id: 2,
        name: '颜色',
        description: '',
        unit: '英寸',
        standard: '是',
      },
    ]
  },
  methods: {
    handleEdit(val) {
      this.$router.push(`/spec/edit/${val.id}`)
    },
    handleDelete(val) {
      console.log('val: ', val)
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
