<template>
  <div class="container">
    <div class="quantity-statistics">
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">总访问量</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">11,590</div>
          </div>
        </div>
        <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">总用户数</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">51,862</div>
          </div>
        </div>
        <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">新增访问量 (月)</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">1,862</div>
          </div>
        </div>
        <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">新增用户数</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">1,323</div>
          </div>
        </div>
        <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>
      </div>
    </div>
    <div class="information">
      <div class="personal">
        <div class="personal-title">个人信息</div>
        <img src="../../assets/img/about/avatar.png" class="personal-avatar" />
        <div class="personal-influence">
          <div class="personal-influence-item">
            <div class="personal-influence-num color1">5411</div>
            <div class="personal-influece-label">总访问量</div>
          </div>
          <div class="personal-influence-item">
            <div class="personal-influence-num color2">913</div>
            <div class="personal-influece-label">粉丝</div>
          </div>
          <div class="personal-influence-item">
            <div class="personal-influence-num color3">72</div>
            <div class="personal-influece-label">作品</div>
          </div>
        </div>
        <el-tabs v-model="activeName" class="personal-tabs">
          <el-tab-pane label="最新作品" name="first">
            <div class="content">How to Contribute to Open Source?</div>
          </el-tab-pane>
          <el-tab-pane label="最热作品" name="second">
            <div class="content">为什么程序员们愿意在GitHub上开源...</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="article">
        <div class="article-title">文章</div>
        <div class="article-list">
          <div class="article-item" @click="handleArticle('https://opensource.guide/how-to-contribute/')">
            <img class="article-thumb" src="../../assets/img/about/open-source.jpg" alt="" />
            <div class="article-detail">
              <p class="article-detail-title">How to Contribute to Open Source?</p>
              <div class="article-detail-content">
                Whether you just made your first open source contribution, or you’re looking for new ways to contribute,
                we hope you’re inspired to take action. Even if your contribution wasn’t accepted, don’t forget to say
                thanks when a maintainer put effort into helping you. Open source is made by people like you: one issue,
                pull request, comment, or high-five at a time.
              </div>
              <div class="article-tool">
                <div class="pubdate">一天前</div>
                <div class="article-about">
                  <span><i class="iconfont icon-shoucang"></i>37</span>
                  <el-divider direction="vertical"></el-divider>
                  <span><i class="iconfont icon-pinglun"></i>2384</span>
                  <el-divider direction="vertical"></el-divider>
                  <span><i class="iconfont icon-fenxiang"></i>56</span>
                </div>
              </div>
            </div>
          </div>
          <div class="article-item" @click="handleArticle('https://www.zhihu.com/question/269033309')">
            <img class="article-thumb" src="../../assets/img/about/open-source.jpg" alt="" />
            <div class="article-detail article-last">
              <p class="article-detail-title">为什么程序员们愿意在GitHub上开源自己的成果给别人免费使用和学习？</p>
              <div class="article-detail-content">
                “Git的精髓在于让所有人的贡献无缝合并。而GitHub的天才之处，在于理解了Git的精髓。”来一句我们程序员们接地气的话：分享是一种快乐~
              </div>
              <div class="article-tool">
                <div class="pubdate">2019年5月26日</div>
                <div class="article-about">
                  <span><i class="iconfont icon-shoucang"></i>37</span>
                  <el-divider direction="vertical"></el-divider>
                  <span><i class="iconfont icon-pinglun"></i>2384</span>
                  <el-divider direction="vertical"></el-divider>
                  <span><i class="iconfont icon-fenxiang"></i>56</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      showTeam: false,
    }
  },
  mounted() {
    if (document.body.clientWidth > 1200 && document.body.clientWidth < 1330) {
      this.showTeam = true
    }
  },
  methods: {
    handleArticle(link) {
      window.open(link)
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  .quantity-statistics {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 90px;
    .quantity-item {
      display: flex;
      width: 23%;
      height: 100%;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .quantity-detail {
        flex: 1;
        .quantity-detail-box {
          margin: 12px 0 0 30px;
          .quantity-title {
            margin-bottom: 2px;
            height: 20px;
            line-height: 20px;
            color: #495468;
            font-size: 14px;
            font-weight: 400;
          }
          .quantity-border-line {
            width: 46px;
            height: 2px;
            background: rgba(73, 84, 104, 1);
          }
          .quantity {
            margin-top: 7px;
            height: 48px;
            font-size: 32px;
            color: rgba(73, 84, 104, 1);
            line-height: 38px;
            letter-spacing: 2px;
          }
        }
      }
      .quantity-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90px;
        height: 100%;
        background: rgba(69, 119, 255, 0.1);
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        img {
          width: 28px;
          height: 33px;
        }
      }
    }
  }
  .information {
    margin-top: 20px;
    display: flex;
    .personal {
      width: 320px;
      height: 100%;
      margin-right: 20px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .personal-title {
        margin: 20px 0 10px 20px;
        height: 22px;
        line-height: 22px;
        font-weight: 500;
        color: #596c8e;
        font-size: 16px;
      }
      .personal-avatar {
        width: 140px;
        height: 140px;
        margin: 0 auto 40px;
        border-radius: 75px;
        box-shadow: 0 0 30px 0 #cfd5e3;
      }
      .personal-influence {
        display: flex;
        justify-content: space-between;
        padding: 0 30px 40px;
        .personal-influence-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          .personal-influence-num {
            font-size: 28px;
            line-height: 34px;
            &.color1 {
              color: #00c292;
            }
            &.color2 {
              color: #fec108;
            }
            &.color3 {
              color: #03a9f3;
            }
          }
          .personal-influece-label {
            font-size: 12px;
            font-weight: 400;
            color: #8c98ae;
            line-height: 17px;
          }
        }
      }
      .personal-tabs {
        margin-bottom: 20px;
      }
      .personal-tabs /deep/ .is-top {
        width: 320px;
        display: flex;
        justify-content: space-around;
      }
      .personal-tabs /deep/ .el-tabs__content {
        text-indent: 20px;
      }
    }
    .article {
      flex: 1;
      height: 100%;
      padding: 20px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .article-title {
        height: 22px;
        line-height: 22px;
        font-weight: 500;
        color: #596c8e;
        font-size: 16px;
        margin-bottom: 20px;
      }
      .article-list {
        cursor: pointer;
        .article-item {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;

          .article-thumb {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            margin-right: 30px;
          }
          .article-detail {
            flex: 1;
            border-bottom: 1px #ecedef solid;
            margin-bottom: 20px;
            &.article-last {
              border-bottom: none;
              margin-bottom: 0;
            }
            .article-detail-title {
              height: 22px;
              font-size: 16px;
              font-weight: 400;
              color: rgba(69, 82, 107, 1);
              line-height: 22px;
            }
            .article-detail-content {
              margin-top: 10px;
              font-size: 14px;
              font-weight: 400;
              color: rgba(140, 152, 174, 1);
              line-height: 22px;
            }
          }
          .article-tool {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 10px 0 20px 0;
            font-size: 12px;
            line-height: 17px;
            font-weight: 400;
            color: #808da3;
            .article-about {
              .iconfont {
                line-height: 17px;
                margin-right: 6px;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .container .lin-info .lin-info-right {
    display: none;
  }
  .container .lin-info .lin-info-left {
    width: 100%;
  }
  .container .quantity-statistics .quantity-item {
    width: 32%;
    &:last-child {
      display: none;
    }
  }
  .container .information .personal {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .container .lin-info .lin-info-left {
    width: 100%;
  }
}
</style>
