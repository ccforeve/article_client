<template>
    <div id="reglist" class="flexv mainbox wrap box">
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <ul class="flexv reg-container" id="listbox">
                <li class="between" v-for="(item, index) of dataList" :key="index">
                    <img class="flex u-avatar" :src="item.avatar">
                    <div class="flexitemv reg-info">
                        <div class="flex centerv reg-title">您邀请的: <strong>{{item.nickname}}</strong> 推广成功</div>
                        <div class="flex centerv reg-date">{{item.created_at}}</div>
                    </div>
                </li>
            </ul>
        </mescroll-vue>
    </div>
</template>

<script>
    import MescrollVue from 'mescroll.js/mescroll.vue'
    import { extensionUsers } from '../../api.js'

    export default {
        name: "ExtensionUsers",
        components: {
            MescrollVue
        },
        data () {
            return {
                mescroll: null, // mescroll实例对象
                mescrollDown:{}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
                mescrollUp: { // 上拉加载的配置.
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

        },
        methods: {
            //mescroll组件初始化的回调,可获取到mescroll对象 (如果this.mescroll并没有使用到,可不用写mescrollInit)
            mescrollInit (mescroll) {
                this.mescroll = mescroll
            },
            // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
            upCallback (page, mescroll) {
                // 联网请求
                let data = extensionUsers({page: page.num})
                data.then((response) => {
                    // 请求的列表数据
                    let arr = response.data
                    // 如果是第一页需手动制空列表
                    if (page.num === 1) this.dataList = []
                    // 把请求到的数据添加到列表
                    this.dataList = this.dataList.concat(arr)
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
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
        }
    }
</script>
