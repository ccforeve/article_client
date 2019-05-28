<template>
  <div id="home" class="flexv wrap">
    <article-list />
    <index-footer />
    <!--推荐好文章-->
    <router-link to="/article/extension" class="flex center renew">提交好文章</router-link>
    <router-link
            to="/turntable"
            class="flex center turntable"
            v-if="user.id === 50 || user.id === 42 || user.id === 38 || user.id === 17 || user.id === 20"
    >奖</router-link><!---v-if="is_activity"--->

  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from "@/components/index/ArticleList.vue";
import IndexFooter from "@/components/common/Footer.vue";
import PerfectInformation from "@/components/common/PerfectInformation.vue";
import {judgeActivity} from "../api";
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
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
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
    if(to.path === '/' && this.is_miniprogram) {
      wx.miniProgram.navigateBack()
    }
    next();
  },
  methods: {
    async judgeActivity() {
      let activity = await judgeActivity()
      this.is_activity = activity.data
    },
    wechatConfig() {
      //微信jssdk
      wx.ready(function() {
        //需在用户可能点击分享按钮前就先调用
        wx.onMenuShareTimeline({
          title: "欢迎进入绿叶事业", // 分享标题
          link: "http://btl.yxcxin.com/index", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://stl.yxcxin.com/image/qrcode.jpg", // 分享图标
          success: function() {
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
.turntable{
    position: fixed;
    bottom: 28%;
    right: 0;
    width: 5rem;
    height: 4rem;
    padding-left: 0.5rem;
    border-top-left-radius: 5rem;
    border-bottom-left-radius: 5rem;
    background: gold;
    font-size: 2.5rem;
    color: #fff;
}
</style>
