<template>
  <div class="flexv func divMargin">
    <router-link to="/user/basic" class=" userLink">
      <i class="flex center bls bls-mp" style="background:#0ae612; "></i>
      <span class="flex center text">设置名片</span>
    </router-link>
    <router-link to="/punch" class=" userLink">
      <i class="flex center bls bls-time" style="background:#FF6633; "></i>
      <span class="flex center text">每日打卡</span>
    </router-link>
    <router-link to="/invitation" class=" userLink" style=" position: relative;">
      <i class="flex center bls bls-jhy" style="background:#67cef9; "></i>
      <span class="flex center text">邀请好友</span>
      <span class="spanR">30%佣金</span>
    </router-link>
    <router-link to="/profit" class=" userLink downMargin" style=" position: relative;">
      <i class="flex center iconfont logo icon-qian" style="background:#fdd602;"></i>
      <span class="flex center text">推广中心</span>
      <span class="spanR" v-if="is_profit">有佣金</span>
    </router-link>
    <router-link to="/message" class=" userLink">
      <i class="flex center bls bls-consult" style="background:#ffc0cb"></i>
      <span class="flex center text">留言管理</span>
    </router-link>
    <router-link to="/system" class=" userLink">
      <i class="flex center iconfont logo icon-huaban" style="background: gray;"></i>
      <span class="flex center text">系统设置</span>
    </router-link>
  </div>
</template>

<script>
  import { getProfit } from "../../api.js";
  export default {
    name: "IconList",
    data() {
      return {
        is_profit: false
      }
    },
    mounted() {
      let _this = this;
      let profit = getProfit();
      profit.then(function(res) {
        _this.$store.commit("updateSurplusProfit", res.surplus_profit);
        if(res.surplus_profit > 0) {
          _this.is_profit = true
        }
      })
    }
  }
</script>
<style>
.divMargin {
  margin-top: 0.5rem;
  padding: 1.5rem 0 1rem;
}
.userLink {
  width: 33.33%;
  display: inline-block;
}
.downMargin{
  margin:2rem 0 2.5rem;
}
.spanR{
    font-size: 0.8rem;
    position: absolute;
    width: 4rem;
    color: white;
    border-radius: 0.3rem;
    background: #FF0000;
    text-align: center;
    top: -0.6rem;
    right: 1.2rem;
}
span.flex.center.text{
  margin-top: 0.5rem;
}
</style>

