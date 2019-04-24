<template>
  <div id="headlines" class="flexv wrap">
    <div class="loading" v-if="!has_data">
      <div class="loading-icon">
        <fulfilling-bouncing-circle-spinner :animation-duration="4000" :size="60" color="#ff1d5e" />
      </div>
    </div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="flexitemv mainbox">
        <div class="listbox" id="listbox" v-for="(item, index) of dataList" :key="index">
          <router-link :to="'/article_detail/' + item.user_article_id + '/user'" class="flex" v-if="item.article">
            <div class="flexitem lists">
              <div class="img">
                <img class="fitimg" :src="item.cover" />
              </div>
              <div class="flexitemv cont">
                <h2 class="flexv">{{item.title}}</h2>
                <div class="base">
                  <span><em>{{item.read_count}}</em>阅读</span>
                  <span><em>{{item.share_count}}</em>分享</span>
                  <span><em>{{moment(item.created_at).format('YYYY-MM-DD')}}</em></span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </mescroll-vue>

    <div class="flex tabbars">
      <div class="flexitem center middle">
        <router-link to="/index" class="flexv center user">
          <span class="flex userimg">
            <img class="fitimg" :src="user_info.avatar" />
          </span>
          <em class="flex center">首页</em>
        </router-link>
      </div>
      <a :href="is_member ? 'tel:' + user_info.phone : 'javascript:;'" class="flexv center item" @click="call_phone">
        <i class="flex center bls bls-dh"></i>
        <em class="flex center">拨手机</em>
      </a>
      <a href="javascript:;" class="flexv center item" @click="show_qrcode">
        <i class="flex center bls bls-weixin"></i>
        <em class="flex center">加微信</em>
      </a>

      <a @click="askMe('/consultation/vip_chart/' + user_id)" class="flexv center item" v-if="is_member">
        <i class="flex center bls bls-zx-ing"></i>
        <em class="flex center">在线资询</em>
      </a>
      <a @click="askMe('/consultation/normal/' + user_id)" class="flexv center item" v-else>
        <i class="flex center bls bls-zx-ing"></i>
        <em class="flex center">在线资询</em>
      </a>
    </div>

    <!--提示-->
    <div class="flex center hint" v-show="is_show_qrcode">
      <div class="mask" @click="show_qrcode"></div>
      <div class='content'>
        <h3 class="flex center">加我免费咨询</h3>
        <div class="qrcode">
          <img :src="user_info.wechat_qrcode" class="fitimg">
        </div>
        <p class="flex center">长按识别二维码</p>
      </div>
    </div>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { MyArticles, getUserInfo } from "../api.js";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";
import { Toast } from "mint-ui";
import wx from 'weixin-js-sdk'

export default {
  name: "my_article",
  components: {
    MescrollVue,
    FulfillingBouncingCircleSpinner
  },
  data() {
    return {
      has_data: false,
      is_show_qrcode: false,
      user_id: this.$route.params.user_id,
      user_info: {},
      is_member: false,
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        auto: true,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 6 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">亲,没有更多数据了~</p>',
        noMoreSize: 6, //如果列表已无数据,可设置列表总数大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        toTop: {
          //回到顶部按钮
          src: "http://www.mescroll.com/img/mescroll-totop.png", //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "listbox", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "http://www.mescroll.com/img/mescroll-empty.jpg", //图标,默认null,支持网络图
          tip: "暂无相关数据1~" //提示
        }
      },
      dataList: [] // 列表数据
    };
  },
  activated() {
    let _this = this;
    getUserInfo({ user_id: this.user_id })
      .then(function (res) {
        _this.user_info = res;
        _this.wechatConfig();
        //判断是否是会员
        if (_this.moment(res.member_lock_at).unix() > _this.moment().unix()) {
          _this.is_member = true;
        }
      });
    if (this.has_data) {
      this.has_data = false;
      this.getPoster();
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    askMe(url) { 
      debugger    //留言
      if (this.user.id === JSON.parse(this.user_id)) {
        Toast({ message: '不能给自己留言喔', duration: 1000 })
        return
      }
      this.$router.push(url)
    },
    //打电话
    call_phone() {
      if (!this.is_member) {
        if (this.$store.state.user.id != this.user_id) {
          Toast("该用户未开通此服务");
        } else {
          Toast("您未开通此服务");
        }
      }
    },
    //加微信弹窗
    show_qrcode() {
      if (this.is_member) {
        if (!this.user_info.wechat_qrcode) {
          Toast("该用户未上传二维码");
          return;
        }
      } else {
        Toast("该用户未开通此服务");
        return;
      }
      this.is_show_qrcode = !this.is_show_qrcode;
    },

    //mescroll组件初始化的回调,可获取到mescroll对象 (如果this.mescroll并没有使用到,可不用写mescrollInit)
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      let _this = this;
      let data = MyArticles(this.$route.params.user_id, { page: page.num });
      data
        .then(response => {
          _this.has_data = true;
          // 请求的列表数据
          let arr = response.data;
          // 如果是第一页需手动制空列表
          if (page.num === 1) _this.dataList = [];
          // 把请求到的数据添加到列表
          _this.dataList = _this.dataList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          _this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    },
    getPoster: function () {
      this.mescroll.resetUpScroll();
    },
    wechatConfig() {     //微信jssdk
      let _this = this
      wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        wx.onMenuShareTimeline({
          title: _this.user_info.nickname + "的文章库", // 分享标题
          link: 'http://btl.yxcxin.com/articles/' + _this.user_info.id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: _this.user_info.avatar, // 分享图标
          success: function () {
            // 用户点击了分享后执行的回调函数
          }
        })
        wx.onMenuShareAppMessage({
          title: _this.user_info.nickname + "的文章库", // 分享标题
          desc: "快来查看我的文章库", // 分享描述
          link: 'http://btl.yxcxin.com/articles/' + _this.user_info.id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: _this.user_info.avatar // 分享图标
        })
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  }
};
</script>

<style scoped>
.mescroll {
  position: fixed;
  top: 0;
  bottom: 60px;
  height: auto;
}
</style>
