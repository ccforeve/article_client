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
  <div id="article" class="flexv wrap" v-else>
    <div class="flexitemv mainbox contents">
      <div class="title max">
        <h2 class="flex">{{detail.article.title}}</h2>
        <div class="flex subhead">
          <span class="date">{{moment(detail.article.created_at).format('YYYY-MM-DD')}}</span>
          <router-link tag="span" :to="'/articles/' + detail.user.id" class="name">{{detail.user.nickname}}
          </router-link>
          <router-link to="/index" class="site" id="index">事业头条</router-link>
        </div>

        <div class="around consult-box">
          <router-link tag="div" :to="'/articles/' + detail.user.id" class="flex center c-img"><img
                  :src="detail.user.avatar" class="radimg"></router-link>
          <router-link :to="'/consultation/normal/' + detail.user.id" class="flex center c-zx"
                       v-if="user.is_member"></router-link>
          <router-link :to="'/consultation/normal/' + detail.user.id" class="flex center c-zx" v-else></router-link>
          <div class="flexv no">
            <div class="between phone">
              <i class="flex center bls bls-shouji" style="color:#0178d6;"></i>
              <div class="flex center number">
                <span>{{user.is_member ? detail.user.phone : detail.user.phone.slice(0, 3) + '********'}}</span>
              </div>
              <a href="tel:" class="flex center n-btn">打电话</a>
            </div>
            <div class="between wx">
              <i class="flex center bls bls-wx" style="width:1.6rem;color:#4ba601;"></i>
              <div class="flex center number">
                <span>{{user.is_member ? detail.user.wechat : detail.user.wechat.slice(0, 3) + '********'}}</span>
              </div>
              <a href="javascript:;" class="flex center n-btn book">加微信</a>
            </div>
          </div>
        </div>
      </div>

      <div class="content" :class="{'max': !detail_all}" v-html="detail.article.detail"></div>

      <div class="flex center unfold" ref="show_detail" @click="show_detail">
        <div class="flex center unfoldbox">
          <p>展开全文</p>
          <i class="flex center bls bls-bottom"></i>
        </div>
      </div>

      <div class="flexv centerv user-info">
        <div class="userimg">
          <img :src="detail.user.avatar" class="fitimg" style="border-radius: 50%;overflow: hidden;">
        </div>
        <p class="flex center name">{{detail.user.nickname}}</p>
        <div class="flex centerh mesg">
          <span>{{detail.user.profession ? detail.user.profession : '健康顾问'}}</span>
          <span>{{user.is_member ? detail.user.phone : detail.user.phone.slice(0, 3) + '********'}}</span>
        </div>
        <div class="buttons">
          <a :href="user.is_member ? 'tel:' + detail.user.phone : 'javascript:;'" class="flex center phone"
             @click="call_phone">
            <i class="flex center bls bls-dh"></i>
            <span>给我电话</span>
          </a>
          <a href="javascript:;" class="flex center" style="background:#07BD13" @click="show_qrcode">
            <i class="flex center bls bls-weixin"></i>
            <span>加微信</span>
          </a>
        </div>
        <span class="row"></span>
        <span class="col"></span>
        <span class="row last"></span>
        <span class="col last"></span>
      </div>

      <router-link
              :to="'/consultation/vip_link/' + detail.user.id"
              class="flex center bls bls-kefu service"
              v-if="user.is_member"
      ></router-link>
      <router-link
              :to="'/consultation/normal/' + detail.user.id"
              class="flex center bls bls-kefu service"
              v-else
      ></router-link>
      <div class="flexv center text-box">
        <p>本文为 <span>{{detail.user.nickname}}</span> 发布，不代表事业头条立场</p>
        <p>若内容不规范或涉及违规，可立即 <a href="">举报/报错</a></p>
      </div>

      <div class="flex center fixed-btn" v-if="user.id !== detail.user.id">
        <a href="javascript:;" class="flex center cut" @click="becomeMyArticleHandle(detail.article.id)">免费换成我的名片 >></a>
      </div>
    </div>

    <div class="flex center hint" v-show="show_qrcode_html">
      <div class="mask" @click="show_qrcode"></div>
      <div class='content'>
        <h3 class="flex center">加我免费咨询</h3>
        <div class="qrcode">
          <img :src="detail.user.qrcode" class="fitimg">
        </div>
        <p class="flex center">长按识别二维码</p>
      </div>
    </div>

    <perfect-information type="article_detail" :user="detail.user" v-if="!user.phone"></perfect-information>
  </div>
</template>

<script>
  import PerfectInformation from '@/components/common/PerfectInformation.vue'
  import {Toast} from 'mint-ui';
  import {getIndexArticleDetail, getUserArticleDetail, becomeMyArticle, updateReadTime} from '../api.js'
  import {FulfillingBouncingCircleSpinner} from 'epic-spinners'

  export default {
    name: "ArticleDetail",
    components: {
      PerfectInformation,
      FulfillingBouncingCircleSpinner,
    },
    data() {
      return {
        article_type: this.$route.params.type,
        has_data: false,
        detail_all: false,
        show_qrcode_html: false,
        detail: [],
        timer: null
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    activated() {
      this.has_data = false
      this.show_qrcode_html = false
      this.article_type = this.$route.params.type
      this.getDetail(this.$route.params.id)
    },
    beforeRouteLeave(to,from,next){
      clearInterval(this.timer)
      next()
    },
    methods: {
      getDetail(id) {
        let data = []
        if (this.article_type === 'public') {
          data = getIndexArticleDetail(id)
        } else if (this.article_type === 'user') {
          data = getUserArticleDetail(id)
        }
        let vm = this
        data.then(function (res) {
          vm.detail = res
          vm.has_data = true
          let footprint = res.footprint
          if(footprint) {
            vm.logTime(footprint)
          }
        })
      },
      show_detail() {   //查看更多内容
        this.detail_all = true
        this.$refs.show_detail.remove()
      },
      show_qrcode() {   //显示二维码
        if (this.user.is_member) {
          if (!this.detail.user.qrcode) {
            Toast('该用户未上传二维码')
            return
          }
        } else {
          Toast('该用户未开通此服务')
          return
        }
        this.show_qrcode_html = !this.show_qrcode_html
      },
      call_phone() {    //打电话
        if (!this.user.is_member) {
          if (localStorage.user.id != this.detail.article.user_id) {
            Toast('该用户未开通此服务')
          } else {
            Toast('您未开通此服务')
          }
        }
      },
      becomeMyArticleHandle (article_id) {
        let _this = this
        becomeMyArticle({article_id: article_id}).then(function (res) {
          clearInterval(this.timer)
          _this.$router.push('/article_detail/' + res.user_article_id + '/user')
        }).catch(function (e) {
          console.log(e)
        })
      },
      logTime(logid) {    //更新阅读时间
        let seconds = 0, btn = true
        this.timer = setInterval(() => {
          seconds++
          //一分钟前每隔五秒请求接口更新阅读时间，一分钟后则隔10秒
          if((seconds % 5 == 0 && seconds <= 60) || (seconds % 10 == 0 && seconds > 60)) {
            btn = true
          }
          if(btn == false) return null
          btn = false
          let update = updateReadTime(logid, {read_time: seconds})
          update.then(function (res) {

          }).catch(function (e) {
            console.log(e)
          })
        }, 1000)
      }
    },
  }
</script>

<style scoped>
  body {
    background: #fff !important;
  }

  .service {
    color: #fff !important;
  }

  .c-zx {
    background: url('../assets/image/xz.gif') no-repeat !important;
    background-size: contain !important;
  }
</style>
