<template>
  <div class="loading" v-if="!has_data">
    <div class="loading-icon">
      <fulfilling-bouncing-circle-spinner :animation-duration="4000" :size="60" color="#ff1d5e"/>
    </div>
  </div>
  <div id="contact" class="flexv wrap" v-else>
    <div class="flexv mainbox">
      <div class="flexv center sub">
        <div class="userimg">
          <img :src="data.user.avatar" class="fitimg">
        </div>
        <h2 class="flex center name">{{data.user.nickname}}</h2>
        <p class="several">共阅读你的头条<em class="color">{{data.read_count}}</em>次，分享<span class="color">{{data.share_count ? data.share_count : 0}}</span>次
        </p>
        <p class="time">最近访问<em class="color">{{data.last_visit}}</em>。</p>
      </div>
    </div>
    <div class="flexitemv center">
      <div class="flexv center text">
        <i class="flex center bls bls-bottom"></i>
        <p>根据事业分享人脉分析，</p>
        <p>此用户可能是你的{{data.relationship}}。</p>
      </div>
      <div class="flex center relation">
        <div class="img">
          <img :src="my_avatar" class="fitimg">
        </div>
        <i class="flex center bls bls-xianlu"></i>
        <div class="img">
          <img :src="data.user.avatar" class="fitimg">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {footprintFind} from '../../api.js'
  import {FulfillingBouncingCircleSpinner} from 'epic-spinners'

  export default {
    name: "Connection",
    components: {
      FulfillingBouncingCircleSpinner
    },
    data() {
      return {
        has_data: false,
        data: {user: {}}
      }
    },
    computed: {
      my_avatar() {
        return this.$store.state.user.avatar
      }
    },
    activated() {
      let _this = this
      _this.has_data = false,
      footprintFind(this.$route.params.user_id)
        .then(function (data) {
          _this.has_data = true
          _this.data = data
        })
    }
  }
</script>
