<template>
  <div>
    <div class="container">
      <div class="title">
        <span>{{ title }}</span>
        <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      </div>
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
              <el-form-item label="标题" prop="title">
                <el-input size="medium" v-model="form.title" placeholder="请填写标题"></el-input>
              </el-form-item>
              <el-form-item label="副标题" prop="subTitle">
                <el-input size="medium" v-model="form.subTitle" placeholder="请填写副标题"></el-input>
              </el-form-item>
              <el-form-item label="价格" prop="price">
                <el-input size="medium" v-model="form.price" placeholder="请填写价格"></el-input>
              </el-form-item>
              <el-form-item label="折扣" prop="discountPrice">
                <el-input size="medium" v-model="form.discountPrice" placeholder="请填写折扣"></el-input>
              </el-form-item>
              <el-form-item label="分类" prop="categoryId">
                <el-select v-model="form.categoryId" placeholder="请选择">
                  <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="默认sku" prop="defaultSkuId">
                <el-select v-model="form.defaultSkuId" placeholder="请选择">
                  <el-option v-for="item in skuList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否上架" prop="online">
                <el-switch
                  style="display: inline-flex; align-items: center; line-height: 20px; vertical-align: middle; height: 20px;"
                  v-model="form.online"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="上架"
                  inactive-text="下架"
                >
                </el-switch>
              </el-form-item>
              <el-form-item label="主图" prop="picture">
                <upload-imgs ref="pictureEle" :rules="rules" :multiple="true" :max-num="1" :animated-check="true" />
              </el-form-item>
              <el-form-item label="主题图" prop="forThemePicture">
                <upload-imgs
                  ref="themePictureEle"
                  :rules="rules"
                  :multiple="true"
                  :max-num="1"
                  :animated-check="true"
                />
              </el-form-item>
              <el-form-item label="轮播图" prop="bannerPicture">
                <upload-imgs
                  ref="bannerPictureEle"
                  :rules="rules"
                  :multiple="true"
                  :max-num="1"
                  :animated-check="true"
                />
              </el-form-item>
              <el-form-item label="详情图" prop="detailPicture">
                <upload-imgs
                  ref="detailPictureEle"
                  :rules="rules"
                  :multiple="true"
                  :max-num="1"
                  :animated-check="true"
                />
              </el-form-item>
              <el-form-item label="标签" prop="tags">
                <el-tag
                  :key="tag"
                  v-for="tag in goodsTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">添加标签</el-button>
              </el-form-item>
              <el-form-item label="选择规格" prop="specId">
                <el-checkbox-group v-model="form.checkedSpecs" @change="handleCheckedSpecChange">
                  <el-checkbox v-for="spec in specs" :label="spec.name" :key="spec.id">{{ spec.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="可视规格" prop="sketchSpecId">
                <el-select v-model="form.defaultSkuId" placeholder="请选择">
                  <el-option v-for="item in specs" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input size="medium" v-model="form.description" placeholder="请填写描述"></el-input>
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

export default {
  components: {
    UploadImgs,
  },
  data() {
    return {
      loading: true,
      form: {
        title: '',
        subTitle: '',
        price: '',
        discountPrice: '',
        categoryId: 0,
        defaultSkuId: 0,
        online: '',
        picture: '',
        forThemePicture: '',
        bannerPicture: '',
        detailPicture: '',
        tags: '',
        description: '',
        checkedSpecs: ['尺寸', '颜色'],
      },
      rules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
      goodsTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      specs: [
        {
          id: 1,
          name: '尺寸',
        },
        {
          id: 2,
          name: '颜色',
        },
        {
          id: 3,
          name: '品牌',
        },
      ],
      categoryList: [
        {
          value: 1,
          label: '服装',
        },
        {
          value: 2,
          label: '衣帽',
        },
      ],
      skuList: [
        {
          value: 1,
          label: '青峰·5寸',
        },
        {
          value: 2,
          label: '白羽·3.5寸',
        },
      ],
    }
  },
  props: {
    goodsId: {
      type: Number,
    },
  },
  created() {
    this.loading = false
    console.log('goodsId: ', this.goodsId)
  },
  computed: {
    title() {
      return this.goodsId === 0 ? '添加商品' : '更新商品'
    },
  },
  methods: {
    back() {
      this.$emit('editClose')
    },
    handleClose(tag) {
      this.goodsTags.splice(this.goodsTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const tmpValue = this.inputValue
      if (tmpValue) {
        this.goodsTags.push(tmpValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleCheckedSpecChange(value) {
      const checkedCount = value.length
      console.log(checkedCount)
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
