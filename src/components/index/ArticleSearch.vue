<template>
  <div id="seek" class="flexv wrap">
    <form action="" method="get">
      <div class="flex center search">
        <div class="flex centerv home-sea">
          <input type="text" v-model="key" class="flexitem sea-text" placeholder="输入关键字，找文章">
          <i class="flex smtxt"></i>
          <span class="flex center bls bls-fdj" @click="search"></span>
        </div>
      </div>
    </form>

    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="listbox" id="listbox" style="height: 100%">
        <router-link :to="'/article_detail/' + item.id + '/public'" class="flex" v-for="(item, index) of dataList" :key="index">
          <div class="between lists" v-if="item.covers.length < 3 && !item.cover_state">
            <div class="flexitemv cont ">
              <h2 class="flexitemv flexTitle">{{item.title}}</h2>
              <div class="flex base">
                <span class="flex center" style="padding-right: 30px">
                  <i class="flex center bls" :class="[item.category_id == 2 ? 'bls-listen' : 'bls-ck']"></i>
                  {{item.read_count}}
                </span>
              </div>
            </div>
            <div class="img">
              <img class="fitimg" :src="item.cover"/>
            </div>
          </div>
          <div class="flexv lists" v-else>
            <div class="flexitemv cont ">
              <h2 class="flexitemv flexTitle">{{item.title}}</h2>
            </div>
            <div class="around imgbox">
              <div class="img" v-for="(cover, index) of item.covers" :key="index">
                <img class="fitimg" :src="'http://stl.yxcxin.com/uploads/' + cover"/>
              </div>
            </div>
            <div class="flex base">
              <span class="flex center" style="padding-right: 30px"><i class="flex center bls bls-ck"></i>{{item.read_count}}</span>
              <span class="flex center">
                <i class="flex center bls bls-time">{{item.created_at}}</i>
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import { getIndexArticleList } from "../../api.js";
import MescrollVue from "mescroll.js/mescroll.vue";
import top from "../../assets/image/mescroll-totop.png";
import empty from "../../assets/image/mescroll-empty.jpg";
import {wechatConfig} from "../../cookie.js";

let _ = require("lodash");

export default {
  name: "ArticleSearch",
  components: {
    MescrollVue
  },
  data() {
    return {
      key: this.$route.query.search_key,
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
          src: top, //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "listbox", //父布局的id (1.3.5版本支持传入dom元素)
          icon: empty, //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      dataList: [] // 列表数据
    }
  },
  watch: {
    key(val) {
      this.key = val;
    }
  },
  activated() {
    wechatConfig();
  },
  methods: {
    //mescroll组件初始化的回调,可获取到mescroll对象 (如果this.mescroll并没有使用到,可不用写mescrollInit)
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      // 联网请求
      let data = getIndexArticleList({ search_key: this.key, page: page.num });
      data
        .then(response => {
          // 请求的列表数据
          let arr = response.data;
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.dataList = [];
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    },
    search() {
      this.mescroll.triggerDownScroll();
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
.prodTitle {
  font-size: 1.2rem;
  line-height: 2rem;
  background: #fff;
  padding-left: 1rem;
  border-bottom: 1px solid #d2d2d2;
}
.borderLeft {
  display: inline-block;
  width: 0.5rem;
  height: 1rem;
  background: green;
  margin-right: 1rem;
}
.mescroll {
  position: fixed;
  top: 80px;
  bottom: 0;
  height: auto;
}
.flexTitle {
  font-weight: normal;
  height: 4.2rem;
  line-height: 26px;
  font-size: 1.4rem;
  color: #424242;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
