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
            <el-table-column prop="picture" label="图片" width="180">
              <template slot-scope="scope">
                <img class="categoryPicture" :src="scope.row.picture" alt="" />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="150"> </el-table-column>
            <el-table-column prop="name" label="名称" width="120"> </el-table-column>
            <el-table-column prop="category" label="分类" width="120"> </el-table-column>
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
    <grid-category-edit v-else @editClose="editClose" :gridCategoryId="gridCategoryId"></grid-category-edit>
  </div>
</template>

<script>
import GridCategoryEdit from './GridCategoryEdit'

export default {
  components: {
    GridCategoryEdit,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 1,
        pageTotal: 10,
      },
      gridCategoryId: 0,
      showEdit: false,
    }
  },
  created() {
    // todo: 加载宫格
    this.tableData = [
      {
        id: 1,
        picture: 'http://i1.sleeve.7yue.pro/grid/clothing.png',
        title: '服装',
        name: '',
        category: '服装',
      },
      {
        id: 2,
        picture: 'http://i1.sleeve.7yue.pro/grid/bag.png',
        title: '包包',
        name: '',
        category: '服装',
      },
    ]
  },
  methods: {
    handleEdit(val) {
      this.gridCategoryId = val.id
      this.showEdit = true
    },
    handleDelete(val) {
      console.log('val: ', val)
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
