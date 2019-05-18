<template>
  <div id="lately" class="flexv wrap">
    <div class="loading" v-if="!has_data">
      <div class="loading-icon">
        <fulfilling-bouncing-circle-spinner :animation-duration="4000" :size="60" color="#ff1d5e"/>
      </div>
    </div>
    <div class="flexitemv mainbox mescorll">
      <p class="flex centerv explain">说明：文章未被阅读时，记得发给好友。</p>
      <div class="flex lists">
        <div class="img">
          <img class="fitimg" :src="article.cover">
        </div>
        <div class="flexitemv cont">
          <h2 class="flexitem">{{article.title}}</h2>
          <div class="between base">
            <span><em>{{article.created_at}}</em></span>
            <span><em>{{article.read_count}}</em>浏览</span>
          </div>
        </div>
        <a href="" class="link"></a>
      </div>

      <p class="flex center more">浏览 / 分享者</p>

        <div class="sharerbox" id="listbox">
          <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <div class="sharer" v-for="(item, index) of dataList" :key="index">
            <div class="between info">
              <div class="flex centerv kf">
                <div class="flex center img">
                  <img :src="item.see_user.avatar" class="fitimg">
                </div>
                <div class="flexv centerh text">
                  <div class="flexv tex">{{item.see_user.nickname}}</div>
                  <div class="data">
                    <span>{{item.created_at}}</span>
                  </div>
                </div>
              </div>
              <div class="flexv center time">
                <span class="flex"><em>{{item.residence_time}}</em></span>
                <span class="flex">阅读时间</span>
                <!--<span style="font-size: 1.4rem;color: red">分享朋友</span>-->
              </div>
              <router-link :to="'/visitor/read/' + item.see_user.id" class="flex center also-btn">他还看了</router-link>
            </div>
            <div class="relation">
              <p class="text">通过以下人脉关系链接传到-{{item.see_user.nickname}}</p>
              <div class="flex box">
                <div class="flexv center img">
                  <img class="flex" :src="item.user.avatar">
                  <span class="flexv">{{item.user.nickname}}</span>
                </div>
                <template v-if="item.child">
                  <template v-for="(citem, cindex) of item.child">
                    <i class="flex centerh bls bls-right"></i>
                    <div class="flexv center img">
                      <img class="flex" :src="citem.see_user.avatar">
                      <span class="flexv">{{citem.see_user.nickname}}</span>
                    </div>
                  </template>
                </template>
                <i class="flex centerh bls bls-right"></i>
                <div class="flexv center img">
                  <img class="flex" :src="item.see_user.avatar">
                  <span class="flexv">{{item.see_user.nickname}}</span>
                </div>
              </div>
            </div>
          </div>
          </mescroll-vue>
        </div>

    </div>
  </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {getVisitorDetail} from '../../api.js'
  import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
  import {Toast} from 'mint-ui'

  export default {
    name: "VisitorDetail",
    components: {
      MescrollVue,
      FulfillingBouncingCircleSpinner
    },
    data() {
      return {
        has_data: false,
        detail_id: this.$route.params.id,
        article: {},
        footprint: {},
        mescroll: null, // mescroll实例对象
        mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          auto: true,
          callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
          //以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 5 //每页数据条数,默认10
          },
          htmlNodata: '<p class="upwarp-nodata">亲,没有更多数据了~</p>',
          noMoreSize: 5, //如果列表已无数据,可设置列表总数大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
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
      }
    },
    activated () {
      this.has_data = false
      this.detail_id = this.$route.params.id
      this.update()
    },
    methods: {
      //mescroll组件初始化的回调,可获取到mescroll对象 (如果this.mescroll并没有使用到,可不用写mescrollInit)
      mescrollInit(mescroll) {
        this.mescroll = mescroll
      },
      // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
      upCallback(page, mescroll) {
        let _this = this
        // 联网请求
        getVisitorDetail(this.detail_id, {page: page.num}).then((response) => {
          _this.has_data = true
          let articleResponse = response.article
          if(articleResponse.product_id) {
            articleResponse.cover = articleResponse.cover.replace('//img.lvye100.com', 'http://img.lvye100.com')
          }
          _this.article = articleResponse
          // 请求的列表数据
          let visitor_details = response.footprint.data
          // 如果是第一页需手动制空列表
          if (page.num === 1) _this.dataList = []
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(visitor_details)
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(visitor_details.length)
          })
        }).catch((e) => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr()
          Toast({message: '成为会员即可查看', duration: 1000})
          setTimeout(function () {_this.$router.push('/open_member')}, 1000)
        })
      },
      update () {
        this.mescroll.resetUpScroll();
      }
    },
    beforeRouteEnter(to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteLeave(to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next()
    },
  }
</script>

<style scoped>
  .mescroll {
    position: fixed;
    top: 15.5rem;
    bottom: 0;
    height: auto;
  }
</style>
