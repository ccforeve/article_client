<template>
  <div class="flex tabbars">
    <router-link
      to="/index"
      class="flexv center item"
    >
      <i
        class="flex center iconfont logo icon-index iIndex"
      ></i>
      <em class="flex center">首页</em>
    </router-link>
    <router-link
      to="/visitor"
      class="flexv center item"
    >
      <i
        class="flex center iconfont logo icon-fangkejilu iFk"
        :class="{'fk': new_visitor}"
      ></i>
      <em class="flex center">访客记录</em>
    </router-link>
    <router-link
      to="/open_member"
      class="flexv center item"
      v-if="!is_member"
    >
      <i class="flex center iconfont logo icon-pay"></i>
      <em class="flex center">支付开通</em>
    </router-link>
    <router-link
      to="/profit"
      class="flexv center item"
      v-else
    >
      <i class="flex center bls bls-generalize"></i>
      <em class="flex center">推广中心</em>
    </router-link>
    <router-link
      to="/user"
      id="data"
      class="flexv center item"
    >
      <i class="flex center iconfont logo icon-UserCenter iUser"></i>
      <em class="flex center">个人中心</em>
    </router-link>
  </div>
</template>

<script>
import { ifNewVisitor } from "../../api.js";

export default {
  name: "Footer",
  computed: {
    new_visitor() {
      return this.$store.state.check_visitor;
    },
    is_member() {
      return this.$store.state.user.is_member;
    }
  },
  activated() {
    let _this = this;
    if (!_this.$store.state.check_visitor) {
      let check = ifNewVisitor();
      check.then(function(res) {
        if (res.data) {
          _this.$store.commit("checkVisitor");
        }
      });
    }
  }
};
</script>

