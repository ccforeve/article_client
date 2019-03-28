<template>
  <div id="home" class="flexv wrap">
    <article-list />
    <index-footer />
    <perfect-information type="article_detail" :user="user" v-if="!user.phone"></perfect-information>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from "@/components/index/ArticleList.vue"
import IndexFooter from "@/components/common/Footer.vue"
import PerfectInformation from '@/components/common/PerfectInformation.vue'
import wx from 'weixin-js-sdk'

export default {
  name: 'home',
  components: {
    ArticleList,
    IndexFooter,
    PerfectInformation
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.wechatConfig()
  },
  methods: {
    wechatConfig () {     //微信jssdk
      wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        wx.onMenuShareTimeline({
          title: '欢迎进入绿叶事业', // 分享标题
          link: 'http://btl.yxcxin.com/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'https://img.zx85.net/edit/image/png/5c0e1f40941b7.png', // 分享图标
          success: function () {
            // 用户点击了分享后执行的回调函数
          }
        })
        wx.onMenuShareAppMessage({
          title: '欢迎进入绿叶事业！', // 分享标题
          desc: '超多精彩文章，每日更新推送，快来看看吧！', // 分享描述
          link: 'http://btl.yxcxin.com/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'https://img.zx85.net/edit/image/png/5c0e1f40941b7.png' // 分享图标
        })
      })
    }
  }
}
</script>

<style>
  .mescroll-totop {
    bottom: 75px !important;
  }
</style>
