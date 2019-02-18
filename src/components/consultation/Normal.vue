<template>
  <div class="container">
    <div class="p1 hide clear" name="p1" rel="button" style="display:block;">
      <dl class="clear" style="padding-top:15px;">
        <dt>
          <div class="avatar"><img :src="consultation_user.avatar"></div>
        </dt>
        <dd>
          <div class="content">
            <p class="text">您好，我是{{consultation_user.nickname}}，请问您想了解什么呢？</p>
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
            <p class="text">
              <button rel="1">咨询健康问题</button>
              <button rel="2">了解加盟事业</button>
              <button rel="3">其他</button>
            </p>
            <div class="arrow"></div>
          </div>
        </dd>
      </dl>
    </div>
    <div class="p2 hide clear" name="p2" rel="button">
      <dl class="clear">
        <dt>
          <div class="avatar"><img :src="consultation_user.avatar"></div>
        </dt>
        <dd>
          <div class="content">
            <p class="text">您是？</p>
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
            <p class="text">
              <button rel="50前后">50前后</button>
              <button rel="60后">60后</button>
              <button rel="70后">70后</button>
              <button rel="80后">80后</button>
              <button rel="90后">90后</button>
            </p>
            <div class="arrow"></div>
          </div>
        </dd>
      </dl>
    </div>
    <div class="p3 hide clear" name="p3" rel="textarea">
      <dl class="clear">
        <dt>
          <div class="avatar"><img :src="consultation_user.avatar"></div>
        </dt>
        <dd>
          <div class="content">
            <p class="text">怎么称呼您？</p>
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
            <p class="text">
              <textarea rel="您的姓名" title="请填写您的姓名">请填写您的姓名</textarea>
              <button class="js_sex_button" rel="1">先生</button>
              <button class="js_sex_button" rel="2">女士</button>
            </p>
            <div class="arrow"></div>
          </div>
        </dd>
      </dl>
    </div>
    <div class="p4 hide clear" name="p4" rel="textarea">
      <dl class="clear">
        <dt>
          <div class="avatar"><img :src="consultation_user.avatar"></div>
        </dt>
        <dd>
          <div class="content">
            <p class="text">怎么联系到您？</p>
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
            <p class="text">
              <textarea rel="您的手机号码" title="请填写您的手机号码" id="mobile">请填写您的手机号码</textarea>
              <button id="mobile_submit">确定</button>
            </p>
            <div class="arrow"></div>
          </div>
        </dd>
      </dl>
    </div>
    <div class="p5 hide clear" name="p5" rel="end">
      <dl class="clear">
        <dt>
          <div class="avatar"><img :src="consultation_user.avatar"></div>
        </dt>
        <dd>
          <div class="content">
            <p class="text">收到，<img src="../../assets/image/smile.png" align="absmiddle" width="24">我会尽快联系您的，请稍等</p>
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
            <p class="text">
              <button id="mobile_end">结束</button>
            </p>
            <div class="arrow"></div>
          </div>
        </dd>
      </dl>
    </div>
    <form method="post" id="f1">
      <input type="hidden" name="type" id="p1" value="">
      <input type="hidden" name="age" id="p2" value="">
      <input type="hidden" name="name" id="p3" value="">
      <input type="hidden" name="phone" id="p4" value="">
      <input type="hidden" name="gender" id="p5" value="">
      <input type="hidden" name="user_id" :value="user.id">
    </form>

    <div id="fill" style="clear: both; float: left; visibility: hidden;"></div>
    <!--弹框提示-->
    <div id="hint"></div>
  </div>
</template>
<script>
import { getUserInfo, submitNormalMessage } from '../../api.js'
import { Toast, Indicator } from 'mint-ui'

export default {
    data() {
        return {
            consultation_user: {},
            consultation_user_id: this.$route.params.user_id
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
    mounted(){
        this.init()
    },
    computed: {
        user () {
            return this.$store.state.user
        }
    },
  methods: {
    init() {
      let _this = this
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
        }
        $this
          .parent()
          .find("button")
          .removeClass("active");
        $this.addClass("active");
        // 性别
        $(".js_sex_button").click(function() {
          $("input[name=gender]").val($(this).attr("rel"));
        });

        if ($self.next("div").length > 0) {
          $self.next().show();

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
      })
      /* 输入框失去焦点事件*/
      $("textarea").on("blur", function() {
        var $title = $(this).attr("title"),
          $value = $(this).val();
        if ($value == "") {
          $(this)
            .val($title)
            .css("color", "#AAA");
        }
      })
      //提交
      $("#mobile_end").click(function() {
          Indicator.open()
          // 拿到表单的数据json格式
          let arr = {}
          $("form").serializeArray().forEach(function (data) {
              arr[data.name] = data.value
          })
          // 这里写提交数据接口
          let submit = submitNormalMessage('normal', arr)
          submit.then(function (res) {
              if(res.code === 0) {
                  Indicator.close()
                  Toast({message: '咨询完成', duration: 1500})
                  setTimeout(function () {
                      _this.$router.back()
                  }, 1500)
              }
          }).catch(function (e) {

          })

      })
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
  font-size: 16px;
}
.container {
  min-height: 100%;
  background: #f2f2f2;
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
  width: 3rem;
  height: 3rem;
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
  margin-left: 4rem;
  background: #fff;
  font-size: 14px;
  padding: 0.8rem 1rem;
  border-radius: 5px;
}
.container dl dd .content p {
  line-height: 16px;
}
.container dl dd .content p button {
  display: block;
  clear: both;
  border: 1px solid #639838;
  border-radius: 5px;
  padding: 8px 12px;
  background: #fff;
  outline: none;
  margin: 0.8rem 0 0 0;
  width: 100%;
  font-size: 13px;
}
.container dl dd .content p button.active {
  color: #ccc;
  border-color: #fff;
}
.container dl dd div.button {
  padding-bottom: 5px;
}
.container dl dd .content p textarea {
  border: 1px solid #ccc;
  border-radius: 2px;
  color: #aaa;
  padding: 10px;
  outline: none;
  margin: 0.6rem 0 0 0;
  background-color: #fff;
}
.container dl dd .content .arrow {
  position: absolute;
  left: -17px;
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
  margin: 0 4rem 0 0;
  background: #c0e278;
  padding-top: 4px;
}
.container dl.right dd .content .arrow {
  border-left: 0;
  border-bottom: 0;
  border-right: 1px solid #79b746;
  border-top: 1px solid #79b746;
  left: auto;
  right: -17px;
  background: #c0e278;
}
.hide {
  display: none;
}
#hint {
  width: 12rem;
  height: 3rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 0 10px;
  position: fixed;
  top: 50%;
  left: 22%;
  border-radius: 10px;
  text-align: center;
  line-height: 3rem;
  color: #fff;
  display: none;
}
</style>


