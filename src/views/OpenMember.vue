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
  <div id="open_test" class="flexv wrap" v-else>
    <div class="flexv member">
      <div class="title">会员类型</div>
      <div class="fwrap genrebox">
        <div class="flexv center list"
             v-for="(item, index) of payments"
             :key="index"
             :class="{'commend': item.extension, 'current_border': item.id == list_active}"
             @click="changeActive(item.id)"
        >
          <div class="flex center time"><span>{{item.month / 12}}</span>年会员权限</div>
          <div class="price">{{item.price}}/{{item.month / 12}}年</div>
          <div class="original">原价{{item.original_price}}/{{item.month / 12}}年</div>
          <!--<div class="deduction">已抵扣<span>200元</span>现金红包</div>-->
          <!--<div class="current">1</div>-->
        </div>
      </div>
    </div>
    <div class="payment">
      <div class="title">支付方式</div>
      <div class="around paybox">
        <div class="flex center list current_border">
          <i class="flex center bls bls-wx-pay" style="color:#45b638"></i>微信安全支付
          <div class="current"></div>
        </div>

        <!--<div class="flex center list">-->
        <!--<i class="flex center bls bls-zfb-pay" style="color:#1296db"></i>支付宝安全支付-->
        <!--</div>-->
      </div>
    </div>
    <div class="flexitem end footer">
      <div class="between moneybox">
        <div class="money">应付金额：<span>¥ {{extension_payment.price}}</span></div>
        <a href="javascript:;" class="flex center pay_btn" @click="handlerPay">立即支付</a>
      </div>
    </div>
    <div class="alert buy-hint" v-if="pay_success">
      <div class="mask" @click="cancel_alert"></div>
      <div class='content trans'>
        <h3 class="flex center">购买成功</h3>
        <div class="img">
          <img src="../assets/image/dredge_bj.png" class="fitimg">
        </div>
        <div class="flex center indate">
          <div>有效期至：{{member_time}}</div>
          <span></span>
        </div>
        <div class="button">
          <router-link to="/footprint" class="flex center">去看看谁查看了我的头条</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {paymenets, pay} from '../api.js'
  import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
  import wx from 'weixin-js-sdk'
  import { Toast, Indicator } from 'mint-ui'

  export default {
    name: "OpenMember",
    components: {
      FulfillingBouncingCircleSpinner
    },
    data() {
      return {
        has_data: false,
        pay_success: false,
        list_active: 3,
        payments: {},
        extension_payment: {},
        member_time: null
      }
    },
    computed: {
      member_lock_at() {
        return this.$store.state.user.member_lock_at
      }
    },
    mounted() {
      this.getPayments()
    },
    methods: {
      getPayments() {
        let vm = this
        let payments = paymenets()
        payments.then(function (res) {
          res = res.data
          res.forEach(function (value) {
            vm.payments[value.id] = value
          })
          vm.extension_payment = res[2]
          vm.has_data = true
        })
      },
      changeActive(index) {
        this.list_active = index
        this.extension_payment = this.payments[index]
      },
      cancel_alert () {
        this.pay_success = false
      },
      handlerPay () {
        Indicator.open()
        let _this = this
        let member_time = _this.moment(_this.$store.state.user.member_lock_at)
        if(member_time.unix() <= _this.moment().unix()) {
          member_time = _this.moment()
        }
        pay(_this.list_active, {pay_type: 1}).then(function (res) {
          if(res.code === '513') {
            Toast(res.err_msg)
            Indicator.close()
            return
          }
          _this.payCallback(res.config,function () {
            member_time.add(res.member_month, 'months')
            _this.member_time = member_time.format("YYYY-MM-D")
            let new_user = JSON.parse(localStorage.user)
            new_user.member_lock_at = _this.member_time
            localStorage.user = JSON.stringify(new_user)
            _this.$store.commit('setTokenAndUser', JSON.parse(localStorage.user))
            Indicator.close()
            _this.pay_success = true
          });
        }).catch(function (e) {
          console.log(e)
        })
      },
      payCallback ($config,callback) {
        wx.ready(function() {
          wx.chooseWXPay({
            timestamp: $config.timestamp,
            nonceStr: $config.nonceStr,
            package: $config.package,
            signType: $config.signType,
            paySign: $config.paySign, // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
              callback && callback(res)
            }, cancel: function () {
              Toast({message: '取消支付', duration: 1000})
              setTimeout(function () {
                $(".alert").hide().find(".payment").removeClass("status");
              }, 1000)
            }, error: function (res) {
              Toast({message: '支付失败', duration: 1000})
              setTimeout(function () {
                $(".alert").hide().find(".payment").removeClass("status")
              }, 1000)
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
