<template>
  <div id="read" class="flexv">
    <div class="loading" v-if="!has_data">
      <div class="loading-icon">
        <fulfilling-bouncing-circle-spinner :animation-duration="4000" :size="60" color="#ff1d5e"/>
      </div>
    </div>
    <div class="flex center title">
      <span class="flex center read" :class="{'elect': type === 'read'}" @click="changeTab(1, 'read')">阅读</span>
      <span class="flex center share" :class="{'elect': type === 'share'}" @click="changeTab(2, 'share')">分享</span>
    </div>
    <mescroll-vue v-for="i of 2" :key="i" :ref="'mescroll'+ i" :index="i" v-show="tabType === i" :down="getMescrollDown(i)" :up="getMescrollUp(i)" @init="mescrollInit" class="article-list">
      <div class="flexitemv mainbox box">
        <div class="shares" id="shares">
          <div class="listbox" :id="'dataList' + i" v-for="(citem, cindex) of tab[i].list">
            <div class="between top">
              <div class="flex">
                <div class="headimg">
                  <img :src="citem.avatar" class="fitimg">
                </div>
                <div class="flexitemv info">
                  <p class="flex centerv">{{citem.nickname}}</p>
                  <p class="flex centerv">{{citem.created_at}}</p>
                </div>
              </div>
              <div class="flex center time">总计停留<em>{{citem.residence_time}}</em></div>
              <router-link :to="'/footprint/' + citem.id" class="flex center btn">找到他</router-link>
            </div>
            <div class="flex lists">
              <div class="img">
                <img class="fitimg" :src="citem.article.cover"/>
              </div>
              <div class="flexitemv cont">
                <router-link to="" class="flexitemv">{{citem.article.title}}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import { footprint } from "../api.js";
import { wechatConfig } from "../cookie.js";
import MescrollVue from "mescroll.js/mescroll.vue";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";

export default {
  name: "Footprint",
  components: {
    MescrollVue,
    FulfillingBouncingCircleSpinner
  },
  data() {
    return {
      has_data: false,
      tabType: 1,
      type: "read",
      tab: {
        1: { mescroll: null, list: [], isListInit: false },
        2: { mescroll: null, list: [], isListInit: false }
      }
    };
  },
  activated() {
    wechatConfig()
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit(mescroll, index) {
      mescroll.tabType = index; // 加入标记,便于在回调中取到对应的list
      this.tab[index].mescroll = mescroll;
    },
    // 多mescroll的配置,需通过方法获取,保证每个配置是单例
    getMescrollDown(tabType) {
      let isAuto = tabType === 1; // 第一个mescroll传入true,列表自动加载
      return {
        auto: isAuto,
        callback: this.downCallback
      };
    },
    getMescrollUp(tabType) {
      let emptyWarpId = "dataList" + tabType;
      return {
        auto: false,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        page: {
          num: 0,
          size: 5
        },
        empty: {
          warpId: emptyWarpId, // 父布局的id;
          icon: "http://www.mescroll.com/img/mescroll-empty.png", // 图标,默认null
          tip: "暂无相关数据~", // 提示
          btntext: "去逛逛 >", // 按钮,默认""
          btnClick: function() {
            // 点击按钮的回调,默认null
            alert("点击了按钮,具体逻辑自行实现");
          }
        },
        toTop: {
          // 配置回到顶部按钮
          warpId: "mesag",
          offset: 500,
          src: "http://www.mescroll.com/img/mescroll-totop.png" // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
        }
      };
    },
    downCallback(mescroll) {
      mescroll.resetUpScroll(); // 触发下拉刷新的回调,加载第一页的数据
    },
    /* 上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    upCallback(page, mescroll) {
      this.tab[mescroll.tabType].isListInit = true; // 标记列表已初始化,保证列表只初始化一次
      this.getListDataFromNet(
        mescroll.tabType,
        page.num,
        curPageData => {mescroll.endSuccess(
            curPageData.per_page,
            curPageData.next_page_url ? true : false
          ); // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          if (page.num === 1) this.tab[mescroll.tabType].list = []; // 如果是第一页需手动制空列表
          this.tab[mescroll.tabType].list = this.tab[mescroll.tabType].list.concat(curPageData.data); // 追加新数据
          this.has_data = true;
        },
        () => {
          if (page.num === 1) this.tab[mescroll.tabType].isListInit = false;
          mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
        }
      );
    },
    // 切换菜单
    changeTab(type, style) {
      this.type = style;
      let curTab = this.getTabData(this.tabType); // 当前列表
      let newTab = this.getTabData(type); // 新转换的列表
      curTab.mescroll.hideTopBtn(); // 隐藏当前列表的回到顶部按钮
      this.tabType = type; // 切换菜单
      if (!newTab.isListInit) {
        newTab.mescroll.triggerDownScroll(); // 加载列表
      } else {
        setTimeout(() => {
          // 检查新转换的列表是否需要显示回到到顶按钮
          var curScrollTop = newTab.mescroll.getScrollTop();
          if (curScrollTop >= newTab.mescroll.optUp.toTop.offset) {
            newTab.mescroll.showTopBtn();
          } else {
            newTab.mescroll.hideTopBtn();
          }
        }, 30);
      }
    },
    // 获取菜单对应的数据
    getTabData(tabType) {
      if (tabType == null) tabType = this.tabType;
      return this.tab[tabType];
    },
    getListDataFromNet(tabType, pageNum, successCallback, errorCallback) {
      let res = {};
      try {
        res = footprint(this.type, { page: pageNum });
        res.then(res => {
          res.data.forEach(function (footprint) {
            if(footprint.article.product_id) {
              footprint.article.cover = footprint.article.cover.replace('//img.lvye100.com', 'http://img.lvye100.com')
            }
          })
          successCallback && successCallback(res);
        }).catch(function(err) {
          console.log(err);
        });
      } catch (e) {
        // 联网失败的回调
        errorCallback && errorCallback();
      }
    },
    beforeRouteEnter(to, from, next) {
      // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        let curMescroll = vm.$refs["mescroll" + vm.tabType]; // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        curMescroll && curMescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      });
    },
    beforeRouteLeave(to, from, next) {
      // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      let curMescroll = this.$refs["mescroll" + this.tabType]; // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      curMescroll && curMescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next();
    }
  }
};
</script>

<style scoped>
.mescroll {
  position: fixed;
  top: 55px;
  bottom: 1px;
  height: auto;
}
</style>
