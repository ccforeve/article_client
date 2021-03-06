<template>
  <div id="visitor" class="flexv wrap">
    <div class="loading" v-if="!has_data">
      <div class="loading-icon">
        <fulfilling-bouncing-circle-spinner :animation-duration="4000" :size="60" color="#ff1d5e"/>
      </div>
    </div>
    <div class="flexv centerv around front">
      <a href="javascript:;" class="flexitemv center myfront">
        <em class="flex">{{read_custom.today_footprint}}</em>
        <div class="flex">
          <span class="flex center">今日浏览</span>
        </div>
      </a>
      <div class="flex line"></div>
      <router-link to="/visitor/prospect" class="flexitemv center myfront">
        <em class="flex">{{read_custom.customer}}</em>
        <div class="flex">
          <span class="flex center">准客户</span>
        </div>
      </router-link>
    </div>
    <!-- 有数据的情况则显示 -->
    <div class="flexitemv mainbox box mescroll" id="mescroll" v-if="is_member">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div class="lists data-content">
          <div class="listbox" v-for="(item, index) of dataList" :key="index">
            <div class="flex lists">
              <div class="img">
                <img class="fitimg" :src="item.cover"/>
              </div>
              <div class="flexitemv cont">
                <h2 class="flexitemv">{{item.title}}</h2>
                <div class="between base">
                  <span><em>{{item.created_at}}</em></span>
<!--                  <span><em>{{item.read_count}}</em>浏览</span>-->
                  <span class="flex center"><em>{{item.custom}}</em></span>
                </div>
              </div>
              <router-link :to="'/article_detail/' + item.id + '/user'" class="link"></router-link>
            </div>
            <div class="flex details">
              <div class="flex center imgbox">
                <div class="flex center userimg" v-for="(citem, cindex) of item.user" :key="cindex">
                  <img :src="citem.avatar" class="fitimg" v-if="is_member">
                  <img src="../assets/image/avatar.png" class="fitimg" v-else>
                </div>
              </div>
              <div class="flexitem endh lock">
                <router-link :to="'/visitor/detail/' + item.id" class="flex center" v-if="is_member">
                  谁看了？
                </router-link>
                <a href="javascript:;" class="flex center" v-else @click="notMember">
                  谁看了？
                </a>
              </div>
            </div>
          </div>
        </div>
      </mescroll-vue>
    </div>
    <!-- 没有数据的时候则提示开通会员 -->
    <div class="flexitemv mainbox box mescroll" v-else>
      <div class="visitorBg"></div>
      <div class="mork">
        <p>开通会员之后才能追踪用户,</p>
        <p>你已错过<span>很多</span>次跟进客户机会,</p>
        <p>还有多少机会可以继续错过?</p>
        <router-link to="/open_member" class="toOpen">
          立即开通会员
        </router-link>
      </div>
    </div>
    <index-footer />
  </div>
</template>

<script>
import IndexFooter from "@/components/common/Footer.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
import { wechatConfig } from "../cookie.js";

import { Toast } from "mint-ui";
import {
  getVisitorReadCustom,
  getVisitor,
  updateNewVisitorState
} from "../api.js";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";

export default {
  name: "VisitorIndex",
  components: {
    IndexFooter,
    MescrollVue,
    FulfillingBouncingCircleSpinner
  },
  data() {
    return {
      has_data: false,
      read_custom: {},
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        auto: true,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 5 //每页数据条数,默认10
        },
        htmlNodata: "",
        noMoreSize: 6, //如果列表已无数据,可设置列表总数大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        toTop: {
          //回到顶部按钮
          src: "http://www.mescroll.com/img/mescroll-totop.png", //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "mescroll" //父布局的id (1.3.5版本支持传入dom元素)
          // icon: "http://www.mescroll.com/img/mescroll-empty.jpg", //图标,默认null,支持网络图
          // tip: "暂无相关数据~" //提示
        }
      },
      dataList: [] // 列表数据
    };
  },
  computed: {
    is_member() {
      return this.$store.state.user.is_member;
    }
  },
  activated() {
    wechatConfig();
    let _this = this;
    _this.has_data = false;
    //获取今日浏览和准客户
    let get_read_custom = getVisitorReadCustom();
    get_read_custom.then(function(res) {
      _this.read_custom = res;
      _this.has_data = true;
    });
    //更新访客状态
    if (this.$store.state.check_visitor) {
      let update_state = updateNewVisitorState();
      update_state.then(function(res) {
        _this.$store.commit("checkVisitor");
      });
    }
  },
  methods: {
    //mescroll组件初始化的回调,可获取到mescroll对象 (如果this.mescroll并没有使用到,可不用写mescrollInit)
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      let _this = this;
      getVisitor({ page: page.num }).then(response => {
          // 请求的列表数据
        let visitors = response.data;
        visitors.forEach(function (visitor) {
          if(visitor.product_id) {
            visitor.cover = visitor.cover.replace('//img.lvye100.com', 'http://img.lvye100.com')
          }
        })
        // 如果是第一页需手动制空列表
        if (page.num === 1) _this.dataList = [];
        // 把请求到的数据添加到列表
        this.dataList = _this.dataList.concat(visitors);
        // 数据渲染成功后,隐藏下拉刷新的状态
        this.$nextTick(() => {
          mescroll.endSuccess(visitors.length);
        });
      })
      .catch(e => {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescroll.endErr();
      });
    },
    notMember() {
      Toast({
        message: "成为会员即可查看",
        duration: 1500
      });
      //跳转到开通会员页面
      setTimeout(function() {
        this.$router.push("/open_member");
      }, 1500);
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
  top: 6.5rem;
  bottom: 50px;
  height: auto;
}
.mescroll-totop {
  bottom: 75px !important;
}
.visitorBg {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  float: left;
  /* background-image: url("../assets/image/visitor.png"); */
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% auto;
  filter: blur(20px);
}
.mork {
  position: fixed;
  top: 6.5rem;
  width: 100%;
  z-index: 11;
  height: 100%;
  padding-top: 8rem;
  text-align: center;
}
.mork p {
  line-height: 1rem;
  line-height: 3rem;
  font-size: 1.5rem;
  color: orangered;
}
.toOpen {
  display: inline-block;
  width: 11rem;
  line-height: 3rem;
  border-radius: 2rem;
  border: 0.2rem solid orangered;
  text-align: center;
  color: orangered;
  margin-top: 3rem;
}
</style>
