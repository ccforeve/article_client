<template>
  <div id="rules" class="flexv mainbox wrap">
    <div class="flex open-linkx extension">
      <div class="flex center header-bar">
        <div class="flex center title-section">
          <div class="title-line"></div>
          <h3 class="flex center header-info">邀好友成功</h3>
        </div>
        <p class="flex center">邀好友成功，拿30%佣金提成</p>
      </div>
    </div>
    <div class="rules_list">
      <h3 class="flex center">赚钱规则</h3>
      <ul>
        <li>
          <div class="flex center rules-num">1</div>
          <div class="rules-info">小伙伴通过你的推广链接开通事业爆文会员服务，你就能拿付费金额的30%佣金奖励，开通的金额越多奖励的金额就越多</div>
        </li>
        <li>
          <div class="flex center rules-num">2</div>
          <div class="rules-info">奖励金额将自动计入您的钱包，所获得的金额都可以提现。</div>
        </li>
        <li class="between">
          <a href="javascript:;" class="flex center btn" @click="sendPosterToWechat">点击生成推广二维码</a>
          <a href="javascript:;" data-url="" class="flex center btn" @click="showCopyAlert">点击复制推广链接</a>
        </li>
      </ul>
    </div>

    <canvas id="myCanvas" style="display: none"></canvas>
    <img src="../assets/image/poster.jpg" id="background" style="display: none">

    <!--提示-->
    <div class="flex center hint" v-show="is_show_qrcode_alert">
      <div class="mask" @click="showWechatAlert"></div>
      <div class="content">
        <div class="flex center">邀请海报已通过微信消息发送给你</div>
        <a href="javascript:;" class="flex center" id="close">请去公众号查看</a>
      </div>
    </div>

    <!--推广链接提示框-->
    <div id="wechat" class="flex center alert" v-show="is_show_copy_alert">
      <div class="new" @click="showCopyAlert"></div>
      <div class="content wechat">
        <h3 class="flex center">长按复制链接</h3>
        <p class="flex center cont">http://localhost:8888/invitation</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {getPublicQrcode, sendPoster} from '../api.js'
  import {Indicator, Toast} from 'mint-ui'

  export default {
    name: "invitation",
    data() {
      return {
        avatar: this.$store.state.user.avatar,
        nickname: this.$store.state.user.nickname,
        is_show_copy_alert: false,
        is_show_qrcode_alert: false
      }
    },
    methods: {
      showCopyAlert() {
        this.is_show_copy_alert = !this.is_show_copy_alert
      },
      showWechatAlert() {
        this.is_show_qrcode_alert = !this.is_show_qrcode_alert
      },
      sendPosterToWechat() {
        let _this = this
        Indicator.open('正在生成二维码，请稍等...')
        let qrcode = getPublicQrcode()
        qrcode.then(function (res) {
          //canvas画图
          var image = document.querySelector('#background');
          var userimg = new Image()
          var qrcode = new Image()
          userimg.src = res.avatar
          qrcode.src = res.qrcode
          var c = document.getElementById("myCanvas");
          var ctx = c.getContext("2d");
          c.width = image.width;
          c.height = image.height;
          ctx.drawImage(image, 0, 0);
          ctx.save();//保存当前环境的状态。否则之后画圆的时候，可见区域只有圆的区域（切记注意）
          ctx.beginPath();
          ctx.strokeStyle = '#fff';
          ctx.font = "30px Microsoft YaHei";
          ctx.fillStyle = '#ff0125';
          ctx.fillText("我是" + _this.nickname, 180, 93);
          let userBorderSize = 50;
          let userBorderX = 115;
          let userBorderY = 118;
          ctx.arc(userBorderX, userBorderY, 100 / 2, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(userimg, 0, 0, userimg.width, userimg.height, userBorderX - userBorderSize, userBorderY - userBorderSize, userBorderSize * 2, userBorderSize * 2);
          ctx.restore();
          ctx.drawImage(qrcode, 0, 0, 500, 500, 745, 330, 215, 215);
          try {
            var data = c.toDataURL('image/jpeg');
            //推送推广海报
            let send = sendPoster({image: data})
            send.then(function (r) {
              Indicator.close()
              _this.is_show_qrcode_alert = !_this.is_show_qrcode_alert
            })
          } catch (e) {
            Indicator.close()
            Toast('生成图片失败');
          }
        })
      }
    }
  }
</script>
