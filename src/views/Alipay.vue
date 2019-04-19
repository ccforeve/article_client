<template>
  <div id="zfb-hint" class="wrap">
    <div class="flex endh bls bls-up"></div>
    <div class="flex center text">请点击右上角"<i>&bull; &bull; &bull;</i>"选择在浏览器中打开完成支付</div>
    <div class="hint-img">
      <img src="../assets/image/alipay_help.png" class="fitimg">
    </div>
    <div class="flex center back">
      <router-link tag="button" to="/index">回到首页</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Alipay",
    mounted() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {

      }
      else {
        window.location.href = "http://stl.yxcxin.com/api/alipay/pay/" + this.$route.params.order_id
      }
    }
  }
</script>

<style>
  #zfb-hint button{
    width: 7rem;
    height: 3rem;
    border: 1px #000000 solid;
    background: #fff;
    border-radius: .7rem;
  }
</style>
