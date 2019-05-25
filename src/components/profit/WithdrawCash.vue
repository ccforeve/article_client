<template>
  <div class="flexv wrap">
    <div id="cash" class="flexitemv mainbox" @click="closeService">
      <div class="cashes">
        <div class="flex center title">推广奖励申请提现</div>
<!--        <div class="flexv bank">-->
<!--          <template v-if="!user.ali_account">-->
<!--            <div class="flex"><span class="flexitem">未绑定账户</span></div>-->
<!--            <div class="flex"><em class="flexitem">您当前尚未绑定支付宝</em></div>-->
<!--            <router-link to="/profit/bind_account" class="flex endh centerv bls bls-yjt"></router-link>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            <div class="flex"><span class="flexitem">支付宝</span></div>-->
<!--            <div class="flex"><em class="flexitem">{{user.ali_name + ' ' + user.ali_account}} </em></div>-->
<!--            <router-link to="/profit/bind_account" class="flex endh centerv bls bls-yjt"></router-link>-->
<!--          </template>-->
<!--        </div>-->
        <h2 class="flex center">{{surplus_profit}}</h2>
        <p class="flex center">当前可提现余额</p>
        <a href="javascript:;" class="flex center getcash" :class="{'disable': !user.ali_account || !surplus_profit}"
           @click="getCash">申请提现</a>
      </div>
      <div class="flex center tips"><span>温馨提示</span></div>
      <div class="tip">
        <p>1、单次提现需大于100，最多200元</p>
        <p>2、提现金额最晚在下一个工作日24:00之前到账</p>
<!--        <p>3、周六、周日与节假日顺延至下一个工作日！</p>-->
      </div>
    </div>
    <!--客服微信-->
    <div class="twinkle flexv kf-qrcode" @click="service">
      <div class="flex center kf-tit">提现客服</div>
      <div class="flex center kf-img">
        <img src="../../assets/image/service.jpg" class="fitimg">
      </div>
    </div>
  </div>
</template>

<script>
  import {getProfit, withdrawCash} from "../../api.js";
  import {Toast, Indicator} from "mint-ui";
  import "../../assets/js/layer.js";

  export default {
    name: "WithdrawCash",
    data() {
      return {};
    },
    computed: {
      // 获取用户信息
      user() {
        return this.$store.state.user;
      },
      // 获取金额
      surplus_profit() {
        return this.$store.state.surplus_profit;
      },
    },
    activated() {
      if (this.$store.state.surplus_profit === null) {
        let _this = this;
        let profit = getProfit();
        profit.then(function (res) {
          _this.$store.commit("updateSurplusProfit", res.surplus_profit);
        });
      }
    },
    methods: {
      service() {
        $('.kf-qrcode').animate({width:'20rem',top:'20%',right:'17%',});
        $(".kf-tit").animate({fontSize:'2.2em'});
      },
      closeService () {
        $(".kf-qrcode").animate({top:'64%',right:'0',width:'6rem',});
        $(".kf-tit").animate({fontSize:'1.2em'});
      },
      getCash() {
        let _this = this;
        // 判断是否是会员，非会员不可提现
        if (!_this.user.is_member) {
          Toast({message: "成为会员，享受提现功能", duration: 1000});
          setTimeout(function () {
            _this.$router.push("/open_member");
          }, 1000);
          return;
        }
        // 判断是否已绑定银行卡
        // if (!_this.user.ali_account) {
        //   Toast({message: "请先绑定支付宝", duration: 1000});
        //   setTimeout(function () {
        //     _this.$router.push("/profit/bind_account");
        //   }, 1000);
        //   return;
        // }
        // 判断余额是否满足
        if (!_this.surplus_profit) {
          Toast({message: "余额不足", duration: 1500});
          return;
        }
        // 限制提现金额
        if (_this.surplus_profit < 100) {
          Toast({message: "提现金额需满100", duration: 1500});
          return;
        }
        let trottle = null,
            surplus_profit = _this.surplus_profit > 200 ? 200 : _this.surplus_profit;
        layer.open({
          content: `<div class="sl">
                        <p class="sl-item line" style="font-size: 17px">提现金额：</p>
                        <input type="number" name="integral" disabled value="${surplus_profit}" placeholder="请输入本次提现余额" class="sl-item" style="text-align: center">
                      </div>`,
          skin: "footer",
          btn: ["确定", "取消"],
          yes: function (index, el) {
            if (!trottle) {
              Indicator.open("申请提现中");
              trottle = true;
              //提现操作
              let withdraw_cash = withdrawCash({price: surplus_profit});
              withdraw_cash.then(function (res) {
                  Indicator.close();
                  Toast({message: "提现成功", duration: 1500});
                  _this.$store.commit("updateSurplusProfit", _this.surplus_profit - surplus_profit);
                }).catch(function (e) {
                  Indicator.close();
                  Toast({message: e.msg, duration: 1500});
                  _this.$store.commit("updateSurplusProfit", _this.surplus_profit - surplus_profit);
                });
              layer.close(index);
            }
          },
          anim: "up"
        });
      }
    }
  };
</script>

<style scoped>
  @import "../../assets/css/layer.css";
  #app{height: 100% !important;}
</style>
