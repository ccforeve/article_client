<template>
  <div id="more" class="flexv wrap" style="height: 100%">
    <div class="loading" v-if="!has_data">
      <div class="loading-icon">
        <fulfilling-bouncing-circle-spinner
                :animation-duration="4000"
                :size="60"
                color="#ff1d5e"
        />
      </div>
    </div>
    <div class="flex tex-t">
      <a href="javascript:;" class="flex center" :class="{'current': tabType === 0}" @click="changeTab(0)">
        <span class="flex center">绿叶</span>
      </a>
      <a href="javascript:;"
         class="flex center"
         v-for="(item, index) of categories"
         :key="index"
         :class="{'current':tabType === item.id}"
         @click="changeTab(item.id)"
      >
        <span class="flex center">{{item.name}}</span>
      </a>
    </div>
    <mescroll-vue
            ref="mescroll0"
            :index="0"
            v-show="tabType === 0 && has_data"
            :down="getMescrollDown(0)"
            :up="getMescrollUp(0)"
            @init="mescrollInit"
            class="article-list"
    >
      <div class="flexitemv mainbox">
        <div class="fwrap listbox" id="dataList0">
          <router-link :to="'/poster/detail/' + item.id" class="flexv imgbox" v-for="(item, index) of tab[0].list"
                       :key="index">
            <div class="flex center img">
              <img :src="item.image_url" width="100%">
            </div>
            <div class="flexv center tit">{{item.title}}</div>
          </router-link>
        </div>
      </div>
    </mescroll-vue>
    <mescroll-vue
            v-for="(item, i) of categories"
            :key="i"
            :ref="'mescroll'+ item.id"
            :index="item.id"
            v-show="tabType === item.id"
            :down="getMescrollDown(item.id)"
            :up="getMescrollUp(item.id)"
            @init="mescrollInit"
            class="article-list"
    >
      <div class="flexitemv mainbox">
        <div class="fwrap listbox" :id="'dataList' + item.id">
          <router-link :to="'/poster/detail/' + citem.id" class="flexv imgbox"
                       v-for="(citem, index) of tab[item.id].list" :key="index">
            <div class="flex center img">
              <img :src="citem.image_url" width="100%">
            </div>
            <div class="flexv center tit">{{citem.title}}</div>
          </router-link>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {getPosterCategory, getPosters} from '../api.js'
  import {FulfillingBouncingCircleSpinner} from 'epic-spinners'

  export default {
    name: "poster_list",
    components: {
      MescrollVue,
      FulfillingBouncingCircleSpinner
    },
    data() {
      return {
        has_data: false,
        categories: {},
        tabType: 0,
        category_id: 1,
        tab: {}
      }
    },
    created() {
      let _this = this
      let arr = {}
      let cate = getPosterCategory()
      cate.then((data) => {
        _this.categories = data
        arr[0] = {mescroll: null, list: [], isListInit: false}
        data.forEach(function (cate) {
          arr[cate.id] = {mescroll: null, list: [], isListInit: false}
        })
        _this.tab = arr
      })
    },
    methods: {
      // mescroll组件初始化的回调,可获取到mescroll对象
      mescrollInit(mescroll, index) {
        mescroll.tabType = index; // 加入标记,便于在回调中取到对应的list
        this.tab[index].mescroll = mescroll;
      },
      // 多mescroll的配置,需通过方法获取,保证每个配置是单例
      getMescrollDown(tabType) {
        let isAuto = tabType === 0; // 第一个mescroll传入true,列表自动加载
        return {
          auto: isAuto,
          callback: this.downCallback
        }
      },
      getMescrollUp(tabType) {
        let emptyWarpId = 'dataList' + tabType;
        return {
          auto: false,
          callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
          noMoreSize: 12, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
          page: {
            num: 0,
            size: 12,
          },
          empty: {
            warpId: emptyWarpId, // 父布局的id;
            icon: 'http://www.mescroll.com/img/mescroll-empty.png', // 图标,默认null
            tip: '暂无相关数据~', // 提示
            btntext: '去逛逛 >', // 按钮,默认""
            btnClick: function () { // 点击按钮的回调,默认null
              alert('点击了按钮,具体逻辑自行实现')
            }
          },
          toTop: { // 配置回到顶部按钮
            src: 'http://www.mescroll.com/img/mescroll-totop.png' // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
          }
        }
      },
      downCallback(mescroll) {
        mescroll.resetUpScroll();// 触发下拉刷新的回调,加载第一页的数据
      },
      /* 上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
      upCallback(page, mescroll) {
        this.tab[mescroll.tabType].isListInit = true;// 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(mescroll.tabType, page.num, (curPageData) => {
          mescroll.endSuccess(curPageData.per_page, curPageData.next_page_url ? true : false);// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          if (page.num === 1) this.tab[mescroll.tabType].list = []; // 如果是第一页需手动制空列表
          this.tab[mescroll.tabType].list = this.tab[mescroll.tabType].list.concat(curPageData.data); // 追加新数据
          this.has_data = true
        }, () => {
          if (page.num === 1) this.tab[mescroll.tabType].isListInit = false;
          mescroll.endErr();// 联网失败的回调,隐藏下拉刷新的状态
        })
      },
      // 切换菜单
      changeTab(type) {
        this.category_id = type
        let curTab = this.getTabData(this.tabType);// 当前列表
        let newTab = this.getTabData(type);// 新转换的列表
        curTab.mescroll.hideTopBtn(); // 隐藏当前列表的回到顶部按钮
        this.tabType = type // 切换菜单
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
          }, 30)
        }
      },
      // 获取菜单对应的数据
      getTabData(tabType) {
        if (tabType == null) tabType = this.tabType;
        return this.tab[tabType];
      },
      getListDataFromNet(tabType, pageNum, successCallback, errorCallback) {
        let res = {}
        try {
          if (tabType === 0) {
            res = getPosters('brand', 1, {page: pageNum})
          } else {
            res = getPosters('cate', this.category_id, {page: pageNum})
          }
          res.then((res) => {
            successCallback && successCallback(res);
          }).catch(function (err) {
            console.log(err)
          })
        } catch (e) {
          // 联网失败的回调
          errorCallback && errorCallback();
        }
      },
      beforeRouteEnter(to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
        next(vm => {
          let curMescroll = vm.$refs['mescroll' + vm.tabType] // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
          curMescroll && curMescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
        })
      },
      beforeRouteLeave(to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
        let curMescroll = this.$refs['mescroll' + this.tabType] // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        curMescroll && curMescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
        next()
      }
    },
  }
</script>
