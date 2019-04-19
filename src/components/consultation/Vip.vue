<template>
  <div>
    <div class="container">
      <!--问题一-->
      <div class="p1 hide clear" name="p1" rel="button" style="display:block;">
        <dl class="clear" style="padding-top:15px;">
          <dt>
            <div class="avatar"><img :src="consultation_user.avatar"></div>
          </dt>
          <dd>
            <div class="content">
              <div class="text">您好，我是{{consultation_user.nickname}}，请问您想了解什么呢？</div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
        <dl class="right clear">
          <dt>
            <div class="avatar"><img :src="user.avatar"></div>
          </dt>
          <dd>
            <div class="content button">
              <div class="text">
                <button rel="咨询健康问题">咨询健康问题</button>
                <button rel="了解加盟事业">了解加盟事业</button>
                <button rel="其他">其他</button>
              </div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
      </div>
      <!--问题二-->
      <div class="p4 hide clear" name="p7" rel="textarea">
        <dl class="clear">
          <dt>
            <div class="avatar"><img :src="consultation_user.avatar"></div>
          </dt>
          <dd>
            <div class="content">
              <div class="text">请输入你要咨询什么内容</div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
        <dl class="right clear">
          <dt>
            <div class="avatar"><img :src="user.avatar"></div>
          </dt>
          <dd>
            <div class="content button">
              <div class="text">
                <textarea title="咨询内容" maxlength="40" id="message">咨询内容</textarea>
                <button>确定</button>
              </div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
      </div>
      <!--问题三-->
      <div class="p2 hide clear" name="p2" rel="input">
        <dl class="clear">
          <dt>
            <div class="avatar"><img :src="consultation_user.avatar"></div>
          </dt>
          <dd>
            <div class="content">
              <div class="text">您在那个地区工作？</div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
        <dl class="right clear">
          <dt>
            <div class="avatar"><img :src="user.avatar"></div>
          </dt>
          <dd>
            <div class="content button">
              <div class="text">
                <input
                  class="site site_get"
                  style="width:auto;"
                  type="text"
                  readonly="readonly"
                  rel="地理位置"
                  title="点击获取地理位置"
                  placeholder="点击获取地理位置"
                  unselectable="on"
                  onfocus="this.blur()"
                >
                <button>下一步</button>
              </div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
      </div>
      <!--问题四-->
      <div class="p3 hide clear" name="p3" rel="textarea">
        <dl class="clear">
          <dt>
            <div class="avatar"><img :src="consultation_user.avatar"></div>
          </dt>
          <dd>
            <div class="content">
              <div class="text">怎么称呼您？</div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
        <dl class="right clear">
          <dt>
            <div class="avatar"><img :src="user.avatar"></div>
          </dt>
          <dd>
            <div class="content button">
              <div class="text">
                <textarea rel="您的姓名" title="请填写您的姓名">请填写您的姓名</textarea>
                <button class="js_sex_button" rel="1">先生</button>
                <button class="js_sex_button" rel="2">女士</button>
              </div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
      </div>
      <!--问题五-->
      <div class="p4 hide clear" name="p4" rel="textarea">
        <dl class="clear">
          <dt>
            <div class="avatar"><img :src="consultation_user.avatar"></div>
          </dt>
          <dd>
            <div class="content">
              <div class="text">怎么联系到您？</div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
        <dl class="right clear">
          <dt>
            <div class="avatar"><img :src="user.avatar"></div>
          </dt>
          <dd>
            <div class="content button">
              <div class="text">
                <textarea rel="您的手机号码" title="请填写您的手机号码" maxlength="11" id="mobile">请填写您的手机号码</textarea>
                <button id="mobile_submit">确定</button>
              </div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
      </div>
      <!--问题六-->
      <div class="p6 hide clear" name="p5" rel="input">
        <dl class="clear">
          <dt>
            <div class="avatar"><img :src="consultation_user.avatar"></div>
          </dt>
          <dd>
            <div class="content">
              <div class="text">您现在的年龄是？</div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
        <dl class="right clear">
          <dt>
            <div class="avatar"><img :src="user.avatar"></div>
          </dt>
          <dd>
            <div class="content button">
              <div class="text">
                <input
                  class="site"
                  type="text"
                  readonly="readonly"
                  rel="您的出生日期"
                  @click="open('picker')"
                  v-model="inputDate"
                  placeholder="请选择出生日期"
                >
                <button>下一步</button>
              </div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
      </div>
      <!--结束-->
      <div class="p6 hide clear" name="p6" rel="end">
        <dl class="clear">
          <dt>
            <div class="avatar"><img :src="consultation_user.avatar"></div>
          </dt>
          <dd>
            <div class="content">
              <div class="text">收到，<img src="../../assets/image/smile.png" align="absmiddle" width="24">感谢您参与测评，正在计算请稍等...</div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
        <dl class="right clear">
          <dt>
            <div class="avatar"><img :src="user.avatar"></div>
          </dt>
          <dd>
            <div class="content button">
              <div class="text">
                 <button id="mobile_end">查看报告</button>
                <!--<router-link id="mobile_end" :to="'/consultation/report/:id'">查看报告</router-link>-->
              </div>
              <div class="arrow"></div>
            </div>
          </dd>
        </dl>
      </div>
      <form method="post" id="f1">
        <input type="hidden" name="type" id="p1" value="">
        <input type="hidden" name="region" id="p2" value="">
        <input type="hidden" name="name" id="p3" value="">
        <input type="hidden" name="phone" id="p4" value="">
        <input type="hidden" name="age" id="p5" value="">
        <input type="hidden" name="gender" id="p6" value="">
        <input type="hidden" name="message" id="p7" value="">
        <input type="hidden" name="user_id" :value="consultation_user_id">
      </form>
      <div id="fill" style="clear: both; float: left; visibility: hidden;"></div>
      <!--弹框提示-->
      <div id="hint"></div>
    </div>
    <mt-datetime-picker
      class="picker_show"
      ref="picker"
      type="date"
      v-model="value"
      @confirm="handleConfirm"
      :startDate="startDate"
      :endDate="endDate"
    ></mt-datetime-picker>
  </div>
</template>

<script>
import { formatDate } from "../../cookie.js";
import { getUserInfo, submitNormalMessage } from '../../api.js'
import { Toast, Indicator } from 'mint-ui'
export default {
  components: {},
  filters: {
    //时间转换
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    }
  },
  data() {
    return {
      consultation_user: {},
      consultation_user_id: this.$route.params.user_id,
      value: new Date("2000-01-22"), //定义显示时间
      visible: false,
      inputDate: "",
      startDate: new Date("1990-01-22"), //设置开始时间
      endDate: new Date("2019-01-22"), //设置结束时间
      isShow: true
    };
  },
  watch: {
    '$route' (to, from) {
      this.consultation_user_id = to.params.user_id
    }
  },
  activated () {
      let _this = this
      let user_info = getUserInfo({user_id: this.consultation_user_id})
      user_info.then(function (res) {
          _this.consultation_user = res
      })
  },
  mounted() {
      this.init();
  },
  computed: {
    user () {
        return this.$store.state.user
    }
  },
  methods: {
      handleConfirm() {
        this.inputDate = this.formatDate(this.$refs.picker.value)
      },
    formatDate(date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    open(picker) {
      this.$refs[picker].open(); //设置开始
    },
    init() {
      let _this = this
      // 地址选择
      var swith = true;
      $(".site_get").click(function() {
        if (swith) {
          $(this)
            .val(returnCitySN.cname)
            .attr("id", "sel_city");
        }
        swith = false;
      });

      $("button").on("click", function() {
        var $this = $(this),
          $self = $this.closest("dl").closest("div"),
          $next = $self.next(),
          $value = "",
          $H = $(window).height();
        switch ($self.attr("rel")) {
          case "button":
            $value = $this.attr("rel") ? $this.attr("rel") : $this.text();
            break;
          case "textarea":
            var $textarea = $self.find("textarea"),
              $title = $textarea.attr("title");
            $value = $textarea.val();
            if ($value == $title || $value == "") {
              $("#hint").text("请正确填写" + $textarea.attr("rel") + "！");
              $("#hint")
                .fadeIn()
                .stop(true, true)
                .fadeOut(1500);
              $textarea.focus();
              return false;
            }
            if ($textarea.attr("id") === "mobile") {
              var reg = /^[1][3-8][0-9]{9}$/; //只允许使用数字-空格等
              if (!reg.test($value)) {
                $("#hint").text("请正确填写" + $textarea.attr("rel") + "！");
                $("#hint")
                  .fadeIn()
                  .stop(true, true)
                  .fadeOut(1500);
                $textarea.focus();
                return false;
              }
            }
            break;
          case "input":
            const $input = $self.find("input"),
              $tit = $input.attr("title");
            $value = $input.val();
            if ($tit == $value || $value == "") {
              $("#hint").text("请正确填写" + $input.attr("rel") + "！");
              $("#hint")
                .fadeIn()
                .stop(true, true)
                .fadeOut(1500);
              return false;
            }
            break;
        }
        $this
          .parent()
          .find("button")
          .removeClass("active");
        $this.addClass("active");

        if ($self.next("div").length > 0) {
          $self.next().show();
          //  性别
          if ($(this).hasClass("js_sex_button")) {
            $("input[id=p6]").val($(this).attr("rel"));
          }
          // 通过div name匹配input ID 名
          $("input#" + $self.attr("name")).val($value);

          var height = 0;
          if ($H - $next.height() < 0) {
            $("#fill").height(0);
          } else {
            $("#fill").height($H - $next.height());
          }
          var top = $self
            .next()
            .find(".clear")
            .offset().top;
          var top = Math.ceil(top);
          $("html,body").animate({ scrollTop: top }, 500);
        }
      });

      /*输入框获得焦点事件*/
      $("textarea").on("focus", function() {
        var $title = $(this).attr("title"),
          $value = $(this).val();
        if ($title == $value) {
          $(this)
            .val("")
            .css("color", "#000");
        }
      });
      /* 输入框失去焦点事件*/
      $("textarea").on("blur", function() {
        var $title = $(this).attr("title"),
          $value = $(this).val();
        if ($value == "") {
          $(this)
            .val($title)
            .css("color", "#aaa");
        }
      });

      //模拟后台数据
      var arr = {};
      $("#mobile_end").click(function() {
        $("form").serializeArray().forEach(function (data) {
            arr[data.name] = data.value
        })
        // 这里写提交数据接口
          Indicator.open()
          let submit = submitNormalMessage('family', arr)
          submit.then(function (res) {
              if(res.code === 0) {
                  Indicator.close()
                  Toast({message: '咨询完成', duration: 1500})
                  setTimeout(function () {
                      _this.$router.push('/consultation/report/' + res.data.id)
                  }, 1500)
              }
          }).catch(function (e) {

          })
      });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  background: #e5e5e5;
}
input::-webkit-input-placeholder {
  color: #333;
}
.flex {
  display: -webkit-box;
}
.flexv {
  display: -webkit-box;
  -webkit-box-orient: vertical;
} /*垂直排列*/
.centerv {
  -webkit-box-align: center;
} /*垂直居中*/
.centerh {
  -webkit-box-pack: center;
} /*水平居中*/
.center {
  -webkit-box-align: center;
  -webkit-box-pack: center;
}
.container {
  min-height: 100%;
  background-color: #f2f2f2;
}
.container .clear {
  padding-top: 8px;
}
.clear:after {
  display: block;
  content: "";
  clear: both;
  visibility: hidden;
  height: 0;
}
.container dl {
  float: left;
  position: relative;
  clear: both;
  display: block;
  padding: 0 40px 0 15px;
  margin: 0 0 15px 0;
}
.container dl dt {
  display: inline-block;
  float: left;
}
.container dl dt div.avatar {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  overflow: hidden;
}
.container dl dt div.avatar img {
  width: 100%;
}
.container dl dd .content {
  position: relative;
}
.container dl dd {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #d5d5d5;
  margin-left: 54px;
  background: #fff;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 5px;
}
.container dl dd .content div {
  line-height: 16px;
}
.container dl dd .content div button,
.site {
  display: block;
  clear: both;
  text-align: center;
  border: 1px solid #639838;
  border-radius: 5px;
  padding: 8px 12px;
  background: #fff;
  outline: none;
  margin: 8px 0 0 0;
  width: 100%;
  font-size: 13px;
}
.container dl dd .content div button.active {
  color: #ccc;
  border-color: #fff;
}
.container dl dd div.button {
  padding-bottom: 5px;
}
.container dl dd .content div textarea {
  border: 1px solid #ccc;
  border-radius: 2px;
  color: #aaa;
  padding: 10px;
  outline: none;
  margin: 6px 0 0 0;
  background-color: #fff;
  resize: none;
}
.container dl dd .content .arrow {
  position: absolute;
  left: -15px;
  top: 2px;
  width: 8px;
  height: 8px;
  background: #fff;
  transform: rotate(45deg);
  border-left: 1px solid #d5d5d5;
  border-bottom: 1px solid #d5d5d5;
}
.container dl.right {
  float: right;
  padding: 0 15px 0 40px;
}
.container dl.right dt {
  position: absolute;
  right: 15px;
}
.container dl.right dd {
  border: 1px solid #79b746;
  margin: 0 54px 0 0;
  background: #c0e278;
  padding-top: 4px;
}
.container dl.right dd .content .arrow {
  border-left: 0;
  border-bottom: 0;
  border-right: 1px solid #79b746;
  border-top: 1px solid #79b746;
  left: auto;
  right: -15px;
  background: #c0e278;
}
.hide {
  display: none;
}
#hint {
  width: fit-content;
  height: 3rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 0 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px;
  text-align: center;
  line-height: 3rem;
  color: #fff;
  display: none;
}
.picker {
  display: none;
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  font-family: PingFang SC, STHeitiSC-Light, Helvetica-Light, arial, sans-serif;
  font-size: 14px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.picker .picker-mask {
  position: absolute;
  z-index: 500;
  width: 100%;
  height: 100%;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  background: transparent;
  opacity: 0;
}
.picker .picker-mask.show {
  background: rgba(0, 0, 0, 0.6);
  opacity: 1;
}
.picker .picker-panel {
  position: absolute;
  z-index: 600;
  bottom: 0;
  width: 100%;
  height: 246px;
  background: #c2c2c2;
  transform: translateY(243px);
  -webkit-transform: translateY(243px);
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
}
.picker .picker-panel.show {
  transform: translateY(0);
  -webkit-transform: translateY(0);
}
.picker .picker-panel .picker-choose {
  position: relative;
  height: 50px;
  color: #1965fa;
  font-size: 14px;
  background: #fff;
}
.picker .picker-panel .picker-choose .picker-title {
  line-height: 50px;
  font-size: 19px;
  text-align: center;
  color: #333;
}
.picker .picker-panel .picker-choose .cancel,
.picker .picker-panel .picker-choose .confirm {
  position: absolute;
  padding: 10px;
  top: 6px;
}
.picker .picker-panel .picker-choose .confirm {
  right: 0;
}
.picker .picker-panel .picker-choose .cancel {
  left: 0;
}
.picker .picker-panel .picker-content {
  position: relative;
}
.picker .picker-panel .picker-content .mask-bottom,
.picker .picker-panel .picker-content .mask-top {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 80px;
  pointer-events: none;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}
.picker .picker-panel .picker-content .mask-top {
  top: 0;
  background: -webkit-gradient(
    linear,
    left bottom,
    left top,
    from(hsla(0, 0%, 100%, 0.4)),
    to(hsla(0, 0%, 100%, 0.8))
  );
  background: -o-linear-gradient(
    bottom,
    hsla(0, 0%, 100%, 0.4),
    hsla(0, 0%, 100%, 0.8)
  );
}
.picker .picker-panel .picker-content .mask-top:after,
.picker .picker-panel .picker-content .mask-top:before {
  display: block;
  position: absolute;
  border-top: 1px solid #ccc;
  left: 0;
  width: 100%;
  content: " ";
}
.picker .picker-panel .picker-content .mask-top:before {
  display: none;
  top: 0;
}
.picker .picker-panel .picker-content .mask-top:after {
  display: block;
  bottom: 0;
}
.picker .picker-panel .picker-content .mask-bottom {
  bottom: 0;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(hsla(0, 0%, 100%, 0.4)),
    to(hsla(0, 0%, 100%, 0.8))
  );
  background: -o-linear-gradient(
    top,
    hsla(0, 0%, 100%, 0.4),
    hsla(0, 0%, 100%, 0.8)
  );
}
.picker .picker-panel .picker-content .mask-bottom:after,
.picker .picker-panel .picker-content .mask-bottom:before {
  display: block;
  position: absolute;
  border-top: 1px solid #ccc;
  left: 0;
  width: 100%;
  content: " ";
}
.picker .picker-panel .picker-content .mask-bottom:before {
  display: block;
  top: 0;
}
.picker .picker-panel .picker-content .mask-bottom:after {
  display: none;
  bottom: 0;
}
.picker .picker-panel .wheel-wrapper {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  padding: 0 10px;
}
.picker .picker-panel .wheel-wrapper .wheel {
  -ms-flex: 1 1 1e-9px;
  -webkit-box-flex: 1;
  flex: 1;
  flex-basis: 1e-9px;
  width: 1%;
  height: 196px;
  overflow: hidden;
  font-size: 21px;
}
.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll {
  margin-top: 82px;
  line-height: 36px;
}
.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll .wheel-item {
  height: 36px;
  overflow: hidden;
  white-space: nowrap;
  color: #333;
}
.picker .picker-footer {
  height: 20px;
}
@media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
  .border-1px:after,
  .border-1px:before {
    -webkit-transform: scaleY(0.7);
    -webkit-transform-origin: 0 0;
    transform: scaleY(0.7);
  }
  .border-1px:after {
    -webkit-transform-origin: left bottom;
  }
}
@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .border-1px:after,
  .border-1px:before {
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
</style>


