<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="title plus">
        <span>SKU列表</span>
        <el-button type="primary" plain style="margin-left: 30px;" @click="addSKU">添加SKU</el-button>
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
            <el-table-column prop="price" label="价格（元）" width="150"> </el-table-column>
            <el-table-column prop="online" :formatter="formatOnline" label="是否上架" width="120"> </el-table-column>
            <el-table-column prop="code" label="编码" width="150"> </el-table-column>
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
import SkuEdit from './SKUEdit'
import Sku from '@/models/sku'

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
    }
  },
  async created() {
    await this.getSkuList(1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
    async getSkuList(page, size) {
      const res = await Sku.getSkuList(page, size)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    addSKU() {
      this.skuId = 0
      this.showEdit = true
    },
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
          this.getSkuList(1, this.pagination.pageSize)
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
      this.getSkuList(1, this.pagination.pageSize)
    },
    currentChange(pageNum) {
      this.getSkuList(pageNum, this.pagination.pageSize)
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
