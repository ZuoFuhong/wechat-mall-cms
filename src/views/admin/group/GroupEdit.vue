<template>
  <div>
    <div class="container">
      <div class="title">
        <span>修改规格值</span>
        <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      </div>
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form
              :rules="rules"
              :model="form"
              status-icon
              ref="form"
              label-width="100px"
              v-loading="loading"
              @submit.native.prevent
            >
              <el-form-item label="名称" prop="name">
                <el-input size="medium" v-model="form.name" maxlength="10" show-word-limit placeholder="请填写名称"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input size="medium" v-model="form.description" placeholder="请填写描述"></el-input>
              </el-form-item>
              <el-form-item label="权限" prop="description">
                <div v-for="moduleItem in authsModule" :key="moduleItem.id">
                  <el-checkbox :indeterminate="indeterminateList[moduleItem.id]" v-model="checkAll[moduleItem.id]" @change="handleCheckAllChange(moduleItem.id)">{{moduleItem.name}}</el-checkbox>
                  <div style="margin: 15px 0;"></div>
                  <el-checkbox-group v-model="checkedCities[moduleItem.id]" @change="handleCheckedCitiesChange(moduleItem.id)" style="background: #f5f5f6; padding: 5px 20px; margin-bottom:20px;">
                    <el-checkbox v-for="page in moduleItem.pageList" :label="page.id" :key="page.id">{{page.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-form-item>
              <el-form-item class="submit">
                <el-button type="primary" @click="submitForm('form')">保 存</el-button>
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import admin from '@/models/admin'

export default {
  props: {
    groupId: {
      type: Number,
    }
  },
  data() {
    const nameFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('名称不能为空'))
      }
      callback()
    }
    return {
      loading: true,
      form: {
        name: '',
        description: '',
        auths: []
      },
      rules: {
        name: [{ validator: nameFunc, trigger: 'blur', required: true }],
      },
      authsModule: [],
      checkAll: {},
      indeterminateList: {},
      checkedCities: {},
    }
  },
  async created() {
    console.log(this.groupId)
    await this.getAuthsModule()
    if (this.groupId !== 0) {
      await this.getGroup(this.groupId)
    }
    this.loading = false
  },
  methods: {
    async getGroup(groupId) {
      const res = await admin.getGroup(groupId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.form = res
        const modules = this.authsModule
        for (let i = 0; i < modules.length; i++) {
          const tmpChecks = []
          for (let j = 0; j < modules[i].pageList.length; j++) {
            const page = modules[i].pageList[j]
            if (res.auths.includes(page.id)) {
              tmpChecks.push(page.id)
            }
          }
          const moduleId = modules[i].id
          const checkedCount = tmpChecks.length
          const pageTotal = this.extraceModuleAllPage(moduleId).length
          this.checkAll[moduleId] = pageTotal === checkedCount
          this.indeterminateList[moduleId] = checkedCount > 0 && checkedCount < pageTotal
          // 错误写法
          // this.checkedCities[modules[i].id] = tmpChecks
          // vue变化检测
          this.$set(this.checkedCities, moduleId, tmpChecks)
        }
      }
    },
    async getAuthsModule() {
      const res = await admin.getAuthsModule()
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.authsModule = res
        for (let i = 0; i < res.length; i++) {
          // 错误写法
          // this.checkedCities[res[i].id] = []
          // this.indeterminateList[res[i].id] = false
          // vue变化检测
          this.$set(this.checkedCities, res[i].id, [])
          this.$set(this.indeterminateList, res[i].id, false)
        }
      }
    },
    handleCheckAllChange(moduleId) {
      const status = this.checkAll[moduleId]
      const tmpChecks = this.extraceModuleAllPage(moduleId)
      this.checkedCities[moduleId] = status ? tmpChecks : []
      this.indeterminateList[moduleId] = false
    },
    handleCheckedCitiesChange(moduleId) {
      const pageTotal = this.extraceModuleAllPage(moduleId).length
      const checkedCount = this.checkedCities[moduleId].length
      this.checkAll[moduleId] = pageTotal === checkedCount
      this.indeterminateList[moduleId] = checkedCount > 0 && checkedCount < pageTotal
    },
    // 提取单个模块所有页面
    extraceModuleAllPage(moduleId) {
      const modules = this.authsModule
      const tmpChecks = []
      for (let i = 0; i < modules.length; i++) {
        const moduleItem = modules[i]
        if (moduleItem.id === moduleId) {
          for (let j = 0; j < moduleItem.pageList.length; j++) {
            tmpChecks.push(moduleItem.pageList[j].id)
          }
        }
      }
      return tmpChecks
    },
    back() {
      this.$emit('editClose')
    },
    async submitForm() {
      try {
        if (this.form.name === '') {
          this.$message.error('名称为必填项')
          return
        }
        const auths = []
        for (const i in this.checkedCities) {
          const tmpArr = this.checkedCities[i]
          for (let j = 0; j < tmpArr.length; j++) {
            auths.push(tmpArr[j])
          }
        }
        const postData = {
          id: this.groupId,
          name: this.form.name,
          description: this.form.description,
          auths
        }
        const res = await admin.editGroup(postData)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('操作成功！')
          this.back()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      for (const i in this.checkedCities) {
        this.checkedCities[i] = []
        this.checkAll[i] = false
        this.indeterminateList[i] = false
      }
    },
  },
  computed: {
    title() {
      return this.groupId === 0 ? '新增分组' : '更新分组'
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

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }
  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
