<template>
  <div id="text" class="flexv warp">
    <div class="report-text-area">
      <div class="text-input-wrap">
        <textarea v-model="extension_url" class="text-input" cols="30" rows="10" maxlength="150" placeholder="推荐文章时请填写推荐的文章链接"></textarea>
        <div class="text-num-tip">
          <span class="now-num">{{extension_url.length}}</span>/<span class="max-num">150</span>
        </div>
      </div>
      <button type="button" @click="submit">提交</button>
    </div>
    <div class="alert" v-if="alert">
      <div class="mask"></div>
      <div class="no-vip">
        <i class="close" @click="close"></i>
        <div class="bj"><img src="../../assets/image/recommend.png" class="fitimg"></div>
        <router-link to="/open_member" class="flex btn"><i class="flex center open_btn">成为VIP会员</i></router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {articleExtension} from "../../api"
  import { wechatConfig } from "../../cookie.js";
  import {Toast} from "mint-ui"
  export default {
    name: "article_extension",
    data() {
      return {
        alert: false,
        extension_url: ''
      }
    },
    computed: {
      is_member () {
        return this.$store.state.user.is_member
      }
    },
    activated () {
      wechatConfig()
    },
    methods: {
      submit () {
        let _this = this,
            url = this.extension_url
        if(!this.is_member) {
          this.alert = true
          return
        }
        if(!url) {
          Toast('链接不能为空')
          return;
        }
        if(url.indexOf('btl.yxcxin.com') >= 0) {
          Toast('请勿提交本站链接')
          return;
        }
        articleExtension({url: this.extension_url}).then(function (res) {
          Toast({message: res.message, duration: 1500})
          setTimeout(function () {
            _this.$router.go(-1)
          }, 1500)
        }).catch(function (e) {
          Toast(e.url[0])
        })
      },
      close () {
        this.alert = false
      }
    }
  }
</script>
