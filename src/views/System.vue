<template>
  <div>
    <div class="messBox">
      <span class="spanTitle">是否接收消息推送</span>
      <mt-switch
        v-model="value"
        @change="turn"
        class="swtichBtn"
      ></mt-switch>
    </div>
    <div class="messTip">开启后将接收公众号消息</div>
  </div>
</template>
<script>
import { Switch } from "mint-ui";
import { UpdateUserInfo } from "../api.js"
export default {
  data() {
    return {
      value: this.$store.state.user.message_send
    };
  },
  methods: {
    turn() {
      let _this = this,
          state = this.value ? 1 : 0
      UpdateUserInfo({message_send: state}).then(function (res) {
        let new_user = JSON.parse(localStorage.user)
          new_user.message_send = state
          localStorage.user = JSON.stringify(new_user)
          _this.$store.commit("setTokenAndUser", JSON.parse(localStorage.user))
      })
    }
  }
};
</script>
<style scoped>
.messBox{
  height: 4rem;
    background: #fff;
    margin-top: 1.5rem;
    padding: 1rem 1rem;
    vertical-align: middle;
}
.spanTitle{
  float:left;
  font-size: 1.5rem;
}
.swtichBtn{
  float: right;
  margin-top: -0.2rem;
}
.messTip{
  padding: 0.2rem 1rem
}
</style>


