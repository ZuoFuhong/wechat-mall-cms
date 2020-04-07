<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="search">
        <el-row>
          <el-form :model="searchForm" status-icon ref="searchForm" label-width="100px" @submit.native.prevent>
            <el-col :lg="5">
              <el-form-item label="商品" prop="goodsId">
                  <el-cascader
                  clearable
                  :props="cascaderProps"
                  :show-all-levels="false"
                  v-model="goodsOption"
                  :options="goodsOptions"
                  @change="handleGoodsChange"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :lg="5">
              <el-form-item label="标题" prop="title">
                <el-input size="medium" v-model="searchForm.title" maxlength="15" placeholder="搜索SKU标题"></el-input>
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
              <div class="btn-group">
                <el-button plain type="primary" @click="handleSearchGoods('searchForm')"><i class="el-icon-search"></i> 搜索</el-button>
                <el-button plain type="primary" @click="handleAddSKU()"><i class="el-icon-plus"></i> 添加SKU</el-button>
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
            <el-table-column prop="title" label="标题" width="200"> </el-table-column>
            <el-table-column prop="price" label="价格（元）" width="150"> </el-table-column>
            <el-table-column prop="online" :formatter="formatOnline" label="是否上架" width="120"> </el-table-column>
            <el-table-column prop="stock" label="库存（个）" width="150"> </el-table-column>
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
    <sku-edit v-else @editClose="editClose" :skuId="skuId"></sku-edit>
  </div>
</template>

<script>
import SkuEdit from './edit'
import Sku from '@/models/sku'
import goods from '@/models/goods'

export default {
  components: {
    SkuEdit,
  },
  data() {
    return {
      loading: true,
      tableData: [],
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      showEdit: false,
      skuId: 0,
      searchForm: {
        title: '',
        goodsId: null,
        online: null
      },
      cascaderProps: {
        expandTrigger: 'hover',
      },
      // 选择的商品
      goodsOption: [],
      goodsOptions: [],
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
    await this.loadSkuList(1, this.pagination.pageSize)
    await this.loadChooseGoodsList()
    this.loading = false
  },
  methods: {
    // 搜索sku
    handleSearchGoods() {
      this.loadSkuList(1, this.pagination.pageSize)
    },
    // 加载sku列表
    async loadSkuList(page, size) {
      const condition = this.searchForm
      let { online } = condition
      if (!online && online !== 0) {
        online = -1
      }
      const res = await Sku.getSkuList(condition.goodsId, condition.title, online, page, size)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    // 加载可选择的商品
    async loadChooseGoodsList() {
      this.goodsOptions = await goods.getGoodsAll()
    },
    // 选择商品
    handleGoodsChange(val) {
      if (val.length === 3) {
        const goodsId = val['2']
        this.searchForm.goodsId = goodsId
      } else {
        this.searchForm.goodsId = 0
        this.specList = []
      }
    },
    // 添加SKU
    handleAddSKU() {
      this.skuId = 0
      this.showEdit = true
    },
    // 编辑SKU
    handleEdit(val) {
      this.skuId = val.id
      this.showEdit = true
    },
    async handleDelete(val) {
      this.$confirm('此操作将永久删除该Sku, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await Sku.deleteSku(val.id)
        if (res.error_code === undefined) {
          this.loadSkuList(1, this.pagination.pageSize)
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
      this.loadSkuList(1, this.pagination.pageSize)
    },
    currentChange(pageNum) {
      this.loadSkuList(pageNum, this.pagination.pageSize)
    },
    formatOnline(row) {
      return row.online === 1 ? '上架' : '下架'
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
    .btn-group {
      display: flex;
      align-items: center;
      margin-left: 20px;
      padding: 4px 0;
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
