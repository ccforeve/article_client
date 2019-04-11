<template>
  <div
    class="flexitemv scroll"
    style="position: relative;"
  >
    <div class="banner">
      <img
        src="../assets/image/punch.jpg"
        alt=""
        width="100%"
      >
    </div>
    <div class="partners-num">已有{{punch_user_count}}人参与</div>
    <div class="flexv state">
      <ul class="partners">
        <li
          class="img partners__item lazy"
          :style="'background-image: url(' + item.avatar + ')'"
          v-for="(item, index) of punch_users"
          :key="index"
        ></li>
        <li class="img flex center partners__item partners__item--dot"><i class="iconfont icon-dian"></i></li>
      </ul>

      <div
        class="flex center count-down"
        data-start="00:00:00"
        data-end="23:00:00"
        v-show="state === 2 || state === 3"
      >
        <p class="countdown__text">{{count_down_text}}</p>
        <p class="countdown__time">
          <span class="hour">00</span>:<span class="min">00</span>:<span class="sec">00</span>
        </p>
      </div>

      <a
        href="javascript:"
        class="punch-btn punch-btn--sub"
        type="button"
        v-if="state === 0"
        @click="subscribe = false"
      >
        关注公众号，参与打卡
      </a>
      <router-link
        to="/morning"
        class="punch-btn punch-btn--go"
        v-else-if="state === 1"
      >
        免费领取事业宣传海报
      </router-link>
      <a
        href="javascript:"
        class="punch-btn punch-btn--default"
        v-else-if="state === 2"
        @click="punch"
      >
        马上打卡
      </a>
      <a
        href="javascript:"
        class="punch-btn punch-btn--disabled"
        type="button"
        data-src=""
        v-else-if="state === 3"
      >
        打卡还未开始
      </a>
      <a
        href="javascript:"
        class="punch-btn punch-btn--miss"
        type="button"
        v-else-if="state === 4"
      >
        错过打卡啦，明日加油早起吧
      </a>
      <div
        class="f12 punch-intro"
        style="text-align: center;"
      >
        明日打卡时间：<span class="punch-intro__time f20">05:30:00</span><br>打卡完成后，可获专属爆图。
      </div>
    </div>

    <div class="rank-box">
      <div class="flex rank-box-tab">
        <a
          href="javascript:"
          class="flexitemv center rank-box-tab__item"
          :class="{'rank-box-tab__item--active': rank.active === 1}"
          @click="selectActive(1)"
        >
          <i class="rank-box-tab__icon iconfont icon-crown"></i> 地区排行榜 <span class="rank-box-tab__underline"></span>
        </a> <span class="rank-box-tab__divideline"></span>
        <a
          href="javascript:"
          class="flexitemv center rank-box-tab__item"
          :class="{'rank-box-tab__item--active': rank.active === 2}"
          @click="selectActive(2)"
        >
          <i class="rank-box-tab__icon iconfont icon-crown"></i> 我的排名 <span class="rank-box-tab__underline"></span>
        </a>
      </div>
      <ul
        class="area-rank js-rank"
        v-show="rank.active_province"
      >
        <li class="flexv center rank-empty">
          <div
            class="show-punch-list"
            v-show="rank.get_province_data"
            @click="getProvincePunchUsers"
          >点击查看更多排名</div>
        </li>
        <li
          class="flex centerv area-rank__item"
          v-if="rank.province.length > 0"
        >
          <i class="flex center area-rank__icon iconfont icon-cup"></i>
          <div
            class="img area-rank__img lazy"
            :style="'background-image: url(' + rank.province[0].user.avatar +')'"
          ></div>
          <div class="area-rank__name">
            <p>{{rank.province[0].user.nickname}}</p>
          </div>
          <div class="flexitemv area-rank__area">全国第一名</div>
          <div class="flex center area-rank__time">{{moment(rank.province[0].created_at).format('h:mm:ss')}}</div>
        </li>
        <li
          class="flex centerv area-rank__item"
          v-show="rank.province.length"
          v-for="(item, index) of rank.province"
          :key="index"
        >
          <i class="flex center area-rank__icon iconfont icon-badge"></i>
          <div
            class="img area-rank__img lazy"
            :style="'background-image: url(' + item.user.avatar +')'"
          ></div>
          <div class="area-rank__name">
            <p>{{item.user.nickname}}</p>
          </div>
          <div class="flexitemv area-rank__area">{{item.province}}第一名</div>
          <div class="flex center area-rank__time">{{moment(item.created_at).format('h:mm:ss')}}</div>
        </li>
      </ul>
      <div
        class="total-rank-box js-rank"
        v-show="rank.active_all"
      >
        <div class="flexv center rank-empty">
          <div
            class="show-punch-list"
            v-show="rank.get_all_data"
            @click="getAllPunchUsers"
          >点击查看更多排名</div>
        </div>
        <table class="total-rank">
          <tbody>
            <tr
              class="total-rank__tr"
              v-if="rank.current_user"
            >
              <td class="total-rank__th-rank total-rank__num">
                <p>{{rank.current_user.rank}}</p>
              </td>
              <td class="total-rank__th-user">
                <div class="flex centerv total-rank__content">
                  <div
                    class="img total-rank__img lazy"
                    :style="'background-image: url('+ rank.current_user.user.avatar +');'"
                  ></div>
                  <div class="flexitemv total-rank__user">
                    <p class="total-rank__name">我</p>
                    <p class="total-rank__text">{{rank.current_user.comment.content}}</p>
                  </div>
                </div>
              </td>
              <td class="total-rank__th-time">{{moment(rank.current_user.created_at).format('h:mm:ss')}}</td>
            </tr>
            <tr
              class="total-rank__tr"
              v-for="(item, index) of rank.all"
              :key="index"
            >
              <td
                class="total-rank__num"
                v-if="index + 1 === 1"
              >
                <p class="total-rank__first">{{index + 1}}</p>
              </td>
              <td
                class="total-rank__num"
                v-else-if="index + 1 === 2"
              >
                <p class="total-rank__second">{{index + 1}}</p>
              </td>
              <td
                class="total-rank__num"
                v-else-if="index + 1 === 3"
              >
                <p class="total-rank__third">{{index + 1}}</p>
              </td>
              <td
                class="total-rank__num"
                v-else
              >{{index + 1}}</td>
              <td class="total-rank__info">
                <div class="flex centerv total-rank__content">
                  <div
                    class="img total-rank__img lazy"
                    :style="'background-image: url('+ item.user.avatar +');'"
                  ></div>
                  <div class="flexitemv total-rank__user">
                    <p class="total-rank__name">{{item.user.nickname}}</p>
                    <p class="total-rank__text">{{item.comment.content}}</p>
                  </div>
                </div>
              </td>
              <td class="total-rank__time">{{moment(item.created_at).format('h:mm:ss')}}</td>
            </tr>
          </tbody>
        </table>
        <button
          class="load-more"
          type="button"
          style="color: rgb(204, 204, 204);"
          v-if="rank.all.length > 0"
        >只显示全国前100名</button>
      </div>
    </div>

    <!----------打卡成功提示---------->
    <div
      class="layer layer-success"
      v-show="punch_alert"
    >
      <div class="layer__content layer-success__content">
        <img
          src="https://image.yetingjk.com/images/punch/success.png"
          width="100%"
        >
        <span
          class="flex center layer-success__close"
          @click="close_punch"
        >×</span>
      </div>
    </div>

    <!----------关注公众号---------->
    <div
      class="layer layer-subscribe"
      v-show="!subscribe"
    >
      <div class="flexv center layer__content layer-subscribe__content">
        <img
          class="layer-subscribe__code"
          src="../assets/image/qrcode.jpg"
          width="100%"
        >
        <p class="layer-subscribe__tip">长按识别二维码</p>
        <p class="layer-subscribe__tip">每早准时提醒您打卡</p>
        <button
          class="layer-subscribe__close"
          type="button"
          @click="close_subscribe"
        >×</button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  punchIndex,
  punchStore,
  UpdateUserInfo,
  punchProvince,
  punchTopHundred,
  punchCurrentUser
} from "../api.js";
import wx from "weixin-js-sdk";
import { setTimeout } from "timers";
export default {
  name: "Punch",
  data() {
    return {
      punch_user_count: 0, //打卡总人数
      state: 0, //页面打卡状态
      province: "", //用户省份
      punch_alert: false, //打卡弹窗
      punch_users: null, //打卡用户列表
      subscribe: true, //关注
      count_down_text: "距离打卡结束还有",
      intervalDate: null,
      rank: {
        get_province_data: true,
        get_all_data: true,
        active: 1,
        empty_data: false,
        province: {},
        all: {},
        current_user: null,
        active_province: true,
        active_all: false
      }
    };
  },
  activated() {
    this.wechatConfig();
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    //获取打卡页面信息
    this.punchData();
    if (!this.user.province) {
      this.getLocation();
    }
  },
  methods: {
    wechatConfig() {
      //微信jssdk
      wx.ready(function() {
        //需在用户可能点击分享按钮前就先调用
        wx.onMenuShareTimeline({
          title: "每日打卡", // 分享标题
          link: "http://btl.yxcxin.com/punch", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://stl.yxcxin.com/image/qrcode.jpg", // 分享图标
          success: function() {
            // 用户点击了分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
          title: "每日打卡", // 分享标题
          desc: "每日打卡，开启每日精彩", // 分享描述
          link: "http://btl.yxcxin.com/punch", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://stl.yxcxin.com/image/qrcode.jpg" // 分享图标
        });
      });
    },
    punchData() {
      //获取初始页面数据
      let _this = this;
      punchIndex().then(function(res) {
        if (res.punch_state === 2 || res.punch_state === 3) {
          _this.countDown();
        }
        _this.state = res.punch_state;
        _this.punch_user_count = res.punch_total;
        _this.punch_users = res.punch_users;
      });
    },
    punch() {
      //打卡操作
      let _this = this;
      punchStore().then(function(res) {
        _this.state = 1;
        _this.punch_alert = true;
        _this.punch_user_count++;
        if (_this.punch_users.length < 13) {
          _this.punch_users.push(res.user);
        }
        clearInterval(_this.intervalDate);
      });
    },
    close_punch() {
      //关闭打卡成功弹窗
      this.punch_alert = false;
    },
    close_subscribe() {
      //关闭关注公众号弹窗
      this.subscribe = true;
    },
    selectActive(select) {
      //切换排行榜状态
      this.rank.active = select;
      if (select === 2) {
        this.rank.active_all = true;
        this.rank.active_province = false;
        return;
      }
      this.rank.active_all = false;
      this.rank.active_province = true;
    },
    getProvincePunchUsers() {
      //获取省份排行榜
      let _this = this;
      punchProvince().then(function(res) {
        _this.rank.get_province_data = false;
        _this.rank.province = res.data;
      });
    },
    getAllPunchUsers() {
      //获取全国前100打卡排名
      let _this = this;
      punchTopHundred().then(function(res) {
        _this.rank.get_all_data = false;
        _this.rank.all = res.records;
      });
      punchCurrentUser().then(function(res) {
        _this.rank.current_user = res.current_user;
      });
    },
    countDown() {
      //打卡倒计时
      var _this = this;
      // var timestamp = parseInt('{{ time() * 1000 }}');
      var timestamp = new Date();
      timestamp = timestamp.getTime();
      (function($) {
        var defaults = {
          startTimeStr: "2017/08/03 00:00:00",
          endTimeStr: "2019/09/17 23:59:59",
          daySelector: ".day",
          hourSelector: ".hour",
          minSelector: ".min",
          secSelector: ".sec"
        };
        var day, hour, min, sec;

        $.fn.extend({
          countDown: function(options) {
            //生成倒计时字符串
            var opts = $.extend({}, defaults, options);
            this.each(function() {
              var $this = $(this);
              var startTime = new Date(opts.startTimeStr).getTime(); //开始时间
              var endTime = new Date(opts.endTimeStr).getTime(); //结束时间
              endTime = endTime > startTime ? endTime : startTime;
              startTime = endTime > startTime ? startTime : endTime;

              _this.intervalDate = setInterval(function() {
                timestamp = timestamp + 1000;
                var nowTime = timestamp;
                if (startTime >= nowTime) {
                  _this.count_down_text = "距离打卡开始还有";
                  _this.state = 3;
                  var t = startTime - nowTime;
                  day = Math.floor(t / 1000 / 60 / 60 / 24);
                  hour = Math.floor((t / 1000 / 60 / 60) % 24);
                  min = Math.floor((t / 1000 / 60) % 60);
                  sec = Math.floor((t / 1000) % 60);
                  $(opts.daySelector).html($this.doubleNum(day));
                  $(opts.hourSelector).html($this.doubleNum(hour));
                  $(opts.minSelector).html($this.doubleNum(min));
                  $(opts.secSelector).html($this.doubleNum(sec));
                } else if (endTime > nowTime) {
                  _this.count_down_text = "距离打卡结束还有";
                  _this.state = 2;
                  //显示倒计时
                  var t = endTime - nowTime;
                  day = Math.floor(t / 1000 / 60 / 60 / 24);
                  hour = Math.floor((t / 1000 / 60 / 60) % 24);
                  min = Math.floor((t / 1000 / 60) % 60);
                  sec = Math.floor((t / 1000) % 60);

                  $(opts.daySelector).html($this.doubleNum(day));
                  $(opts.hourSelector).html($this.doubleNum(hour));
                  $(opts.minSelector).html($this.doubleNum(min));
                  $(opts.secSelector).html($this.doubleNum(sec));
                } else {
                  this.state = 4;
                  clearInterval(intervalDate);
                }
              }, 1000);
            });
          },
          doubleNum: function(num) {
            //将个位数字变成两位
            if (num < 10) {
              return "0" + num;
            } else {
              return num + "";
            }
          },
          beforeAction: function(options) {},
          afterAction: function(options) {
            $(options.daySelector)
              .parents(".count-down")
              .hide();
          }
        });
      })(jQuery);

      var $countDown = $(".count-down");
      var $start = $countDown.data("start");
      var $end = $countDown.data("end");
      var now = this.moment(timestamp);
      var year = now.year();
      var month = now.month() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var day = now.date();
      if (day < 10) {
        day = "0" + day;
      }
      $countDown.countDown({
        startTimeStr: year + "/" + month + "/" + day + " " + $start, //开始时间
        endTimeStr: year + "/" + month + "/" + day + " " + $end, //结束时间
        daySelector: ".day",
        hourSelector: ".hour",
        minSelector: ".min",
        secSelector: ".sec"
      });
    },
    getLocation() {
      //更新用户省份
      let _this = this;
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            debugger;
            UpdateUserInfo({ province: r.address.province }).then(res => {
              debugger;
              let new_user = JSON.parse(localStorage.user);
              new_user.province = r.address.province;
              localStorage.user = JSON.stringify(new_user);
              _this.$store.commit(
                "setTokenAndUser",
                JSON.parse(localStorage.user)
              );
            });
          }
        },
        { enableHighAccuracy: true }
      );
    }
  }
};
</script>

<style scoped>
a,
.show-punch-list,
.js-rank {
  font-size: 16px;
}
.show-punch-list {
  padding-top: 3vh;
}
.total-rank {
  background: #fff;
}
</style>
