<template>
  <div class="container">
    <div class="title">
      <span>{{ title }}</span>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col :lg="8" :md="20" :sm="24" :xs="24">
          <el-form :rules="rules" :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="名称" prop="name">
              <el-input size="medium" v-model="form.name" maxlength="10" show-word-limit placeholder="请填写名称"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="picture">
              <upload-imgs
                :value="initPictureData"
                :remoteFuc="uploadFile"
                ref="uploadEle"
                :rules="fileRules"
                :multiple="false"
                :max-num="1"
                :animated-check="true"
              />
            </el-form-item>
            <el-form-item label="关联商品" prop="goodsId">
                <el-cascader
                clearable
                :props="cascaderProps"
                :show-all-levels="false"
                v-model="goodsOption"
                :options="goodsOptions"
                @change="handleGoodsChange"></el-cascader>
            </el-form-item>
            <el-form-item label="是否显示" prop="status">
              <el-switch
                v-model="bannerStatus"
                @change="doSwitchBannerStatus"
                active-text="显示"
                inactive-text="隐藏">
              </el-switch>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" v-auth="['管理Banner']" @click="submitForm('form')">保 存</el-button>
              <el-button v-auth="['管理Banner']" @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import UploadImgs from '@/components/base/upload-imgs'
import banner from '@/models/banner'
import goods from '@/models/goods'
import oss from '@/models/oss'

export default {
  components: {
    UploadImgs,
  },
  props: {
    bannerId: {
      type: Number
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
    const pictureFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('图片不能为空'))
      }
      callback()
    }
    return {
      form: {
        name: '',
        picture: '',
        goodsId: 0,
        status: 0
      },
      rules: {
        name: [{ validator: nameFunc, trigger: 'blur', required: true }],
        picture: [{ validator: pictureFunc, trigger: 'blur', required: true }],
      },
      fileRules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
      initPictureData: [],
      bannerStatus: false,
      // 选择关联商品
      cascaderProps: {
        expandTrigger: 'hover',
      },
      goodsOption: [],
      goodsOptions: [],
    }
  },
  async created() {
    console.log('bannerId: ', this.bannerId)
    if (this.bannerId !== 0) {
      await this.getBanner(this.bannerId)
    }
    await this.loadChooseGoodsList()
  },
  computed: {
    title() {
      return this.bannerId === 0 ? '新增Banner' : '更新Banner'
    }
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const res = await banner.updateBanner({
              id: this.bannerId,
              picture: this.form.picture,
              name: this.form.name,
              businessType: 1,
              businessId: this.form.goodsId,
              status: this.form.status
            })
            if (res.error_code === undefined) {
              this.$message.success('操作成功！')
              this.back()
            } else {
              this.$message.error(`${res.msg}`)
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          return false
        }
      })
    },
    // 加载可选择的商品
    async loadChooseGoodsList() {
      this.goodsOptions = await goods.getGoodsAll()
    },
    // 选择商品
    handleGoodsChange(val) {
      if (val.length === 3) {
        const goodsId = val['2']
        this.form.goodsId = goodsId
      } else {
        this.form.goodsId = 0
      }
    },
    async getBanner(bannerId) {
      try {
        const res = await banner.getBanner(bannerId)
        if (res.error_code !== undefined) {
          this.$message.erorr(`${res.msg}`)
          return
        }
        this.form = {
          name: res.name,
          picture: res.picture,
          goodsId: res.goodsId,
          status: res.status
        }
        this.initPictureData = [
          {
            id: res.id,
            display: res.picture,
          },
        ]
        this.goodsOption = [res.categoryId, res.subCategoryId, res.goodsId]
        this.bannerStatus = res.status === 1
      } catch (error) {
        if (error.error_code === 10020) {
          this.tableData = []
        }
      }
    },
    back() {
      this.$emit('editClose')
    },
    async getUploadFile(name) {
      return this.$refs[name].getValue()
    },
    // 重写插件中上传文件
    async uploadFile(file, call) {
      const data = await oss.uploadFileToOSS(file, 'assets/')
      call(data)
      this.form.picture = data.url
    },
    // 清理上传的图片
    clearUploadFile() {
      this.$refs.uploadEle.clear()
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    doSwitchBannerStatus(res) {
      this.form.status = res ? 1 : 0
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
  .plus {
    -webkit-box-align: center;
    align-items: center;
  }
}
</style>
