<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title plus">
          <span>分组列表</span>
          <el-button type="primary" plain style="margin-left: 30px;" @click="addGroup">添加分组</el-button>
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
          <el-table-column prop="name" label="名称" width="180"> </el-table-column>
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
    <group-edit v-else @editClose="editClose" :groupId="groupId"></group-edit>
  </div>
</template>

<script>
import admin from '@/models/admin'
import GroupEdit from './GroupEdit'

export default {
  components: {
    GroupEdit
  },
  data() {
    return {
      tableColumn: [
        { prop: 'id', label: 'id' },
        { prop: 'name', label: '名称' },
        { prop: 'description', label: '描述' },
      ],
      tableData: [],
      loading: true,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
      },
      showEdit: false,
      groupId: 0
    }
  },
  async created() {
    await this.getGroupList(1, this.pagination.pageSize)
    this.loading = false
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async getGroupList(page, size) {
      const res = await admin.getGroupList(page, size)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.tableData = res.list
        this.pagination.pageTotal = res.total
      }
    },
    handleEdit(val) {
      this.groupId = val.id
      this.showEdit = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await admin.deleteGroup(val.id)
        if (res.error_code === undefined) {
          this.getGroupList(1, this.pagination.pageSize)
          this.$message({
            type: 'success',
            message: '删除成功！',
          })
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    },
    async editClose() {
      this.showEdit = false
      await this.getGroupList(1, this.pagination.pageSize)
    },
    currentChange(pageNum) {
      this.getGroupList(pageNum, this.pagination.pageSize)
    },
    addGroup() {
      this.groupId = 0
      this.showEdit = true
    }
  }
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
