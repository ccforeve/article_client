<template>
  <!--style="position: relative; font-size: 16px"-->
  <div class="flexitemv scroll">
    <div class="loading" v-if="!has_data">
      <div class="loading-icon">
        <fulfilling-bouncing-circle-spinner
                :animation-duration="4000"
                :size="60"
                color="#ff1d5e"
        />
      </div>
    </div>
    <div class="user-punch-info" v-else>
      <div class="img user-punch-info__img" :style="'background-image: url('+ user.avatar +')'"></div>
      <div class="flex centerv user-punch-profile">
        <div class="flexv user-punch-profile__item">
          <p class="user-punch-profile__detail">{{moment(current_user_punch.created_at).format('H:mm:ss')}}</p>
          <p class="user-punch-profile__tip">打卡时间</p>
        </div>
        <div class="flexv user-punch-profile__item">
          <p class="user-punch-profile__detail">{{current_user_punch.rank}}</p>
          <p class="user-punch-profile__tip">全国排行</p>
        </div>
        <div class="flexv user-punch-profile__item">
          <p class="user-punch-profile__detail">{{current_user_punch.total_punch}}天</p>
          <p class="user-punch-profile__tip">累计打卡</p>
        </div>
      </div>
    </div>

    <div class="blank" style="background: #eee; height: 4vw"></div>

    <div class="morning-content">
      <!--早安图-->
      <div class="morning-pic">
        <p class="morning-pic__title">早安图，长按图片保存到手机</p>
        <img class="morning-pic__img" :src="morning_image" width="100%">
        <!--<button class="morning-pic__edit js-edit" type="button" data-src="{{ $morningPoster->img }}">修改早安图个人信息</button>-->
      </div>
      <div class="morning-poster">
        <div class="morning-poster__title">
          最新增员海报已更新！ <router-link to="/poster" class="morning-poster__link">点这里生成&gt;&gt;</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {punchCurrentUser, randPoster, getPublicQrcode} from '../api.js'
  import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
  export default {
    name: "Morning",
    components: {
      FulfillingBouncingCircleSpinner
    },
    data () {
      return {
        has_data: false,
        current_user_punch: null,
        morning_image: null
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    mounted () {
      this.getCurrentUserPunch()    //获取当前用户打卡信息
      let _this = this
      randPoster(1, {cate_type: 'category', cate_id: 2}).then(function (res) {
        _this.generateMorningPoster(res.image_url)
      })
    },
    methods: {
      getCurrentUserPunch () {
        let _this = this
        punchCurrentUser().then(function (res) {
          _this.current_user_punch = res.current_user
        })
      },
      generateMorningPoster (morningImgSrc) {
        let _this = this,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            img = new Image()
        getPublicQrcode().then(function (q) {
          var qrcode = new Image()
          var avatar = new Image()
          qrcode.src = q.qrcode
          avatar.src = q.avatar
          img.src = morningImgSrc
          setTimeout(function () {
            //设置画布尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            //绘制背景图
            ctx.drawImage(img, 0, 0);
            //绘制顶部半透明遮罩
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, canvas.width, 180);
            //绘制日期
            ctx.fillStyle = '#fff';
            ctx.font = '100 100px Arial';
            ctx.fillText(_this.moment(_this.current_user_punch.created_at).format('D'), canvas.width - 200, 100);
            //绘制月份
            ctx.fillStyle = '#fff';
            ctx.font = '26px Arial';
            ctx.fillText(_this.moment(_this.current_user_punch.created_at).format('MMM'), canvas.width - 90, 100);
            //绘制坚持早起几天
            ctx.font = '26px Arial';
            ctx.fillText('坚持早起' + _this.current_user_punch.total_punch + '天', canvas.width - 200, 140);
            //绘制底部半透明遮罩
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, canvas.height - 180, canvas.width, 180);
            //绘制二维码
            ctx.drawImage(qrcode, 0, 0, 430, 430, canvas.width - 160, canvas.height - 160, 150, 150);
            //绘制头像边框及头像
            ctx.save();
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 6;
            ctx.arc(85, canvas.height - 85, 60, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.clip();
            ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height, 25, canvas.height - 145, 120, 120);
            ctx.restore();
            //绘制用户信息
            ctx.font = '32px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText(_this.user.nickname, 170, canvas.height - 100);
            ctx.fillText(_this.user.phone, 170, canvas.height - 40);

            _this.morning_image = canvas.toDataURL('image/jpeg');
            _this.has_data = true
          }, 50)
        })
      }
    }
  }
</script>

<style scoped>

</style>
