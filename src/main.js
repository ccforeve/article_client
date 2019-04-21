import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/css/base.css"
import "./assets/css/icon.css"
import "./assets/css/font/iconfont.css";
import "./assets/css/index.css"
import "./assets/css/reset.css"
import "./assets/css/punch.css"
import "./assets/css/loading.css"
import 'mint-ui/lib/style.css'
import "./assets/js/jquery.min.js"
import "./assets/js/functions.js"
import "./assets/js/echarts.js"
import "./assets/css/font/iconfont.js"
import packedAxios from "./axios.js"

import moment from "moment";

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.use(Mint)

Vue.config.productionTip = false
Vue.use(packedAxios)
Vue.prototype.moment = moment;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
