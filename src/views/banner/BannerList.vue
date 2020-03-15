<template>
  <div class="container">
    <div class="header">
      <div class="title">Banner列表</div>
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
        <el-table-column prop="name" label="名称" width="180"> </el-table-column>
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
</template>

<script>
import banner from '@/models/banner'

export default {
  data() {
    return {
      tableColumn: [
        { prop: 'id', label: 'id' },
        { prop: 'picture', label: '图片' },
        { prop: 'name', label: '名称' },
        { prop: 'title', label: '标题' },
        { prop: 'description', label: '描述' },
      ],
      tableData: [],
      loading: true,
      pagination: {
        pageSize: 10,
        pageTotal: 50,
      },
    }
  },
  async created() {
    await this.getBanners()
    this.loading = false
  },
  methods: {
    async getBanners() {
      try {
        const res = await banner.getBannerList(1, this.pagination.pageSize)
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      } catch (error) {
        console.log(error)
        this.tableData = []
      }
    },
    handleEdit(val) {
      const path = `/banner/edit/${val.id}`
      this.$router.push(path)
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该Banner, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await banner.deleteBanner(val.id)
        if (res.error_code === undefined) {
          this.getBanners()
          this.$message({
            type: 'success',
            message: '删除成功！',
          })
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    },
    async currentChange(pageNum) {
      try {
        const res = await banner.getBannerList(pageNum, this.pagination.pageSize)
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      } catch (error) {
        console.log(error)
        this.tableData = []
      }
    },
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
