<template>
  <div>
    <div class="container">
      <div class="title">
        <span>{{ title }}</span>
        <span v-if="goodsId !== 0" class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      </div>
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form :rules="rules" :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
              <el-form-item label="标题" prop="title">
                <el-input size="medium" v-model="form.title" maxlength="60" show-word-limit placeholder="请填写标题"></el-input>
              </el-form-item>
              <el-form-item label="价格" prop="price">
                <el-input-number v-model="form.price" :precision="2" :step="1" :min="0.01" :max="100000" label="价格"></el-input-number>
              </el-form-item>
              <el-form-item label="折扣" prop="discountPrice">
                <el-input-number v-model="form.discountPrice" :precision="2" :step="0.1" :min="0" :max="0.99" label="价格"></el-input-number>
              </el-form-item>
              <el-form-item label="分类" prop="categoryId">
                <el-select v-model="form.categoryId" placeholder="请选择分类" @change="doSelectCategory">
                  <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="form.subCategoryId" placeholder="请选择子分类" :disabled="subCategoryDisaled" style="margin-left: 20px;">
                  <el-option v-for="item in subCategoryList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主图" prop="picture">
                <upload-imgs
                :value="initPictureData"
                :remoteFuc="uploadFile"
                ref="pictureEle"
                :rules="fileRules"
                :multiple="false" :max-num="1" :animated-check="true" />
              </el-form-item>
              <el-form-item label="轮播图" prop="bannerPicture">
                <upload-imgs
                  :value="initBannerPictureData"
                  :remoteFuc="uploadFile"
                  ref="bannerPictureEle"
                  :rules="fileRules"
                  :multiple="false"
                  :max-num="5"
                  :animated-check="true"
                />
              </el-form-item>
              <el-form-item label="详情图" prop="detailPicture">
                <upload-imgs
                  :value="initDetailPictureData"
                  :remoteFuc="uploadFile"
                  ref="detailPictureEle"
                  :rules="fileRules"
                  :multiple="false"
                  :max-num="8"
                  :animated-check="true"
                />
              </el-form-item>
              <el-form-item label="选择规格" prop="specId">
                <el-checkbox-group v-model="checkedSpecs">
                  <el-checkbox v-for="spec in specList" :label="spec.id" :key="spec.id">{{ spec.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="是否上架" prop="online">
                <el-switch
                  v-model="onlineStatus"
                  @change="doSwitchOnlineEvent"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="上架"
                  inactive-text="下架"
                >
                </el-switch>
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
import UploadImgs from '@/components/base/upload-imgs'
import goods from '@/models/goods'
import oss from '@/models/oss'
import category from '@/models/category'
import Spec from '@/models/spec'

export default {
  components: {
    UploadImgs,
  },
  data() {
    const titleFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('标题不能为空'))
      }
      callback()
    }
    const priceFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('价格不能为空'))
      }
      callback()
    }
    return {
      loading: true,
      form: {
        id: 0,
        brandName: '',
        title: '',
        price: 0,
        discountPrice: 0,
        categoryId: null,
        subCategoryId: null,
        online: 0,
        picture: '',
        bannerPicture: '',
        detailPicture: '',
        tags: ''
      },
      onlineStatus: false,
      rules: {
        title: [{ validator: titleFunc, trigger: 'blur', required: true }],
        price: [{ validator: priceFunc, trigger: 'blur', required: true }],
      },
      fileRules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
      inputVisible: false,
      inputValue: '',
      specList: [],
      checkedSpecs: [],
      categoryList: [],
      subCategoryList: [],
      initPictureData: [],
      initBannerPictureData: [],
      initDetailPictureData: [],
      subCategoryDisaled: true
    }
  },
  props: {
    goodsId: {
      type: Number,
      default: 0
    },
  },
  async created() {
    console.log('goodsId: ', this.goodsId)
    if (this.goodsId !== 0) {
      await this.getGoods(this.goodsId)
    }
    await this.getCategory()
    if (this.form.categoryId) {
      await this.getSubCategory(this.form.categoryId)
    }
    await this.getSpecList()
    await this.getGoodsSpec(this.goodsId)
    this.loading = false
  },
  computed: {
    title() {
      return this.goodsId === 0 ? '添加商品' : '更新商品'
    },
  },
  methods: {
    async submitForm() {
      try {
        const pictureFiles = await this.getUploadFile('pictureEle')
        const bannerPictureFiles = await this.getUploadFile('bannerPictureEle')
        const detailPicturepictureFiles = await this.getUploadFile('detailPictureEle')
        if (this.form.title === '') {
          this.$message.error('标题为必填项！')
          return
        }
        if (!this.form.price) {
          this.$message.error('售价不能为空！')
          return
        }
        if (this.form.price < 0.01) {
          this.$message.error('售价大于0.01')
          return
        }
        if (!this.form.categoryId) {
          this.$message.error('请选择分类！')
          return
        }
        if (!this.form.subCategoryId) {
          this.$message.error('请选择子分类！')
          return
        }
        if (pictureFiles.length === 0) {
          this.$message.error('请上传主图！')
          return
        }
        if (bannerPictureFiles.length === 0) {
          this.$message.error('至少上传一张轮播图！')
          return
        }
        if (detailPicturepictureFiles.length === 0) {
          this.$message.error('至少上传一张详情图！')
          return
        }
        const picture = pictureFiles[0].display
        const bannerPicture = []
        for (let i = 0; i < bannerPictureFiles.length; i++) {
          bannerPicture.push(bannerPictureFiles[i].display)
        }
        const detailPicture = []
        for (let i = 0; i < detailPicturepictureFiles.length; i++) {
          detailPicture.push(detailPicturepictureFiles[i].display)
        }
        const postData = {
          id: this.goodsId,
          brandName: this.form.brandName,
          title: this.form.title,
          price: (this.form.price).toString(),
          discountPrice: (this.form.discountPrice).toString(),
          categoryId: this.form.subCategoryId,
          online: this.form.online,
          picture,
          bannerPicture: JSON.stringify(bannerPicture),
          detailPicture: JSON.stringify(detailPicture),
          tags: '',
          description: '',
          specList: this.checkedSpecs
        }
        const res = await goods.editGoods(postData)
        if (res.error_code !== undefined) {
          this.$message.error(`${res.msg}`)
        } else {
          this.$message.success('操作成功！')
          if (this.goodsId === 0) {
            this.$router.push('/goods/list')
          } else {
            this.back()
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async getGoods(goodsId) {
      const res = await goods.getGoods(goodsId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.form = res
        if (res.categoryId === 0) {
          this.form.categoryId = null
        }
        if (res.subCategoryId === 0) {
          this.form.subCategoryId = null
        }
        this.onlineStatus = res.online === 1
        this.initPictureData = [
          {
            id: res.id,
            display: res.picture
          }
        ]
        const bannerPicture = JSON.parse(res.bannerPicture)
        for (let i = 0; i < bannerPicture.length; i++) {
          this.initBannerPictureData.push({
            id: i,
            display: bannerPicture[i]
          })
        }
        const detailPicture = JSON.parse(res.detailPicture)
        for (let i = 0; i < detailPicture.length; i++) {
          this.initDetailPictureData.push({
            id: i,
            display: detailPicture[i]
          })
        }
      }
    },
    async getCategory() {
      const res = await category.getCategoryList(0, 1, 100)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        const len = res.list.length
        for (let i = 0; i < len; i++) {
          const item = res.list[i]
          this.categoryList.push({
            value: item.id,
            label: item.name
          })
        }
      }
    },
    // 查询子分类
    async getSubCategory(pid) {
      console.log('pid: ', pid)
      const res = await category.getCategoryList(pid, 1, 100)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.subCategoryList = []
        for (let i = 0; i < res.list.length; i++) {
          const item = res.list[i]
          this.subCategoryList.push({
            value: item.id,
            label: item.name
          })
        }
        this.subCategoryDisaled = false
      }
    },
    // 所有规格
    async getSpecList() {
      const res = await Spec.getSpecList(1, 100)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        for (let i = 0; i < res.list.length; i++) {
          this.specList.push({
            id: res.list[i].id,
            name: res.list[i].name
          })
        }
      }
    },
    // 商品-规格
    async getGoodsSpec(goodsId) {
      const res = await goods.getGoodsSpec(goodsId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        for (let i = 0; i < res.length; i++) {
          this.checkedSpecs.push(res[i].specId)
        }
      }
    },
    // 事件-切换一级分类
    async doSelectCategory(val) {
      const res = await category.getCategoryList(val, 1, 100)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.form.subCategoryId = null
        this.subCategoryList = []
        for (let i = 0; i < res.list.length; i++) {
          const item = res.list[i]
          this.subCategoryList.push({
            value: item.id,
            label: item.name
          })
        }
        this.subCategoryDisaled = false
      }
    },
    async getUploadFile(name) {
      return this.$refs[name].getValue()
    },
    // 重写插件中上传文件
    async uploadFile(file, call) {
      const data = await oss.uploadFileToOSS(file, 'assets/')
      call(data)
    },
    // 清理上传的图片
    clearUploadFile(name) {
      this.$refs[name].clear()
    },
    back() {
      this.$emit('editClose')
    },
    doSwitchOnlineEvent(val) {
      this.form.online = val ? 1 : 0
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
  .plus {
    -webkit-box-align: center;
    align-items: center;
  }
}
</style>
