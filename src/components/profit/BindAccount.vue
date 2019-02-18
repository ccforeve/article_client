<template>
  <div id="account" class="flexv wrap">
    <div class="flexitemv mainbox">
      <form action="" id="form">
        <div class="tips">请绑定本人的支付宝</div>
        <div class="block stepone">
          <label class="flex centerv row">
            <span class="flex title">支付宝姓名</span>
            <input type="text" ref="ali_name" placeholder="请填写您的真实姓名" class="flexitem input normal" :value="user.ali_name">
          </label>
          <label class="flex centerv row">
            <span class="flex title">支付宝账号</span>
            <input type="text" ref="ali_account" placeholder="请填写您的支付宝账户" class="flexitem input normal" :value="user.ali_account">
          </label>
        </div>
        <a href="javascript:;" class="flex center submit" @click="addAliAccount" v-if="!user.ali_account">绑定</a>
        <a href="javascript:;" class="flex center submit" @click="addAliAccount" v-else>修改</a>
      </form>
    </div>
  </div>
</template>

<script>
  import { UpdateUserInfo } from '../../api.js'
  import { Indicator } from 'mint-ui'

  export default {
    name: "BindAccount",
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    methods: {
      addAliAccount () {
        Indicator.open('正在修改...')
        let arr = {}
        let form = this.$refs
        for (let i in form) {
          arr[i] = form[i].value
        }
        let _this = this
        let update = UpdateUserInfo(arr)
        update.then(function (res) {
          Indicator.close()
          let new_user = JSON.parse(localStorage.user)
          new_user.ali_name = arr.ali_name
          new_user.ali_account = arr.ali_account
          localStorage.user = JSON.stringify(new_user)
          _this.$store.commit('setTokenAndUser', JSON.parse(localStorage.user))
          _this.$router.push('/profit/withdraw_cash')
        })
      }
    }
  }
</script>
