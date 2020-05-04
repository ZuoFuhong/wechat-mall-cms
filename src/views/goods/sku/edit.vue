<template>
  <div>
    <div class="container">
      <div class="title plus">
        <span>{{ title }}</span>
        <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      </div>
      <div class="wrap">
        <el-row>
          <el-col :lg="10" :md="20" :sm="24" :xs="24">
            <el-form :rules="rules" :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
              <el-form-item label="商品" prop="goodsId">
                  <el-cascader
                  clearable
                  :props="cascaderProps"
                  :show-all-levels="false"
                  v-model="goodsOption"
                  :options="goodsOptions"
                  @change="handleGoodsChange"></el-cascader>
              </el-form-item>
              <el-form-item label="标题" prop="title">
                <el-input size="medium" v-model="form.title" maxlength="15" show-word-limit placeholder="请填写标题"></el-input>
              </el-form-item>
              <el-form-item label="价格" prop="price">
                <el-input-number
                  v-model="form.price"
                  @change="handlePriceChange"
                  :precision="2"
                  :step="1"
                  :min="0.01"
                  :max="100000"
                  label="价格"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="库存" prop="stock">
                <el-input-number
                  v-model="form.stock"
                  @change="handlePriceChange"
                  :min="0"
                  :step="1"
                  :max="10000"
                  label="库存"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="图片" prop="picture">
                <upload-imgs
                :value="initPictureData"
                :remoteFuc="uploadFile"
                ref="pictureEle" :rules="fileRules" :multiple="false" :max-num="1" :animated-check="true" />
              </el-form-item>
              <template v-for="spec in specList">
                <el-form-item :label="spec.name" :key="spec.specId">
                  <el-select v-model="chooseSpecAttr[spec.specId]" placeholder="请选择">
                    <el-option v-for="item in spec.attrList" :key="item.id" :label="item.value" :value="item.id"> </el-option>
                  </el-select>
                </el-form-item>
              </template>
              <el-form-item label="是否上架" prop="online">
                <el-switch
                  style="display: inline-flex; align-items: center; line-height: 20px; vertical-align: middle; height: 20px;"
                  v-model="onlineStatus"
                  @change="doSwitchOnline"
                  active-text="上架"
                  inactive-text="下架"
                >
                </el-switch>
              </el-form-item>
              <el-form-item class="submit">
                <el-button v-auth="['管理库存']" type="primary" @click="submitForm('form')">保 存</el-button>
                <el-button v-auth="['管理库存']" @click="resetForm('form')">重 置</el-button>
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
import oss from '@/models/oss'
import goods from '@/models/goods'
import sku from '@/models/sku'

export default {
  components: {
    UploadImgs,
  },
  props: {
    skuId: {
      type: Number,
      default: 0
    },
  },
  data() {
    const goodsFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('商品为必选！'))
      }
      callback()
    }
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
    const stockFunc = (rule, value, callback) => {
      // eslint-disable-line
      if (value === undefined) {
        return callback(new Error('库存不能为空'))
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
        title: '',
        price: 0,
        code: '',
        stock: '',
        goodsId: 0,
        online: 0,
        picture: ''
      },
      onlineStatus: false,
      goodsList: [],
      fileRules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
      rules: {
        title: [{ validator: titleFunc, trigger: 'blur', required: true }],
        goodsId: [{ validator: goodsFunc, trigger: 'blur', required: true }],
        price: [{ validator: priceFunc, trigger: 'blur', required: true }],
        stock: [{ validator: stockFunc, trigger: 'blur', required: true }],
        picture: [{ validator: pictureFunc, trigger: 'blur', required: true }],
      },
      cascaderProps: {
        expandTrigger: 'hover',
      },
      // 选择的商品
      goodsOption: [],
      goodsOptions: [],
      specList: [],
      initPictureData: [],
      // 选择的规格: k => specId, val => attrId
      chooseSpecAttr: {}
    }
  },
  async created() {
    console.log('skuId: ', this.skuId)
    await this.loadChooseGoodsList()
    if (this.skuId !== 0) {
      await this.getSku(this.skuId)
    }
  },
  methods: {
    async getSku(skuId) {
      const res = await sku.getSku(skuId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.goodsOption = [res.categoryId, res.subCategoryId, res.goodsId]
        this.form = res
        this.onlineStatus = res.online === 1
        this.initPictureData = [
          {
            id: res.id,
            display: res.picture
          }
        ]
        await this.getGoodsSpecList(res.goodsId)
        const specs = JSON.parse(res.specs)
        for (let i = 0; i < specs.length; i++) {
          // 错误写法
          // this.chooseSpecAttr[specs[i].keyId] = specs[i].valueId
          // vue变化检测
          this.$set(this.chooseSpecAttr, specs[i].keyId, specs[i].valueId)
        }
      }
    },
    // 加载可选择的商品
    async loadChooseGoodsList() {
      this.goodsOptions = await goods.getGoodsAll()
    },
    // 选择商品
    handleGoodsChange(val) {
      console.log(val)
      if (val.length === 3) {
        const goodsId = val['2']
        this.form.goodsId = goodsId
        this.getGoodsSpecList(goodsId)
      } else {
        this.form.goodsId = 0
        this.specList = []
      }
    },
    // 商品-规格
    async getGoodsSpecList(goodsId) {
      const res = await goods.getGoodsSpec(goodsId)
      if (res.error_code !== undefined) {
        this.$message.error(`${res.msg}`)
      } else {
        this.specList = res
      }
    },
    back() {
      this.$emit('editClose')
    },
    handlePriceChange(val) {
      console.log(val)
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
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const specs = this.extraceGoodsSkuSpec()
            if (!specs) {
              return
            }
            const postData = {
              id: this.skuId,
              title: this.form.title,
              price: (this.form.price).toString(),
              code: this.form.code,
              stock: this.form.stock,
              goodsId: this.form.goodsId,
              online: this.form.online,
              picture: this.form.picture,
              specs
            }
            const res = await sku.editSku(postData)
            if (res.error_code !== undefined) {
              this.$message.error(`${res.msg}`)
            } else {
              this.$message.success('操作成功！')
              this.back()
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          return false
        }
      })
    },
    // 提取Sku-specs
    extraceGoodsSkuSpec() {
      const specs = []
      for (let i = 0; i < this.specList.length; i++) {
        const specItem = this.specList[i]
        if (this.chooseSpecAttr[specItem.specId] === undefined) {
          this.$message.error(`请选择${specItem.name}`)
          return null
        }
        let tmpAttrItem = {}
        for (let j = 0; j < specItem.attrList.length; j++) {
          const attrItem = specItem.attrList[j]
          if (attrItem.id === this.chooseSpecAttr[specItem.specId]) {
            tmpAttrItem = {
              valueId: attrItem.id,
              value: attrItem.value
            }
          }
        }
        const spec = {
          keyId: specItem.specId,
          key: specItem.name,
          valueId: tmpAttrItem.valueId,
          value: tmpAttrItem.value
        }
        specs.push(spec)
      }
      return JSON.stringify(specs)
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    doSwitchOnline(val) {
      this.form.online = val ? 1 : 0
    }
  },
  computed: {
    title() {
      return this.skuId === 0 ? '新增SKU' : '更新SKU'
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
