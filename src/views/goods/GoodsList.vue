<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="search">
        <el-row>
          <el-form :model="searchForm" status-icon ref="searchForm" label-width="100px" @submit.native.prevent>
            <el-col :lg="5">
              <el-form-item label="商品标题" prop="title">
                <el-input size="medium" v-model="searchForm.goodsName" maxlength="15" placeholder="搜索商品名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="5">
              <el-form-item label="商品分类" prop="categoryId">
                  <el-cascader v-model="optionCategory" :props="categoryProps" clearable @change="handleOptionCategory"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :lg="5">
              <el-form-item label="上下架" prop="categoryId">
                  <el-select clearable v-model="searchForm.online" placeholder="请选择">
                    <el-option
                      v-for="item in onlineStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="5">
              <div class="searchButton">
                <el-button plain type="info" @click="handleSearchGoods('searchForm')">搜索</el-button>
              </div>
            </el-col>
          </el-form>
        </el-row>
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
            <el-table-column prop="title" label="标题" width="350"> </el-table-column>
            <el-table-column prop="categoryName" label="分类" width="150"> </el-table-column>
            <el-table-column prop="price" label="价格（元）" width="150"> </el-table-column>
            <el-table-column prop="online" :formatter="formatOnline" label="是否上架"> </el-table-column>
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
import goods from '@/models/goods'
import category from '@/models/category'

export default {
  components: {
    GoodsEdit,
  },
  data() {
    const that = this
    return {
      loading: true,
      tableData: [],
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      showEdit: false,
      goodsId: 0,
      searchForm: {
        goodsName: '',
        categoryId: null,
        online: null
      },
      optionCategory: [],
      categoryProps: {
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level, value } = node
          if (level === 0) {
            const arr = await that.getCategory(0)
            resolve(arr)
          }
          if (level === 1) {
            const arr = await that.getCategory(value)
            resolve(arr)
          }
        }
      },
      onlineStatus: [
        {
          value: 0,
          label: '下架'
        },
        {
          value: 1,
          label: '上架'
        }
      ]
    }
  },
  async created() {
    await this.getGoodsList(1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
    // 搜索商品
    async getGoodsList(page, size) {
      const { goodsName } = this.searchForm
      let { categoryId, online } = this.searchForm
      if (!categoryId) {
        categoryId = 0
      }
      if (!online && online !== 0) {
        online = -1
      }
      const res = await goods.getGoodsList(categoryId, goodsName, online, page, size)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    // 选择的分类
    handleOptionCategory() {
      if (this.optionCategory.length === 2) {
        const [, b] = this.optionCategory
        this.searchForm.categoryId = b
      } else {
        this.searchForm.categoryId = 0
      }
    },
    // 查询分类
    async getCategory(pid) {
      const res = await category.getCategoryList(pid, 1, 100)
      if (res.error_code !== undefined) {
        console.log(res.msg)
      } else {
        const tmpArr = []
        for (let i = 0; i < res.list.length; i++) {
          const item = res.list[i]
          tmpArr.push({
            value: item.id,
            label: item.name,
            leaf: item.parentId !== 0
          })
        }
        return tmpArr
      }
    },
    formatOnline(row) {
      return row.online === 1 ? '上架' : '下架'
    },
    addGoods() {
      this.goodsId = 0
      this.showEdit = true
    },
    handleEdit(val) {
      this.goodsId = val.id
      this.showEdit = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await goods.deleteGoods(val.id)
        if (res.error_code === undefined) {
          this.getGoodsList(1, this.pagination.pageSize)
          this.$message({
            type: 'success',
            message: '删除成功！',
          })
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    },
    editClose() {
      this.showEdit = false
      this.getGoodsList(1, this.pagination.pageSize)
    },
    currentChange(pageNum) {
      this.getGoodsList(pageNum, this.pagination.pageSize)
    },
    handleSearchGoods() {
      this.getGoodsList(1, this.pagination.pageSize)
    }
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
    padding: 0 20px;
  }
  .search {
    padding: 20px 0px 0px;
    .searchButton {
      display: flex;
      height: 40px;
      margin-left: 30px;
    }
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
