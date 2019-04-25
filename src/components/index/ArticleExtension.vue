<template>
  <div id="text" class="flexv warp">
    <div class="report-text-area">
      <div class="text-input-wrap">
        <textarea v-model="extension_url" class="text-input" cols="30" rows="10" maxlength="150" placeholder="推荐文章时请填写推荐的文章链接"></textarea>
        <div class="text-num-tip">
          <span class="now-num">{{extension_url.length}}</span>/<span class="max-num">150</span>
        </div>
      </div>
      <div class="rule-tip" @click="ruleAlert">《提交文章规则说明》</div>
      <button type="button" @click="submit">提交</button>
    </div>
    <div class="alert" v-if="alert">
      <div class="mask"></div>
      <div class="no-vip">
        <i class="close" @click="close"></i>
        <div class="bj"><img src="../../assets/image/recommend.png" class="fitimg"></div>
        <router-link to="/open_member" class="flex btn"><i class="flex center open_btn">成为VIP会员</i></router-link>
      </div>
    </div>

    <section id="rule" :class="['flexv','center','wrap',{zoomIn:rule}]" v-show="rule">
      <div class="mainbox bg_white content">
        <div class="flex center title"><h3>提交文章规则说明</h3></div>
        <p class="text">有下列情形的文章，不允许提交（即使提交，也会被删除！）：</p>
        <p class="text">1.内容包含未经授权，严重侵犯他人合法权益的，包括但不限于知识产权、隐私权等；</p>
        <p class="text">2.内容包含相关部门禁止传播的或有伤社会风化的文字、音视频、谣言的；</p>
        <p class="text">3.内容涉及违反国家法律、行政法规、部门规章、地方性法规等规范性文件的；</p>
        <p class="text">4.内容在以上规则范围之外的，参照《微信公众平台运营规则》等相关内容规定不允许的；</p>
        <p class="text">5.内容中包含提交人所涉及品牌之外的产品内容的。</p>
      </div>
      <i class="flex center bls bls-cuo cuo" @click="ruleAlert"></i>
    </section>
  </div>
</template>

<script>
  import {articleExtension} from "../../api"
  import { wechatConfig } from "../../cookie.js";
  import {Toast} from "mint-ui"
  export default {
    name: "article_extension",
    data() {
      return {
        alert: false,
        extension_url: '',
        rule: false, // 规则
      }
    },
    computed: {
      is_member () {
        return this.$store.state.user.is_member
      }
    },
    activated () {
      wechatConfig()
    },
    methods: {
      submit () {
        let _this = this,
            url = this.extension_url
        if(!this.is_member) {
          this.alert = true
          return
        }
        if(!url) {
          Toast('链接不能为空')
          return;
        }
        if(url.indexOf('btl.yxcxin.com') >= 0) {
          Toast('请勿提交本站链接')
          return;
        }
        articleExtension({url: this.extension_url}).then(function (res) {
          Toast({message: res.message, duration: 1500})
          setTimeout(function () {
            _this.$router.go(-1)
          }, 1500)
        }).catch(function (e) {
          Toast(e.url[0])
        })
      },
      close () {
        this.alert = false
      },
      ruleAlert() {
        this.rule = !this.rule
      }
    }
  }
</script>

<style scoped>
  .rule-tip {
    float: right;
    font-size: 1.4rem;
    color: #ff582a;
  }
  #rule{
    position:fixed;
    top:0;
    left:0;
    background:rgba(0,0,0,.6);
  }
  #rule.zoomIn{display:-webkit-box;}
  #rule.zoomIn .content{
    background: #fff;
    animation:zoomIn .5s ease both;
    text-align:justify
  }
  #rule .content{padding:1rem;width:90%;max-height:76%;border-radius:.4rem;}
  #rule .dsclose{position:absolute;bottom:2rem;left:50%;font-size:2rem;color:#eee;transform:translateX(-50%);}
  #rule .title{padding-bottom:1rem;font-size:1.3rem;}
  #rule .text{line-height:2.2rem;font-size:1.2rem;}

  .cuo {
    color: #fff;
    font-size: 3rem;
    padding-top: 10px;
  }
</style>
