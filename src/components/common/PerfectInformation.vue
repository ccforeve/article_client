<template>
  <div class="flex center perfect-information">
    <div class="mask"></div>
    <div class='content'>
      <template v-if="type === 'article_detail'">
        <h3 class="flex center title">您的信息不完整</h3>
        <p
          class="flex center tis"
          style="font-size: 1.2rem"
        >立刻完善资料，让客户找到您</p>
      </template>
      <template v-else-if="type === 'poster'">
        <i
          class="flex center bls bls-cuo cuo"
          @click="cancelAlert"
        ></i>
        <h3 class="flex center title">修改个人信息</h3>
      </template>
      <div class="flex center input">
        <span class="flex centerv">姓名</span>
        <input
          type="text"
          class="flexitem"
          :value="user.nickname"
          ref="nickname"
        >
      </div>
      <div class="flex center input">
        <span class="flex centerv">手机号</span>
        <input
          type="text"
          class="flexitem"
          :value="user.phone"
          oninput="if(value.length>11)value=value.slice(0,11)"
          ref="phone"
        >
      </div>
      <div
        class="flex center input"
        v-if="type === 'article_detail'"
      >
        <span class="flex centerv">微信</span>
        <input
          type="text"
          class="flexitem"
          value=""
          ref="wechat"
        >
      </div>
      <a
        href="javascript:;"
        class="flex center button"
        @click="perfect"
      >保存修改</a>
    </div>
  </div>
</template>

<script>
import { perfectInformation } from "../../api.js";
import { Indicator } from "mint-ui";

export default {
  name: "perfect_information",
  props: ["user", "type"],
  methods: {
    perfect() {
      Indicator.open();
      let arr = {};
      let refs = this.$refs;
      let _this = this;
      for (var i in refs) {
        arr[i] = refs[i].value;
      }
      let res = perfectInformation(arr);
      res
        .then(function(ret) {
          let new_user = JSON.parse(localStorage.user);
          new_user.nickname = arr.nickname;
          new_user.phone = arr.phone;
          if (_this.type !== "poster") {
            new_user.wechat = arr.wechat;
          }
          localStorage.user = JSON.stringify(new_user);
          _this.$store.commit("setTokenAndUser", JSON.parse(localStorage.user));
          _this.$emit("change");
          Indicator.close();
        })
        .catch(err => {
          alert(err.message);
          Indicator.close();
        });
    },
    cancelAlert() {
      this.$emit("cancelAlert");
    }
  }
};
</script>
