import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import ArticleDetail from './views/ArticleDetail.vue'
import UserCenter from './views/User.vue'
import MyArticle from './views/MyArticle.vue'
import OpenMember from './views/OpenMember.vue'
import Invitation from './views/Invitation.vue'
import Profit from './views/Profit.vue'
import Poster from './views/Poster.vue'
import Visitor from './views/Visitor.vue'
import Message from './views/Message.vue'
import Footprint from './views/Footprint.vue'
import Punch from './views/Punch.vue'
import Morning from './views/Morning.vue'
import Alipay from './views/Alipay.vue'
import System from './views/System.vue'
import store from './store'
import {getCookie} from "./cookie"
import {getWechatConfig} from './api.js'
import wx from 'weixin-js-sdk'
import { Indicator } from "mint-ui";

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {    //回到顶部
    return {x: 0, y: 0}
  },
  routes: [
    {   //登录
      path: '/',
      name: 'login',
      component: Login,
      meta: {
        requireAuth: false,
        wechat_jssdk: false
      }
    }, {    //首页
      path: '/index',
      name: 'index',
      component: Home,
      meta: {
        title: '事业分享',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //文章搜索
      path: '/article_search',
      name: 'article_search',
      component: () => import('./components/index/ArticleSearch.vue'),
      meta: {
        title: '文章搜索',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //文章详情
      path: '/article_detail/:id/:type',
      name: 'article_detail',
      component: ArticleDetail,
      meta: {
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //普通咨询
      path: '/consultation/normal/:user_id',
      name: 'normal',
      component: () => import('./components/consultation/Normal.vue'),
      meta: {
        title: '咨询',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //会员咨询
      path: '/consultation/vip_chart/:user_id',
      name: 'vipChart',
      component: () => import('./components/consultation/Vip.vue'),
      meta: {
        title: '家庭咨询',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //报告详情
      path: '/consultation/report/:id',
      name: 'report',
      component: () => import('./components/consultation/Report.vue'),
      meta: {
        title: '咨询报告',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //个人中心
      path: '/user',
      name: 'user',
      component: UserCenter,
      meta: {
        title: '个人中心',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //用户文章列表
      path: '/articles/:user_id',
      name: 'articles',
      component: MyArticle,
      meta: {
        title: '我的文章',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //会员价格列表
      path: '/open_member',
      name: 'open_member',
      component: OpenMember,
      meta: {
        title: '开通会员',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //支付宝支付提示页面
      path: '/alipay/:order_id',
      name: 'alipay',
      component: Alipay,
      meta: {
        title: '支付宝支付',
        requireAuth: false,
        wechat_jssdk: true
      }
    }, {    //用户信息展示
      path: '/user/basic',
      name: 'basic',
      component: () => import('./components/user/UserBasic.vue'),
      meta: {
        title: '个人资料',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //推广页面
      path: '/invitation',
      name: 'invitation',
      component: Invitation,
      meta: {
        title: '推广',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //推广中心
      path: '/profit',
      name: 'profit',
      component: Profit,
      meta: {
        title: '收益中心',
        requireAuth: true,
        wechat_jssdk: true
      }
    },
    {    //系统设置
      path: '/system',
      name: 'system',
      component: System,
      meta: {
        title: '系统设置',
        requireAuth: true,
        wechat_jssdk: true
      }
    },{    //推广详情
      path: '/profit/detail',
      name: 'profit_detail',
      component: () => import('./components/profit/ProfitDetail.vue'),
      meta: {
        title: '收益详情',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //提现记录
      path: '/profit/cash/list',
      name: 'profit_cash_list',
      component: () => import('./components/profit/WithdrawCashList.vue'),
      meta: {
        title: '提现记录',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //提现页面
      path: '/profit/withdraw_cash',
      name: 'profit_withdraw_cash',
      component: () => import('./components/profit/WithdrawCash.vue'),
      meta: {
        title: '提现',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //绑定账户
      path: '/profit/bind_account',
      name: 'profit_bind_account',
      component: () => import('./components/profit/BindAccount.vue'),
      meta: {
        title: '绑定账户',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {     //推广的用户列表
      path: '/profit/extension/users',
      name: 'profit_extension_users',
      component: () => import('./components/profit/ExtensionUsers.vue'),
      meta: {
        title: '推广用户',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {     //推广成功的订单列表
      path: '/profit/extension/orders',
      name: 'profit_extension_orders',
      component: () => import('./components/profit/ExtensionOrders.vue'),
      meta: {
        title: '推广列表',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //海报列表
      path: '/poster',
      name: 'poster',
      component: Poster,
      meta: {
        title: '海报',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //海报详情
      path: '/poster/detail/:id',
      name: 'poster_detail',
      component: () => import('./components/poster/PosterDetail.vue'),
      meta: {
        title: '海报',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //访客页面
      path: '/visitor',
      name: 'visitor',
      component: Visitor,
      meta: {
        title: '访客记录',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //访客详情
      path: '/visitor/detail/:id',
      name: 'visitor_detail',
      component: () => import('./components/visitor/VisitorDetail.vue'),
      meta: {
        title: '访客详情',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //访客还看了其他文章
      path: '/visitor/read/:user_id',
      name: 'visitor_read',
      component: () => import('./components/visitor/VisitorRead.vue'),
      meta: {
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //准客户列表
      path: '/visitor/prospect',
      name: 'visitor_prospect',
      component: () => import('./components/visitor/Prospect.vue'),
      meta: {
        title: '准客户',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //留言列表
      path: '/message',
      name: 'message',
      component: Message,
      meta: {
        title: '留言',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //留言详情
      path: '/message/:id/normal',
      name: 'message_detail_normal',
      component: () => import('./components/message/NormalDetail.vue'),
      meta: {
        title: '留言详情',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //家庭留言详情
      path: '/message/:id/family',
      name: 'message_detail_family',
      component: () => import('./components/message/FamilyDetail.vue'),
      meta: {
        title: '留言详情',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //访客查看的足迹
      path: '/footprint',
      name: 'footprint',
      component: Footprint,
      meta: {
        title: '谁查看我的头条',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //找到访客
      path: '/footprint/:user_id',
      name: 'footprint_find',
      component: () => import('./components/visitor/Connection.vue'),
      meta: {
        title: '找到访客',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //每日打卡
      path: '/punch',
      name: 'punch',
      component: Punch,
      meta: {
        title: '打卡',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //早安图
      path: '/morning',
      name: 'morning',
      component: Morning,
      meta: {
        title: '早安图',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //二维码帮助
      path: '/qrcode/help',
      name: 'qrcode_help',
      component: () => import('./components/user/QrcodeHelp.vue'),
      meta: {
        title: '如何获取二维码',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //好文章推荐
      path: '/article/extension',
      name: 'article_extension',
      component: () => import('./components/index/ArticleExtension.vue'),
      meta: {
        title: '推荐文章p',
        requireAuth: true,
        wechat_jssdk: true
      }
    }, {    //这个路由匹配到404友好页面（暂无页面）
      path: '*',
      component: () => import('./components/visitor/Connection.vue'),
    }
  ]
})

if (localStorage.user) {
  let user = JSON.parse(localStorage.user)
  store.commit('setTokenAndUser', user)
}

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (getCookie('token')) {  // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})

router.afterEach((to, from) => {
  Indicator.close();
  if (to.meta.wechat_jssdk) {
    // 非ios设备，切换路由时候进行重新签名
    if (window.__wxjs_is_wkwebview !== true) {
      let url = encodeURIComponent(window.location.origin + to.fullPath)
      config(url)
    }
    // ios 设备进入页面则进行js-sdk签名
    if (window.__wxjs_is_wkwebview === true) {
      let url = encodeURIComponent(window.location.href.split('#')[0])
      config(url)
      if (to.path !== global.location.pathname) {
        location.assign(to.fullPath)
      }
    }
  }
})

function config(url) {
  getWechatConfig({url: url}).then(function (res) {
    let config = res.config,
        user = res.user
    let new_user = JSON.parse(localStorage.user);
    new_user.member_lock_at = user.member_lock_at;
    new_user.is_member = user.is_member;
    localStorage.user = JSON.stringify(new_user);
    store.commit("setTokenAndUser", JSON.parse(localStorage.user));
    wx.config({
      debug: false, // 开启调试模式,
      appId: config.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
      timestamp: config.timestamp, // 必填，生成签名的时间戳
      nonceStr: config.nonceStr, // 必填，生成签名的随机串
      signature: config.signature,// 必填，签名，见附录1
      jsApiList: ['chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
  })
}

export default router


