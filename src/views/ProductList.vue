<template>
  <div id="seek" class="flexv wrap">
    <form method="get">
      <div class="flex center search">
        <div class="flex centerv home-sea">
          <input type="text" v-model="key" class="flexitem sea-text" placeholder="输入关键字，找产品">
          <i class="flex smtxt"></i>
          <span class="flex center bls bls-fdj" @click="search"></span>
        </div>
      </div>
    </form>

    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="listbox" style="height: 100%">
        <div class="prodTitle"><i class="borderLeft"></i><span>搜索结果</span></div>
        <div class="listbox" id="listbox">
          <router-link :to="'/article_detail/' + item.article.id + '/public'"v-for="(item, index) of dataList" :key="index" class="flex prodBox">
            <div class="between lists boxBorder">
              <div class="img">
                <img class="fitimg" :src="item.cover" />
              </div>
              <div class="flexitemv cont prod">
                <h2 class="flexitemv">{{item.name}}</h2>
                <div class="flex base">
                  <span class="flex center">
                    <i class="flex center bls"></i>
                    <template v-if="item.kind === 1">
                      <div v-if="item.price === item.money">会员价: <span>{{item.money}}元</span></div>
                      <div v-else>零售: <span>{{item.price}}元, 会员价：{{item.money}}元</span></div>
                    </template>
                    <div v-else>零售: <span>{{item.price}}元, 会员价：{{item.money}}元 + {{item.ticket}}券</span></div>
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
import {searchProduct} from "../api.js"
import top from "../assets/image/mescroll-totop.png"
import empty from "../assets/image/mescroll-empty.jpg"

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
          size: 10 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">亲,没有更多数据了~</p>',
        noMoreSize: 10, //如果列表已无数据,可设置列表总数大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
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
    };
  },
  watch: {
    key(val) {
      this.key = val
    }
  },
  methods: {
    //mescroll组件初始化的回调,可获取到mescroll对象 (如果this.mescroll并没有使用到,可不用写mescrollInit)
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      // 联网请求
      searchProduct({ search_key: this.key, page: page.num }).then(response => {
          // 请求的列表数据
        let productList = response.data;
        productList.forEach(function (product) {
            product.cover = product.cover.replace('//img.lvye100.com', 'http://img.lvye100.com')
        })
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.dataList = [];
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(productList);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(productList.length);
          });
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    },
    search () {
      this.mescroll.triggerDownScroll();
    },
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
  top: 80px;
  bottom: 0;
  height: auto;
}
.prodTitle {
  padding: 10px 0 10px 10px;
  font-size: 1.3rem;
}
.listbox .lists .cont h2 {
  font-weight: normal;
  height: 4.2rem;
  line-height: 20px;
  font-size: 1.2rem;
  color: #424242;
  /*overflow: hidden;*/
}
#seek .listbox .lists .prod {
  padding: 0 10px;
}
.listbox .lists .prod h2 {
  font-weight: normal;
  height: 5.2rem;
  line-height: 20px;
  font-size: 1.2rem;
  /*overflow: hidden;*/
  color: green;
}
.prodBox{
  padding-bottom: 0.5rem;
}
#seek .listbox .boxBorder{
  border-bottom: 1px dashed #d2d2d2 !important;
}
</style>
