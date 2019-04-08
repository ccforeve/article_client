<template>
  <div class="loading" v-if="!has_data">
    <div class="loading-icon">
      <fulfilling-bouncing-circle-spinner
              :animation-duration="4000"
              :size="60"
              color="#ff1d5e"
      />
    </div>
  </div>
  <div id="focus" class="flexv wrap redbag" v-else>
    <div class="flexitemv mainbox datum">

      <user-center-header :center="center"></user-center-header>

      <center-icons></center-icons>

      <center-posters :posters="posters"></center-posters>
    </div>

    <center-footer></center-footer>

    <!--提示关注公众号-->
    <!--<subscribe-alert @subscribe="subscribe" v-if="!is_subscribe"></subscribe-alert>-->
  </div>
</template>

<script>
  import UserCenterHeader from '@/components/user_center/Header.vue'
  import CenterIcons from '@/components/user_center/IconList.vue'
  import CenterPosters from '@/components/user_center/Posters.vue'
  import SubscribeAlert from '@/components/user_center/SubscribeAlert.vue'
  import CenterFooter from "@/components/common/Footer.vue"
  import {getUserInfo, getUserCenter, randPoster} from '../api.js'
  import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
  import wx from 'weixin-js-sdk'

  export default {
    name: "UserCenter",
    components: {
      UserCenterHeader,
      CenterIcons,
      CenterPosters,
      SubscribeAlert,
      CenterFooter,
      FulfillingBouncingCircleSpinner,
    },
    data() {
      return {
        has_data: false,
        center: {},
        posters: {}
      }
    },
    created() {
      let _this = this
      let posters = randPoster(4)
      posters.then(function (res) {
        _this.posters = res
        _this.has_data = true
      })
    },
    activated() {
      this.getDate()
      // this.wechatConfig()
    },
    computed: {
      is_subscribe() {
        return this.$store.state.user.is_subscribe ? true : false
      }
    },
    methods: {
      subscribe() {
        let user = getUserInfo()
        user.then(function (res) {
          let new_user = JSON.parse(localStorage.user)
          new_user.is_subscribe = res.is_subscribe
          localStorage.user = JSON.stringify(new_user)
        })
      },
      getDate() {
        let _this = this
        let center = getUserCenter()
        center.then(function (res) {
          _this.center = res
        })
      },
      wechatConfig () {     //微信jssdk
        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
          wx.onMenuShareTimeline({
            title: '个人中心测试', // 分享标题
            link: 'http://btl.yxcxin.com/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: "http://stl.yxcxin.com/image/qrcode.jpg", // 分享图标
            success: function () {
              // 用户点击了分享后执行的回调函数
            }
          })
          wx.onMenuShareAppMessage({
            title: '个人中心测试！', // 分享标题
            desc: '超多精彩文章，每日更新推送，快来看看吧！', // 分享描述
            link: 'http://btl.yxcxin.com/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://stl.yxcxin.com/image/qrcode.jpg' // 分享图标
          })
        })
      }
    }
  }
</script>

<style scoped>
  .datum {
    padding-bottom: 63px;
  }
</style>
