<template>
  <div>
    <div class="toPayLink">
      <router-link
        to="/open_member"
        class="toPayLink"
      >
        <div class="linkWord"><span>线上客户等着你发掘</span>
          <router-link
            to="/open_member"
            class="toPayLibk"
          >立即获客</router-link>
        </div>
      </router-link>
    </div>
    <div style="position: fixed;width:100%;background:#fff;top:3rem;">
      <div class="flexitemv box">
        <div class="flex center nav">
          <span
            class="flex center item"
            v-for="(item, index) of categories"
            :key="index"
            :class="{'current':tabType == item.id}"
          >
            <span
              class="flex center item"
              @click="changeTab(item.id)"
            >
              {{item.title}}
            </span>
          </span>
        </div>
        <div class="flex center search">
          <span class="flex userimg">
            <img
              class="Indexfitimg"
              :src="user_avatar"
            />
          </span>
          <div class="flex centerv home-sea">
            <input
              type="text"
              name="key"
              class="flexitem sea-text"
              placeholder="输入关键字，找文章"
              ref="search_key"
            >
            <i class="flex smtxt"></i>
            <span
              class="flex center bls bls-fdj"
              @click="search"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <mescroll-vue
      v-for="(items, i) of categories"
      :key="i"
      :ref="'mescroll'+ items.id"
      :index="items.id"
      v-show="tabType === items.id"
      :down="getMescrollDown(items.id)"
      :up="getMescrollUp(items.id)"
      @init="mescrollInit"
      class="article-list"
    >
      <div
        class="listbox"
        :id="'dataList' + items.id"
      >
        <router-link
          :to="'/article_detail/' + item.id + '/public'"
          class="flex"
          v-for="(item, index) of tab[items.id].list"
          :key="index"
        >
          <div
            class="between lists"
            v-if="item.covers.length < 3 && !item.cover_state"
          >
            <div class="flexitemv cont">
              <h2 class="flexitemv">{{item.title}}</h2>
              <div class="flex base">
                <span
                  class="flex center"
                  style="padding-right: 30px"
                >
                  <i
                    class="flex center bls"
                    :class="[item.category_id == 2 ? 'bls-listen' : 'bls-ck']"
                  ></i>
                  {{item.read_count}}
                </span>
                <!-- <span class="flex center">
                  <i class="flex center bls bls-time"></i>
                  {{item.created_at}}
                </span> -->
              </div>
            </div>
            <div class="img">
              <img
                class="fitimg"
                :src="item.cover"
              />
            </div>
          </div>
          <div
            class="flexv lists"
            v-else
          >
            <div class="flexitemv cont">
              <h2 class="flexitemv">{{item.title}}</h2>
            </div>
            <div class="around imgbox">
              <div
                class="img"
                v-for="(cover, index) of item.covers"
                :key="index"
              >
                <img
                  class="fitimg"
                  :src="'http://stl.yxcxin.com/uploads/' + cover"
                />
              </div>
            </div>
            <div class="flex base">
              <span
                class="flex center"
                style="padding-right: 30px"
              ><i class="flex center bls bls-ck"></i>{{item.read_count}}</span>
              <!-- <span class="flex center">
                <i class="flex center bls bls-time">{{item.created_at}}</i>
              </span> -->
            </div>
          </div>
        </router-link>
      </div>
    </mescroll-vue>

  </div>
</template>

<script>
// 引入mescroll的vue组件
import MescrollVue from "mescroll.js/mescroll.vue";
import { getIndexArticleList, getIndexCategoryList } from "../../api";

export default {
  name: "ArticleList",
  components: {
    MescrollVue // 注册mescroll组件
  },
  data() {
    return {
      tabType: 1,
      category_id: 1,
      categories: {},
      tab: {}
    };
  },
  computed: {
    user_avatar() {
      return this.$store.state.user.avatar;
    }
  },
  mounted() {
    let _this = this;
    let arr = {};
    let res = getIndexCategoryList();
    res
      .then(data => {
        _this.categories = data;
        data.forEach(function(cate, i) {
          arr[cate.id] = { mescroll: null, list: [], isListInit: false };
        });
        _this.tab = arr;
      })
      .catch(function(err) {
        console.log(err);
      });
  },
  methods: {
    search() {
      this.$router.push({
        path: "article_search",
        query: { search_key: this.$refs.search_key.value }
      });
    },

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
      return {
        auto: false,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        noMoreSize: 6, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        page: {
          num: 0,
          size: 6
        },
        htmlNodata: '<p class="upwarp-nodata">已经到底部了~</p>',
        toTop: {
          // 配置回到顶部按钮
          warpId: "home",
          offset: 500,
          src: "http://www.mescroll.com/img/mescroll-totop.png" // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
        }
      };
    },
    downCallback(mescroll) {
      mescroll.resetUpScroll(); // 触发下拉刷新的回调,加载第一页的数据
    },

    upCallback(page, mescroll) {
      let _this = this;
      _this.tab[mescroll.tabType].isListInit = true; // 标记列表已初始化,保证列表只初始化一次
      _this.getListDataFromNet(
        mescroll.tabType,
        page.num,
        curPageData => {
          mescroll.endSuccess(
            curPageData.per_page,
            curPageData.next_page_url ? true : false
          ); // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          if (page.num === 1) _this.tab[mescroll.tabType].list = []; // 如果是第一页需手动制空列表
          _this.tab[mescroll.tabType].list = _this.tab[
            mescroll.tabType
          ].list.concat(curPageData.data); // 追加新数据
        },
        () => {
          if (page.num === 1) _this.tab[mescroll.tabType].isListInit = false;
          mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
        }
      );
    },
    // 切换菜单
    changeTab(type) {
      this.category_id = type;
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
      try {
        let res = getIndexArticleList({
          category_id: this.category_id,
          page: pageNum
        });
        res
          .then(res => {
            successCallback && successCallback(res);
          })
          .catch(function(err) {
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
  },
  deforeDestroy() {
    console.log(this.tab);
  }
};
</script>

<style scoped>
.article-list {
  background: #fff;
}
.toPayLink {
  position: fixed;
  width: 100%;
  height: 3rem;
  background: url("../../assets/image/toPayLinkBg.jpg") center/cover;
}
.linkWord {
  padding-left: 3rem;
  line-height: 3rem;
  letter-spacing: 0.5rem;
  font-size: 1.5rem;
  color: #fff;
}
.toPayLibk {
  letter-spacing: normal;
  font-size: 1rem;
  display: inline-block;
  background: gold;
  padding: 0 0.8rem;
  float: right;
  line-height: 2.2rem;
  border-radius: 1rem;
  color: orangered;
  margin-left: 1rem;
  margin-right: 3rem;
  margin-top: 0.4rem;
}
.mescroll {
  position: fixed;
  top: 11.5rem;
  bottom: 50px;
  height: auto;
}
.Indexfitimg {
  display: inline-block;
  width: 3rem;
  height: 3rem;
  position: relative;
  left: -1rem;
  border-radius: 1.5rem;
  background: #000;
  margin-top: 0.2rem;
}
</style>
