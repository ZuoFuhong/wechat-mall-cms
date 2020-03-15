<template>
  <div>
    <div class="container">
      <div class="title plus">
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
              <el-form-item label="价格" prop="price">
                <el-input-number
                  v-model="form.price"
                  @change="handlePriceChange"
                  :precision="2"
                  :step="0.1"
                  :max="10"
                  label="价格"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="编码" prop="code">
                <el-input size="medium" v-model="form.code" placeholder="请填写编码"></el-input>
              </el-form-item>
              <el-form-item label="库存" prop="stock">
                <el-input-number
                  v-model="form.stock"
                  @change="handlePriceChange"
                  :max="10000"
                  label="库存"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="SPU" prop="spuId">
                <el-select v-model="form.spuId" placeholder="请选择">
                  <el-option v-for="item in spuList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
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
              <el-form-item label="图片" prop="picture">
                <upload-imgs ref="pictureEle" :rules="rules" :multiple="true" :max-num="1" :animated-check="true" />
              </el-form-item>
              <!-- todo: 此处展开 规格 -->
              <el-form-item label="选择颜色" prop="color">
                <el-select v-model="form.spuId" placeholder="请选择">
                  <el-option v-for="item in spuList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
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
  props: {
    skuId: {
      type: Number,
    },
  },
  data() {
    return {
      form: {
        title: '',
        price: '',
        code: '',
        stock: '',
        spuId: '',
        online: '',
        picture: '',
      },
      spuList: [],
      rules: {
        // minWidth: 100,
        // minHeight: 100,
        maxSize: 2,
        allowAnimated: 1,
      },
    }
  },
  created() {
    console.log('skuId: ', this.skuId)
    this.spuList = [
      {
        id: 1,
        name: '衣服',
      },
      {
        id: 2,
        name: '帽子',
      },
    ]
  },
  methods: {
    back() {
      this.$emit('editClose')
    },
    handlePriceChange(val) {
      console.log(val)
    },
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
