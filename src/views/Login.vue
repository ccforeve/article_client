<template>
  <div id="login">

  </div>
</template>

<script>
  // @ is an alias to /src
  import {userLogin} from "../api.js";
  import {mapMutations} from "vuex";
  import {setCookie, getCookie} from "../cookie";

  export default {
    name: "login",
    activated() {
      if (!getCookie("token") || !localStorage.user) {
        if (this.$route.query.code) {
          this.login();
        } else {
          let redirect = this.$route.query.redirect ? this.$route.query.redirect : ""
          let url = "https://btl.yxcxin.com?redirect=" + redirect;
          window.location.href =
              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe910075ca3b12399&redirect_uri=" +
              url +
              "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }
      } else {
        this.$router.push("/index");
      }
    },
    methods: {
      login() {
        let login = userLogin({code: this.$route.query.code});
        let vm = this;
        login.then(function (res) {
          localStorage.user = JSON.stringify(res)
          //使用cookie存贮token
          setCookie("token", res.meta.access_token);
          vm.setTokenAndUser(res);
          if (vm.$route.query.redirect) {
            vm.$router.push(vm.$route.query.redirect);
            return;
          }
          vm.$router.push("/index");
        })
            .catch(function (e) {
              console.log(e);
            });
      },
      ...mapMutations(["setTokenAndUser"])
    }
  };
</script>
