<template>
    <div id="record" class="flexv wrap">
      <div class="loading" v-if="!has_data">
        <div class="loading-icon">
          <fulfilling-bouncing-circle-spinner
                  :animation-duration="4000"
                  :size="60"
                  color="#ff1d5e"
          />
        </div>
      </div>

      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <div class="flexitemv mainbox">
              <div class="date listbox" id="listbox">
                  <div class="between nape" v-for="(item, index) of dataList" :key="index">
                      <div class="flexv info">
                          <h2 class="flex centerv">推广提现({{item.type === 1 ? '微信' : '支付宝'}})</h2>
                          <p class="flex centerv time">{{item.created_at}}</p>
                      </div>
                      <div class="flexv end right">
                          <h2>&yen;{{item.price}}</h2>
                          <p class="flex center" :class="{'state': item.state === 1}">
                            {{item.state_cn}}
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </mescroll-vue>
    </div>
</template>

<script>
    import MescrollVue from 'mescroll.js/mescroll.vue'
    import {getWithdrawCashList} from '../../api.js'
    import { FulfillingBouncingCircleSpinner } from 'epic-spinners'

    export default {
        name: "WithdrawCash",
        components: {
          MescrollVue,
          FulfillingBouncingCircleSpinner
        },
        data () {
          return {
            has_data: false,
            cashes: {},
            mescroll: null, // mescroll实例对象
            mescrollDown:{}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: { // 上拉加载的配置.
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
                    tip: "暂无相关数据~" //提示
                }
              },
              dataList: [] // 列表数据
          }
        },
        methods: {
            //mescroll组件初始化的回调,可获取到mescroll对象 (如果this.mescroll并没有使用到,可不用写mescrollInit)
            mescrollInit (mescroll) {
                this.mescroll = mescroll
            },
            // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
            upCallback (page, mescroll) {
              let _this = this
              let data = getWithdrawCashList({page: page.num})
              data.then((response) => {
                _this.has_data = true
                // 请求的列表数据
                let arr = response.data
                // 如果是第一页需手动制空列表
                if (page.num === 1) _this.dataList = []
                // 把请求到的数据添加到列表
                _this.dataList = _this.dataList.concat(arr)
                // 数据渲染成功后,隐藏下拉刷新的状态
                _this.$nextTick(() => {
                  mescroll.endSuccess(arr.length)
                })
              }).catch((e) => {
                  // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                mescroll.endErr()
              })
            }
        },
        beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
          next(vm => {
            // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
            vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
          })
        },
        beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
            // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
            this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
            next()
        },
    }
</script>
