<template>
  <div class="loading" v-if="!has_data">
    <div class="loading-icon">
      <fulfilling-bouncing-circle-spinner :animation-duration="4000" :size="60" color="#ff1d5e" />
    </div>
  </div>
  <div id="open_test" class="flexv wrap" v-else>
    <div class="flipbox" @click="closeService">
      <div class="bor">
        <div class="flex centerv flip" v-for="(item, index) of order_list" :key="index">
          <i class="flex center bls bls-horn"></i>
          <div class="flex text"> 恭喜"<span class="flexv name">{{item.nickname.length > 4 ? item.nickname.substr(0, 4) : item.nickname}}</span>"成功开通会员进行获客展示
          </div>
        </div>
      </div>
    </div>
    <div class="flexv member" @click="closeService">
      <div class="title">会员类型</div>
      <div class="fwrap genrebox">
        <div class="flexv center list" v-for="(item, index) of payments" :key="index" :class="{'commend': item.extension, 'current_border': item.id == list_active}" @click="changeActive(item.id)">
          <div class="flex center time"><span>{{item.month / 12}}</span>年会员权限</div>
          <div class="price">{{item.price}}/{{item.month / 12}}年</div>
          <div class="original">原价{{item.original_price}}/{{item.month / 12}}年</div>
        </div>
      </div>
    </div>
    <div class="payment" @click="closeService">
      <div class="title">支付方式</div>
      <div class="around paybox">
        <div class="flex center list" :class="{current_border: pay_type_active === 1}" @click="payTypeSelect(1)">
          <i class="flex center bls bls-wx-pay" style="color:#45b638"></i>微信安全支付
          <div class="current"></div>
        </div>
        <div class="flex center list" :class="{current_border: pay_type_active === 2}" v-if="!is_miniprogram" @click="payTypeSelect(2)">
          <i class="flex center bls bls-zfb-pay" style="color:#1296db"></i>支付宝安全支付
          <div class="current"></div>
        </div>
      </div>
    </div>
    <!-- 提示 -->
    <!-- <div>幸运大转盘，三十万豪礼等你来拿，手机/平板/现金送不停</div> -->
    <!--客服微信-->
    <div class="twinkle flexv kf-qrcode" @click="service">
      <div class="flex center kf-tit">咨询客服</div>
      <div class="flex center kf-img">
        <img src="../assets/image/service.jpg" class="fitimg">
      </div>
    </div>
    <!-- 权限开通信息 -->
    <div class="vipMess" @click="closeService">
      <h3>会员特权</h3>
      <p>
        <p><i class="iconfont logo icon-icon25 iUser" style="background: chocolate;"></i><span class="titleFont">客户追踪</span></p>
        <p class="textIndex">1.开通会员之后可以查看每篇文章的具体并分析如何找到对应的客户</p>
      </p>
      <p>
        <p><i class="iconfont logo icon-mingpian iUser" style="background: skyblue;"></i><span class="titleFont">展示获客</span></p>
        <p class="textIndex">2.开通会员之后可在文章内插入自己的名片进行获客展示</p>
      </p>
      <p>
        <p><i class="iconfont logo icon-qiapian iUser"></i><span class="titleFont">热文分享</span></p>
        <p class="textIndex">3.开通会员之后可以查看你分享出去的文章都有谁看了及阅读时间</p>
      </p>
      <p>
        <p><i class="iconfont logo icon-mingpian1 iUser" style=" background: blueviolet;"></i><span class="titleFont">人脉倍增</span></p>
        <p class="textIndex">4.开通会员之后可以查看你分享的文章都有谁帮忙转发<p>
          </p>
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
          <!-- <div>有效期至：{{member_time}}</div> -->
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
import { paymenets, wechatPay, orders } from "../api.js";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";
import wx from "weixin-js-sdk";
import { Toast, Indicator } from "mint-ui";

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
      pay_type_active: 1,
      payments: {},
      extension_payment: {},
      order_list: {},
      member_time: null,
      timer: null,
      is_miniprogram: false,
      miniprogram: 0
    };
  },
  computed: {
    member_lock_at() {
      return this.$store.state.user.member_lock_at;
    }
  },
  mounted() {
    this.getPayments()
    this.rollList()
  },
  activated() {
    this.wechatConfig()
    this.roll()
    let _this = this
    wx.miniProgram.getEnv(function (res) {
      _this.is_miniprogram = res.miniprogram
      if (res.miniprogram) {
        _this.miniprogram = 1
      }
    })
  },
  methods: {
    service() {
      $('.kf-qrcode').animate({ width: '20rem', top: '20%', right: '17%', });
      $(".kf-tit").animate({ fontSize: '2.2em' });
    },
    closeService() {
      $(".kf-qrcode").animate({ top: '64%', right: '0', width: '6rem', });
      $(".kf-tit").animate({ fontSize: '1.2em' });
    },
    getPayments() {
      let vm = this;
      let payments = paymenets();
      payments.then(function (res) {
        res = res.data;
        res.forEach(function (value) {
          vm.payments[value.id] = value;
        });
        vm.extension_payment = res[2];
        vm.has_data = true;
      });
    },
    rollList() {
      let _this = this
      orders().then(function (res) {
        _this.order_list = res
      })
    },
    changeActive(index) {
      this.list_active = index;
      this.extension_payment = this.payments[index];
    },
    payTypeSelect(index) {
      this.pay_type_active = index;
    },
    cancel_alert() {
      this.pay_success = false;
    },
    roll() {
      this.timer = setInterval(function roll() {
        var objh = $('.flip').height();
        $(".flipbox .bor").append($(".flipbox .bor .flip").first().height(0).animate({ "height": objh + "px" }, 500));
      }, 2000);
    },
    wechatConfig() {
      //微信jssdk
      wx.ready(function () {
        //需在用户可能点击分享按钮前就先调用
        wx.onMenuShareTimeline({
          title: "分享伙伴开通会员", // 分享标题
          link: "http://btl.yxcxin.com/open_member", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://stl.yxcxin.com/image/qrcode.jpg", // 分享图标
          success: function () {
            // 用户点击了分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
          title: "分享伙伴开通会员", // 分享标题
          desc: "超多精彩文章，每日更新推送，快来看看吧！", // 分享描述
          link: "http://btl.yxcxin.com/open_member", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://stl.yxcxin.com/image/qrcode.jpg" // 分享图标
        });
      });
    },
    handlerPay() {
      Indicator.open();
      let _this = this;
      wechatPay(_this.list_active, { pay_type: _this.pay_type_active, is_miniprogram: _this.miniprogram })
        .then(function (res) {
          if (res.pay_type === 2) {   //支付宝支付
            Indicator.close();
            _this.$router.push("/alipay/" + res.order_id);
          } else if (res.pay_type === 1) {    //微信支付
            _this.wechatPay(res);
          } else if (res.pay_type === 3) {
            //点击微信支付后，调取统一下单接口生成微信小程序支付需要的支付参数
            Indicator.close();
            let path = `/pages/pay?order_id=${res.order_id}&user_id=${res.user_id}`; //定义path 与小程序的支付页面的路径相对应
            wx.miniProgram.navigateTo({ url: path });   //跳回小程序支付
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    wechatPay(res) {
      let _this = this,
        member_time = _this.moment(_this.$store.state.user.member_lock_at);
      if (member_time.unix() <= _this.moment().unix()) {
        member_time = _this.moment();
      }
      if (res.code === "513") {
        Toast(res.err_msg);
        Indicator.close();
        return;
      }
      _this.payCallback(res.config, function () {
        member_time.add(res.member_month, "months");
        _this.member_time = member_time.format("YYYY-MM-D");
        let new_user = JSON.parse(localStorage.user);
        new_user.member_lock_at = _this.member_time;
        new_user.is_member = 1;
        localStorage.user = JSON.stringify(new_user);
        _this.$store.commit("setTokenAndUser", JSON.parse(localStorage.user));
        Indicator.close();
        _this.pay_success = true;
      });
    },
    payCallback($config, callback) {
      wx.ready(function () {
        wx.chooseWXPay({
          timestamp: $config.timestamp,
          nonceStr: $config.nonceStr,
          package: $config.package,
          signType: $config.signType,
          paySign: $config.paySign, // 支付签名
          success: function (res) {
            // 支付成功后的回调函数
            callback && callback(res);
          },
          cancel: function () {
            Indicator.close();
            Toast({ message: "取消支付", duration: 1000 });
            setTimeout(function () {
              $(".alert")
                .hide()
                .find(".payment")
                .removeClass("status");
            }, 1000);
          },
          error: function (res) {
            Indicator.close();
            Toast({ message: "支付失败", duration: 1000 });
            setTimeout(function () {
              $(".alert")
                .hide()
                .find(".payment")
                .removeClass("status");
            }, 1000);
          }
        });
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
};
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.vipMess {
  background: #fff;
  padding: 0.5rem 1.5rem 4rem 1.5rem;
}
.vipMess h3 {
  text-align: center;
  font-size: 1.5rem;
  padding-bottom: 0.5rem;
  color: coral;
  font-weight: 700;
}
.vipMess p {
  font-size: 1.3rem;
  line-height: 1.4rem;
  padding: 0.2rem 0.2rem;
  color: darkgray;
  letter-spacing: 0.2rem;
  font-family: sans-serif;
}
.vipMess p i {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background: orange;
  text-align: center;
  line-height: 2rem;
  border-radius: 1rem;
  color: #fff;
  padding-left: 0.1rem;
}
.vipMess .textIndex {
  padding-left: 2.5rem;
}
.iUser {
  font-size: 1.2rem;
}
.titleFont {
  font-weight: 500;
  color: black;
  padding-left: 0.5rem;
}
.kf-qrcode {
  top: 70;
}
</style>
