<template>
  <div class="loading" v-if="!has_data">
    <div class="loading-icon">
      <fulfilling-bouncing-circle-spinner :animation-duration="4000" :size="60" color="#ff1d5e" />
    </div>
  </div>
  <div id="article" class="flexv wrap" v-else>
    <div class="flexitemv mainbox contents">
      <div class="title max">
        <h2 class="flex">{{detail.article.title}}</h2>
        <div class="flex subhead">
          <router-link tag="span" :to="'/articles/' + detail.user.id" class="name">{{detail.user.nickname}}
          </router-link>
          <router-link to="/index" class="site" id="index">事业分享</router-link>
        </div>
        <div style="margin-bottom: 13px">
          <a class="askMe" @click="askMe('/consultation/message/' + detail.user.id)">
            点我在线留言
          </a>
        </div>
        <!-- 新增产品信息 -->
        <div class="productMess" v-if="product">
          <p class="prodTitle">{{product.name}}[{{product.sale_unit}}]</p>
          <div class="prodMess" v-if="product.kind == 1">零售价：{{product.price}}元 会员价：{{product.money}}元 1{{product.unit}}={{product.multiple + product.min_unit}} 上市时间： {{moment(product.listed_at).format('YYYY-MM-DD')}}</div>
          <div class="prodMess" v-else>零售价：{{product.price}}元 会员价：{{product.money}}元+{{product.ticket}}券 1{{product.unit}}={{product.multiple + product.min_unit}} 上市时间： {{moment(product.listed_at).format('YYYY-MM-DD')}}</div>
          <img class="prodImg" :src="product.cover.replace('//img.lvye100.com', 'http://img.lvye100.com')" alt="">
          <div class="prodHr"></div>
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
        <router-link tag="div" :to="'/articles/' + detail.user.id" class="userimg">
          <img :src="detail.user.avatar" class="fitimg" style="border-radius: 50%;overflow: hidden;">
        </router-link>
        <p class="flex center name">{{detail.user.nickname}}</p>
        <div class="flex centerh mesg">
          <span>{{detail.user.profession ? detail.user.profession : '健康顾问'}}</span>
          <span>{{is_member ? detail.user.phone : '********'}}</span>
        </div>
        <div class="buttons">
          <a :href="is_member ? 'tel:' + detail.user.phone : 'javascript:;'" class="flex center phone" @click="call_phone">
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
              to="/turntable"
              class="flex center turntable"
              v-if="user.id === 50 || user.id === 42 || user.id === 38 || user.id === 17 || user.id === 20"
      ></router-link> <!---v-if="is_activity"--->

      <a class="flex center bls bls-kefu service" @click="askMe('/consultation/message/' + detail.user.id)"></a>
      <div class="flexv center text-box">
        <p>本文为 <span>{{detail.user.nickname}}</span> 发布，不代表事业分享立场</p>
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

    <div class="flex center gzh" v-if="qrcode_alert">
      <div class="mask" @click="close_qrcode_alert"></div>
      <div class='content'>
        <h3 class="flex center">关注公众号获取更多资讯</h3>
        <div class="qrcode">
          <img :src="qrcode" class="fitimg">
        </div>
        <p class="flex center">长按识别二维码</p>
      </div>
    </div>

    <perfect-information type="article_detail" :user="user" v-if="user_information_alter" @change="change" @cancelAlert="cancelAlert"></perfect-information>

  </div>
</template>

<script>
import PerfectInformation from "@/components/common/PerfectInformation.vue";
import { Toast } from "mint-ui";
import {
  getIndexArticleDetail,
  getUserArticleDetail,
  becomeMyArticle,
  updateReadTime,
  shareUserArticle,
  getWechatQrcode,
  updateArticleShareCount,
  judgeActivity
} from "../api.js";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";
import wx from "weixin-js-sdk";

export default {
  name: "ArticleDetail",
  components: {
    PerfectInformation,
    FulfillingBouncingCircleSpinner
  },
  data() {
    return {
      has_data: false,
      detail_all: false,
      show_qrcode_html: false,
      article_id: this.$route.params.id,
      article_type: this.$route.params.type,
      from: this.$route.query.from,
      detail: [],
      product: [],
      is_member: false,
      user_information_alter: false,
      qrcode: null,
      qrcode_alert: false,
      timer: null,
      is_miniprogram: false,
      is_activity: false    //是否活动期间
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  activated() {
    let _this = this
    wx.miniProgram.getEnv(function (res) {
      _this.is_miniprogram = res.miniprogram
    })
    this.has_data = false;
    this.show_qrcode_html = false;
    this.article_type = this.$route.params.type;
    this.getDetail(this.$route.params.id);
    if (this.article_type == "public" && !this.user.phone) {
      this.user_information_alter = true;
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
  methods: {
    async judgeActivity() {
      let activity = await judgeActivity()
      this.is_activity = activity.data
    },
    getDetail(id) {
      let data = [];
      if (this.article_type === "public") {
        data = getIndexArticleDetail(id);
      } else if (this.article_type === "user") {
        data = getUserArticleDetail(id, { from: this.$route.query.from });
      }
      let _this = this;
      data.then(function (res) {
        let replace_detail = res.article.detail;
        if (res.article.product_id) {   // 如果是产品文章，给图片链接加上http
          res.article.detail = replace_detail.replace(
            /\/\/img.lvye100.com/g,
            "http://img.lvye100.com"
          );
        } else {
          res.article.detail = replace_detail.replace(
            /crossorigin="anonymous"/g,
            ""
          );
        }
        // 如果是小程序打开的话去掉视频并提示
        if (_this.is_miniprogram) {
          res.article.detail = replace_detail.replace(
            /<iframe("[^"]*"|'[^']*'|[^'">])*>/,
            "<span style='display:block;text-align: center;font-size: 1.4rem;color: red'>小程序内暂不可播放视频</span>"
          );
        }
        _this.detail = res;
        _this.product = res.product;
        if (_this.moment(res.user.member_lock_at).isAfter(_this.moment())) {
          _this.is_member = true;
        }
        _this.has_data = true;
        let footprint = res.footprint;
        if (footprint) {
          _this.logTime(footprint);
        }
        _this.wechatConfig();
      });
    },
    askMe(url) {     //留言
      if (this.user.id === this.detail.user.id) {
        Toast({ message: '不能给自己留言喔', duration: 1000 })
        return
      }
      this.$router.push(url)
    },
    cancelAlert() {    //关闭完善信息弹窗
      this.user_information_alter = false
    },
    show_detail() {
      //查看更多内容
      this.detail_all = true;
      this.$refs.show_detail.remove();
    },
    show_qrcode() {
      //显示二维码
      if (this.is_member) {
        if (!this.detail.user.qrcode) {
          if (this.user.id != this.detail.user.id) {
            Toast("该用户未上传二维码");
          } else {
            Toast("您未上传二维码");
          }
          return;
        }
        this.show_qrcode_html = !this.show_qrcode_html;
      } else {
        if (this.user.id != this.detail.user.id) {
          Toast("该用户未开通此服务");
        } else {
          Toast("您未开通此服务");
        }
      }
    },
    call_phone() {
      //打电话
      if (!this.is_member) {
        if (this.user.id != this.detail.user.id) {
          Toast("该用户未开通此服务");
        } else {
          Toast("您未开通此服务");
        }
      }
    },
    close_qrcode_alert() {     //关闭二维码弹窗
      this.qrcode_alert = false
    },
    change() {    //完善信息后
      this.user_information_alter = false;
      if (!this.user.is_subscribe) {
        this.getQrcode()
      }
    },
    becomeMyArticleHandle(article_id) {     //成为我的文章操作
      let _this = this;
      if (!_this.user.phone) {
        _this.user_information_alter = true;
        return;
      }
      if (!_this.user.is_subscribe) {
        this.getQrcode()
        return;
      }
      becomeMyArticle({ article_id: article_id })
        .then(function (res) {
          clearInterval(_this.timer);
          _this.getDetail(res.user_article_id);
          _this.$router.push(
            "/article_detail/" + res.user_article_id + "/user"
          );
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    getQrcode() {
      let _this = this
      _this.qrcode_alert = true
      getWechatQrcode(this.detail.user.id).then(function (res) {
        _this.qrcode = res.qrcode
      })
    },
    logTime(logid) {    //浏览时间
      //更新阅读时间
      let seconds = 0,
        btn = true;
      this.timer = setInterval(() => {
        seconds++;
        //一分钟前每隔五秒请求接口更新阅读时间，一分钟后则隔10秒
        if (
          (seconds % 5 == 0 && seconds <= 60) ||
          (seconds % 10 == 0 && seconds > 60)
        ) {
          btn = true;
        }
        if (btn == false) return null;
        btn = false;
        let update = updateReadTime(logid, { read_time: seconds });
        update
          .then(function (res) { })
          .catch(function (e) {
            console.log(e);
          });
      }, 1000);
    },
    wechatConfig() {
      //微信jssdk
      let _this = this,
        cover = _this.detail.article.cover;
      if (cover.indexOf("//img.lvye100.com") >= 0) {
        cover = cover.replace(
          "//img.lvye100.com/p/",
          "http://img.lvye100.com/pxs/"
        );
      }
      wx.ready(function () {
        //需在用户可能点击分享按钮前就先调用
        wx.onMenuShareTimeline({
          title: _this.detail.article.title, // 分享标题
          link: "http://btl.yxcxin.com/article_detail/" + _this.detail.user_article_id + "/user", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: cover, // 分享图标
          success: function () {
            updateArticleShareCount(_this.detail.article.id)
            if (_this.article_type === 'user' && _this.detail.user.id != _this.user.id) {
              shareUserArticle(_this.detail.user_article_id, { user_id: _this.user.id, from: _this.from })
            }
          }
        });
        wx.onMenuShareAppMessage({
          title: _this.detail.article.title, // 分享标题
          desc: _this.detail.article.desc, // 分享描述
          link: "http://btl.yxcxin.com/article_detail/" + _this.detail.user_article_id + "/user", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: cover, // 分享图标
          success: function () {
            updateArticleShareCount(_this.detail.article.id)
            if (_this.article_type === 'user' && _this.detail.user.id != _this.user.id) {
              shareUserArticle(_this.detail.user_article_id, { user_id: _this.user.id, from: _this.from })
            }
          }
        });
      });
    }
  }
};
</script>

<style scoped>
body {
  background: #fff !important;
}

.service {
  color: #fff !important;
}
.productMess {
}
.prodTitle {
  padding: 10px 0 0.6rem 6px;
  font-size: 1.3rem;
}
.prodMess {
  font-size: 1.1rem;
  width: 100%;
  min-height: 1rem;
  background: #fdfdfd;
  padding: 1.3rem 3rem 1.3rem 0.4rem;
  border: 1px solid #f3eeee;
  border-left: 0.4rem solid #20b2aa;
  margin: 0.5rem 0 1rem 0;
}
.prodImg {
  width: 100%;
  height: auto;
}
.prodHr {
  width: 100%;
  margin: 0.5rem 0;
  height: 1px;
  background: lightseagreen;
}
.askMe {
  display: block;
  width: 95%;
  text-align: center;
  margin: 0 auto;
  padding: 0.7rem 0;
  color: #fff !important;
  background: chocolate;
  border-radius: 2rem;
  letter-spacing: 0.2rem;
  font-size: 1.5rem;
}
.turntable {
  position: fixed;
  bottom: 32.5%;
  right: 0;
  width: 6rem;
  height: 6rem;
  padding-left: 0.5rem;
  background-image: url(../assets/image/draw.gif);
  background-size: auto 100%;
  background-repeat: no-repeat;
  font-size: 2.5rem;
}
</style>
