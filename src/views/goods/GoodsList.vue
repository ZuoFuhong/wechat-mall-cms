<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="title plus">
        <span>商品列表</span>
        <el-button type="primary" plain style="margin-left: 30px;" @click="addGoods">添加商品</el-button>
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
            <el-table-column prop="subTitle" label="副标题" width="150"> </el-table-column>
            <el-table-column prop="category" label="分类" width="150"> </el-table-column>
            <el-table-column prop="price" label="价格（元）" width="150"> </el-table-column>
            <el-table-column prop="online" label="是否上架" width="150"> </el-table-column>
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
    <goods-edit v-else @editClose="editClose" :goodsId="goodsId"></goods-edit>
  </div>
</template>

<script>
import GoodsEdit from './GoodsEdit'

export default {
  components: {
    GoodsEdit,
  },
  data() {
    return {
      loading: true,
      tableData: [],
      pagination: {
        pageSize: 1,
        pageTotal: 10,
      },
      showEdit: false,
      goodsId: 0,
    }
  },
  created() {
    this.loading = false
    this.tableData = [
      {
        id: 1,
        picture: 'http://i1.sleeve.7yue.pro/32ba82d0-4fbe-4bbb-b833-fdc8d397bb34.png',
        title: '青锋大碗',
        subTitle: '凡凡倾情推荐',
        category: '餐具',
        price: '10.10',
        online: '是',
      },
      {
        id: 2,
        picture: 'http://i1.sleeve.7yue.pro/2d8d42c3-2b41-458b-8e09-48be6890c13f.png',
        title: '印花桌布',
        subTitle: '生活需要仪式感',
        category: '服装',
        price: '19.10',
        online: '是',
      },
    ]
  },
  methods: {
    addGoods() {
      this.goodsId = 0
      this.showEdit = true
    },
    handleEdit(val) {
      this.goodsId = val.id
      this.showEdit = true
    },
    handleDelete(val) {
      // todo: 请求
      console.log('val: ', val)
    },
    editClose() {
      this.showEdit = false
    },
    currentChange(page) {
      // todo: 切换分页
      console.log('page: ', page)
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
