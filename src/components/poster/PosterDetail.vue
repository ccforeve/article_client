<template>
  <div id="posters" class="flexv wrap">
    <div class="loading" v-if="!has_data">
      <div class="loading-icon">
        <fulfilling-bouncing-circle-spinner
                :animation-duration="4000"
                :size="60"
                color="#ff1d5e"
        />
      </div>
    </div>
    <div class="flexitemv mainbox">
      <div class="flex centerv edit" @click="IsShowPerfectAlert">
        <i class="flex center bls bls-amend"></i><span>修改个人信息</span>
      </div>
      <div class="flexv posterbox">
        <p class="flex center">图片已生成，长按保存后即可分享到朋友圈</p>
        <div class="flex poster">
          <i
                  class="flex center bls bls-zjt_"
                  @click="nextOrLast"
          ></i>
          <img class="img" src="" style="width: 23rem;">
          <i
                  class="flex center bls bls-zjt_"
                  @click="nextOrLast"
          ></i>
        </div>
        <button class="flex center share-btn" type="button" @click="sharePoster">去分享</button>
      </div>

      <poster-list :posters="posters" @changePosterList="changePosterList" @changePoster="changePoster"></poster-list>

    </div>

    <!--弹窗-->
    <div class="flex center win" v-show="is_show_alert">
      <div class="flexv center content">
        <i class="flex center bls bls-win"></i>
        <p class="tex1">美图海报已通过公众号发送</p>
        <p class="tex2">马上分享朋友圈</p>
        <p class="tex3">让更多人了解您的事业</p>
        <button class="flex center know-btn" type="button" @click="IsShowAlert">知道了</button>
      </div>
    </div>

    <perfect-information
            type="poster"
            :user="user"
            v-show="is_show_perfect_alert"
            @cancelAlert="IsShowPerfectAlert"
            @change="changInformation"
    ></perfect-information>
  </div>
</template>

<script>
  import PosterList from '@/components/poster/Detail'
  import PerfectInformation from '@/components/common/PerfectInformation'
  import {getPosterDetail, getPublicQrcode, randPoster, sendPoster} from '../../api.js'
  import {Indicator, Toast} from 'mint-ui'
  import {FulfillingBouncingCircleSpinner} from 'epic-spinners'

  export default {
    name: "PosterDetail",
    components: {
      PosterList,
      PerfectInformation,
      FulfillingBouncingCircleSpinner
    },
    data() {
      return {
        has_data: true,
        poster_id: this.$route.params.id,
        detail: {},
        posters: {},
        poster: '',
        base64Image: {},
        is_show_alert: false,
        is_show_perfect_alert: false
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.poster_id = to.params.id
      this.makePoster()
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    mounted () {
      this.changePosterList()
    },
    activated() {
      this.poster_id = this.$route.params.id
      this.makePoster()
      let _this = this
      getPublicQrcode().then(function (res) {
        _this.base64Image = res
      })
    },
    methods: {
      makePoster() {
        let _this = this
        Indicator.open('正在生成海报中，请稍等...')
        let detail = getPosterDetail(_this.poster_id)
        detail.then(function (res) {
          _this.detail = res
          _this.canvasMakePoster(res)
        }).catch(function (e) {
          console.log(e)
        })
      },
      canvasMakePoster(poster) {
        let _this = this
        var can = document.createElement("canvas"), ctx = can.getContext("2d")
        var imgs = new Image()
        var qrcode = new Image()
        var avatar = new Image()
        imgs.src = poster.image_url
        qrcode.src = _this.base64Image.qrcode
        avatar.src = _this.base64Image.avatar
        setTimeout(function () {
          //设置画布尺寸
          can.width = imgs.width
          can.height = imgs.height
          //绘制背景图
          ctx.drawImage(imgs, 0, 0)
          ctx.fillStyle = 'rgba(0,0,0,0.5)'
          ctx.fillRect(0, can.height - 160, can.width, can.height - 160)
          //绘制信息
          ctx.font = '32px Arial'
          ctx.fillStyle = '#fff'
          ctx.fillText('绿叶  ' + _this.user.nickname, 170, can.height - 100)
          ctx.fillText(_this.user.phone ? _this.user.phone : '', 170, can.height - 40)
          //绘制二维码
          ctx.drawImage(qrcode, can.width - 135, can.height - 140, 120, 120)
          //绘制用户头像
          ctx.save()
          ctx.strokeStyle = '#ccc'
          ctx.lineWidth = 2
          ctx.arc(85, can.height - 80, 60, 0, 2 * Math.PI)
          ctx.stroke()
          ctx.clip()
          ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height, 25, can.height - 140, 120, 120)
          ctx.restore()
          let base64 = can.toDataURL('image/jpeg')
          document.querySelector(".img").src = base64
          _this.poster = base64
          _this.has_data = true
          Indicator.close()
        }, 100)
      },
      nextOrLast() {
        let _this = this
        Indicator.open('正在生成海报中，请稍等...')
        let poster = randPoster(1)
        poster.then(function (res) {
          _this.detail = res
          _this.canvasMakePoster(res)
        }).catch(function (e) {
          console.log(e)
        })
      },
      changePosterList() {
        let _this = this
        let rand_poster = randPoster(6)
        rand_poster.then(function (res) {
          _this.posters = res
        }).catch(function (e) {
          console.log(e)
        })
      },
      changePoster (id) {
        let _this = this
        Indicator.open('正在生成海报中，请稍等...')
        let poster = getPosterDetail(id)
        poster.then(function (res) {
          _this.detail = res
          _this.canvasMakePoster(res)
        }).catch(function (e) {
          console.log(e)
        })
      },
      sharePoster() {
        let _this = this
        Indicator.open('正在发送图片')
        let send = sendPoster({image: _this.poster})
        send.then(function (res) {
            Indicator.close()
          _this.IsShowAlert()
        }).catch(function (e) {
          console.log(e)
        })
      },
      IsShowAlert() {
        this.is_show_alert = !this.is_show_alert
      },
      IsShowPerfectAlert() {
        this.is_show_perfect_alert = !this.is_show_perfect_alert
      },
      changInformation() {
        this.canvasMakePoster(this.detail)
        this.is_show_perfect_alert = !this.is_show_perfect_alert
      }
    }
  }
</script>
