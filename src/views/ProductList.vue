<template>
  <div
    id="seek"
    class="flexv wrap"
  >
    <form
      action=""
      method="get"
    >
      <div class="flex center search">
        <div class="flex centerv home-sea">
          <input
            type="text"
            v-model="key"
            class="flexitem sea-text"
            placeholder="输入关键字，找产品"
          >
          <span class="flex center bls bls-cuo empty"></span>
        </div>
      </div>
    </form>

    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <div
        class="listbox"
        id="listbox"
        style="height: 100%"
      >

        <div class="prodTitle"><i class="borderLeft"></i><span>全部产品</span></div>
        <div
          class="listbox"
          id="listbox"
        >
          <router-link
            :to="'index'"
            class="flex prodBox"
          >
            <div class="between lists boxBorder">
              <div class="img">
                <img
                  class="fitimg"
                  src=""
                />
              </div>
              <div class="flexitemv cont prod">
                <h2 class="flexitemv">阿乐汉300g虾味道方便面</h2>
                <div class="flex base">
                  <span
                    class="flex center"
                    style="padding-right: 30px"
                  >
                    <i class="flex center bls"></i>
                    售价: <span>10.90元+2.00券</span>
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";

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
        auto: false,
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
          tip: "暂无相关数据~" //提示
        }
      },
      dataList: [] // 列表数据
    };
  },
  watch: {
    key(val) {
      this.key = val;
      this.getArticle(val);
    }
  },
  methods: {
    // 跳转文章详情
    // toDetail(id){
    //   this.$router.push("'/article_detail/' + item.id + '/public'")
    // },
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
    getArticle: _.debounce(function() {
      this.mescroll.triggerDownScroll();
    }, 1000)
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
  },
  activated() {
    this.getArticle();
  }
};
</script>

<style scoped>
.mescroll {
  position: fixed;
  top: 80px;
  bottom: 0;
  height: auto;
}

.listbox .lists .cont h2 {
  font-weight: normal;
  height: 4.2rem;
  line-height: 26px;
  font-size: 1.4rem;
  color: #424242;
  overflow: hidden;
}
#seek .listbox .lists .prod {
  height: 5rem;
  padding: 0 10px;
}
.listbox .lists .prod h2 {
  font-weight: normal;
  height: 5.2rem;
  line-height: 26px;
  font-size: 1.2rem;
  color: #424242;
  overflow: hidden;
  color: green;
}
.prodBox{
  padding-bottom: 0.5rem;
}
#seek .listbox .boxBorder{
  border-bottom: 1px dashed #d2d2d2 !important;
}
</style>
