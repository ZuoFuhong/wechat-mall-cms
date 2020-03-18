<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title plus">
          <span>Banner列表</span>
          <el-button type="primary" plain style="margin-left: 30px;" @click="addBanner">添加Banner</el-button>
        </div>
      </div>
      <div class="banner-table">
        <el-table
          v-loading="loading"
          stripe
          row-key="id"
          :data="tableData"
          :highlight-current-row="true"
          style="width: 100%"
        >
          <el-table-column prop="id" label="id" width="80"> </el-table-column>
          <el-table-column prop="picture" label="图片" width="180">
            <template slot-scope="scope">
              <img class="bannerPicture" :src="scope.row.picture" alt="" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" width="180"> </el-table-column>
          <el-table-column prop="description" label="描述"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="175">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="handleEdit(scope.row)" type="primary">查看</el-button>
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
    <banner-edit v-else @editClose="editClose" :bannerId="bannerId"></banner-edit>
  </div>
</template>

<script>
import banner from '@/models/banner'
import BannerEdit from './BannerEdit'

export default {
  components: {
    BannerEdit
  },
  data() {
    return {
      tableColumn: [
        { prop: 'id', label: 'id' },
        { prop: 'picture', label: '图片' },
        { prop: 'title', label: '标题' },
        { prop: 'description', label: '描述' },
      ],
      tableData: [],
      loading: true,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      showEdit: false,
      bannerId: 0
    }
  },
  async created() {
    await this.getBanners(1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
    async getBanners(pageNum, pageSize) {
      try {
        const res = await banner.getBannerList(pageNum, pageSize)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.tableData = res.list
          this.pagination.pageTotal = res.total
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleEdit(val) {
      this.bannerId = val.id
      this.showEdit = true
    },
    addBanner() {
      this.bannerId = 0
      this.showEdit = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该Banner, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await banner.deleteBanner(val.id)
        if (res.error_code === undefined) {
          this.getBanners(1, this.pagination.pageSize)
          this.$message({
            type: 'success',
            message: '删除成功！',
          })
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    },
    currentChange(pageNum) {
      this.getBanners(pageNum, this.pagination.pageSize)
    },
    editClose() {
      this.showEdit = false
      this.getBanners(1, this.pagination.pageSize)
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      font-size: 16px;
      font-weight: 500;
      color: $parent-title-color;
    }

    .plus {
      -webkit-box-align: center;
      align-items: center;
    }
  }
  .banner-table {
    position: relative;

    .bannerPicture {
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
