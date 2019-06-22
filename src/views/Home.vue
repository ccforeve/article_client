<template>
  <div id="home" class="flexv wrap">
    <article-list />
    <index-footer />
    <!--推荐好文章-->
    <router-link to="/article/extension" class="flex center renew">提交好文章</router-link>
    <router-link to="/turntable" class="flex center turntable" v-if="is_activity"></router-link>
    <!-- 测试代码 测试用户Id -->
    <!-- v-if="user.id === 50 || user.id === 42 || user.id === 38 || user.id === 17 || user.id === 20" -->
    <!-- 抽奖弹窗 -->
    <!-- <div class="zj-main" id="zj-main" v-if="draw">
      <div class="toCloseMess" @click="closeDrawTip">X</div>
      <div class="txzl">
        <img style="width:100%;margin-bottom: 3vw;" src="../assets/image/homeAlert.png">
        <div class="close_zj" @click="closeDraw">点击查看</div>
      </div>
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from "@/components/index/ArticleList.vue";
import IndexFooter from "@/components/common/Footer.vue";
import PerfectInformation from "@/components/common/PerfectInformation.vue";
import { judgeActivity } from "../api";
import wx from "weixin-js-sdk";
export default {
  name: "home",
  components: {
    ArticleList,
    IndexFooter,
    PerfectInformation
  },
  data() {
    return {
      is_miniprogram: false,
      is_activity: false,
      draw: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    if(!localStorage.homeAlert){
      this.draw = true
    }
  },
  activated() {
    let _this = this
    _this.wechatConfig()
    _this.judgeActivity()
    wx.miniProgram.getEnv(function (res) {
      _this.is_miniprogram = res.miniprogram
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/' && this.is_miniprogram) {
      wx.miniProgram.navigateBack()
    }
    next();
  },
  methods: {
    closeDraw() {
      this.draw = false
      localStorage.homeAlert = true
      this.$router.push({ path:'/turntable'})
    },
    closeDrawTip() {
      this.draw = false
    },
    async judgeActivity() {
      let activity = await judgeActivity()
      this.is_activity = activity.data
    },
    wechatConfig() {
      //微信jssdk
      wx.ready(function () {
        //需在用户可能点击分享按钮前就先调用
        wx.onMenuShareTimeline({
          title: "欢迎进入绿叶事业", // 分享标题
          link: "http://btl.yxcxin.com/index", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://stl.yxcxin.com/image/qrcode.jpg", // 分享图标
          success: function () {
            // 用户点击了分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
          title: "欢迎进入绿叶事业！", // 分享标题
          desc: "超多精彩文章，每日更新推送，快来看看吧！", // 分享描述
          link: "http://btl.yxcxin.com/index", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://stl.yxcxin.com/image/qrcode.jpg" // 分享图标
        });
      });
    }
  }
};
</script>

<style scoped>
.mescroll-totop {
  bottom: 75px !important;
}
.turntable {
  position: fixed;
  bottom: 28%;
  right: 0;
  width: 6rem;
  height: 6rem;
  padding-left: 0.5rem;
  background-image: url(../assets/image/draw.gif);
  background-size: auto 100%;
  background-repeat: no-repeat;
  font-size: 2.5rem;
}
/* // 抽奖样式 */
.zj-main {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.7);
  background-size: 100% 100%;
  position: absolute;
  overflow: hidden;
  *zoom: 1;
  z-index: 10;
  left: center;
  top: 0;
}
.zj-main .txzl {
  width: 70%;
  height: auto;
  position: absolute;
  top: 28%;
  left: 15%;
  background: white;
  border-radius: 20px;
  color: #7a312d;
  overflow: hidden;
  text-align: center;
  font-size: 4vw;
  background-position: -2rem 0 0 0;
  line-height: 6vw;
}
.zj-main .txzl .zj_text {
  margin: 0vw auto;
  margin-bottom: 3vw;
}
.zj-main .close_zj {
  width: 25vw;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 5vw;
  line-height: 9vw;
  color: #e1ce85 !important;
  background: #ba2d1c;
  border-radius: 5px;
  font-size: 4vw;
}
@media (min-width: 320px) and (max-width: 359px) {
  html {
    font-size: 31% !important;
  }
}

@media (min-width: 360px) and (max-width: 399px) {
  html {
    font-size: 36% !important;
  }
}

@media (min-width: 400px) and (max-width: 479px) {
  html {
    font-size: 40% !important;
  }
}

@media (min-width: 480px) and (max-width: 639px) {
  html {
    font-size: 49% !important;
  }
}
.txzl-close {
  height: 25% !important;
}
.txzl-close .zj_text {
  margin-top: 10vw !important;
  font-size: 2rem;
}
.toOpen {
  margin-bottom: 2vw;
  margin-top: 2vw;
  display: inline-block;
  width: 36vw !important;
}
.txzl-close .close_zj {
  margin-top: 4vw;
  display: inline-block;
  margin-left: 0.5rem;
}
.toCloseMess {
  position: absolute;
  display: inline-block;
  top: 20%;
  right: 15%;
  color: #fff;
  z-index: 10;
  font-size: 6vw;
  text-align: center;
  width: 8vw;
  height: 8vw;
  line-height: 8vw;
  background: #007392;
  border-radius: 4vw;
}
.toCloseMess::after {
  content: "";
  position: absolute;
  display: inline-block;
  width: 3px;
  height: 10vw;
  top: 85%;
  right: 43%;
  background: #007392;
  z-index: 9;
}
</style>
