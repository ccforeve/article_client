<template>
  <div>
    <div class="ml-main" id="ml-main">
      <img class="main_back" src="../assets/image/back.png">
      <img class="animated zoomIn img_2_1" src="../assets/image/img_1.png">
      <img class="animated bounceIn img_2_2" src="../assets/image/img_2.png">
      <div class="kePublic">
        <!--转盘效果开始-->
        <p class="last_num">剩余抽奖次数：{{user.luck_draw}}</p>
        <div style="margin:0 auto">
          <div class="banner">
            <div class="turnplate">
              <canvas class="item" id="wheelcanvas" width="516" height="516"></canvas>
              <img id="tupBtn" @click="tupBtn" class="pointer" src="../assets/image/turnplate-pointer_2.png">
            </div>
          </div>
        </div>
        <!--转盘效果结束-->
        <div class="clear"></div>
      </div>
      <img class="bottom_shadow" src="../assets/image/bottom_shadow.png">
      <img class="animated zoomIn kePublic_back" src="../assets/image/back1.png">

      <!--------------滚动中奖纪录---------------->
      <div class="record_line" id="Marquee">
        <div class="boroll_box">
          <div class="flex centerv flip" v-for="(item, index) of draw_list" :key="index">
            <i class="flex center bls bls-horn"></i>
            恭喜 {{item.name.length > 4 ? item.name.substr(0, 4) + '..' : item.name}} <span v-if="item.phone">{{item.phone.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2")}}</span> 的用户抽中 <span id="gift_coupon">{{item.prize}}</span>
          </div>
        </div>
      </div>
      <!-------------底部声明-------------->
      <img class="rule_title" src="../assets/image/rule_title.png">
      <!-- 抽奖规则说明 -->
      <div class="rule_message">
        <p>* 1、活动时间：2019年6月6号 -- 2019年6月18号</p>
        <p>* 2、参与群体：活动期间新办理的付费会员(付费及续费)。抽奖次数为：一年会员/一次，两年会员/两次，五年会员/三次。续费根据客户后续续费年限增加抽奖次数</p>
        <p></p>
        <p>* 3、活动奖品：</p>
        <p>一等奖：华为P30 Pro 512G(麒麟980) 价值6788元 10份</p>
        <p>二等奖：华为M5平板 青春版 64G 价值1899元 20份</p>
        <p>三等奖：现金红包 999元 50份</p>
        <p>幸运奖： 20元/10元/5元现金红包送不停</p>
        <p></p>
        <p>* 4、实物领奖方式：中奖之后会弹出工作人员微信二维码。请长按二维码扫描添加，出示您得获奖信息，待工作人员核实之后为您发放奖品。</p>
        <p>* 5、三等奖和幸运奖领奖方式：中奖之后公众号会发送微信红包，请尽快领取红包，否则24小时之后红包过期，如未接收到红包，请联系客服。</p>
        <p style="text-align: right;margin-top: 1.5rem;">活动最终解释权归事业分享工作室所有。</p>
      </div>
    </div>

    <!-------------中奖弹窗页面-------------->
    <div class="zj-main" id="zj-main" v-if="draw">
      <div class="txzl">
        <img style="width:100%" src="../assets/image/zhongjiangBg.jpg">
        <div class="zj_text" v-html="prize"></div>
        <div class="close_zj" @click="closeDraw">确定</div>
      </div>
    </div>

    <div class="zj-main" v-if="!is_draw">
      <div class="toCloseMess" @click="closeDrawTip">X</div>
      <div class="txzl txzl-close">
        <div class="zj_text">
          您没有获得抽奖机会
        </div>
        <router-link to="/open_member" class="close_zj toOpen">点击获取抽奖机会</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { judgeActivity, activityDraw, activityDrawStore } from "../api";
import { wechatConfig } from "../cookie.js";
export default {
  data() {
    return {
      prize: '',    // 奖品
      draw_list: [],  // 滚动获奖列表
      turnplate: {
        restaraunts: ["5元现金红包", "10元现金红包", "20元现金红包", "999元现金红包", "50元现金红包", "华为M5平板电脑", "5元现金红包", "10元现金红包", "华为P30 Pro"], //大转盘奖品名称
        colors: ["#FBDB00", "#FACA00", "#FBDB00", "#FACA00", "#FBDB00", "#FACA00", "#FBDB00", "#FACA00", "#FFEB64"], //大转盘奖品区块对应背景颜色
        //fontcolors:[],				//大转盘奖品区块对应文字颜色
        outsideRadius: 222, //大转盘外圆的半径
        textRadius: 165, //大转盘奖品位置距离圆心的距离
        insideRadius: 65, //大转盘内圆的半径
        startAngle: 0, //开始角度
        bRotate: false //false:停止;ture:旋转
      },
      timer: null,  // 定时器
      draw: false,  // 奖品弹窗
      is_draw: true,  // 抽奖次数弹窗
      is_start: true,  // 是否可以抽奖
    }
  },
  created() {
    this.activityDraw()
  },
  activated() {
    this.roll()
    this.judgeActivity()
    wechatConfig()
  },
  mounted() {
    this.initStart()
    // this.activityDraw()
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    // 设置活动开始时间，测试先注释代码
    async judgeActivity() {
      let _this = this
      let activity = await judgeActivity()
      if (!activity.data) {
        _this.is_start = false
        Toast({ message: "活动尚未开始", duration: 1500 });
        setTimeout(function () {
          _this.$router.push('/index')
        }, 1500)
      }
    },
    activityDraw() {
      let _this = this
      activityDraw().then(function (res) {
        // debugger
        console.log(res)
        _this.draw_list = res
      })
    },
    //旋转转盘 item:奖品位置; txt：提示语
    rotateFn(item, txt, data) {
      let _this = this
      var turnplate = this.turnplate
      var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length * 2));
      if (angles < 270) {
        angles = 270 - angles;
      } else {
        angles = 360 - angles + 270;
      }
      $('#wheelcanvas').stopRotate();
      $('#wheelcanvas').rotate({
        angle: 0,
        animateTo: angles + 1800,
        duration: 6000,
        callback: function () {
          // 测试先注释代码 上线的时候替换
          activityDrawStore({ prize: item }).then(function (res) {
            _this.prize = '恭喜您获得<span id="jiangpin">' + txt + '</span>一份<br>'
            _this.draw = true
            _this.is_start = true
          }).catch(function (e) {
            _this.prize = e.msg
            _this.draw = true
            _this.is_start = true
          })
          turnplate.bRotate = !turnplate.bRotate;

          // // 测试代码
          // _this.prize = '恭喜您获得<span id="jiangpin">' + txt + '</span>一份<br>'
          // _this.draw = true
          // _this.is_start = true
        }
      });
    },
    roll() {
      this.timer = setInterval(function () {
        var objh = $('.flip').height();
        $("#Marquee .boroll_box").append($("#Marquee .boroll_box .flip").first().height(0).animate({ "height": objh + "px" }, 500));
      }, 2000);
    },
    initStart() {
      /********开始画抽奖图**********/
      this.drawRouletteWheel()
    },
    closeDraw() {
      this.draw = false
    },
    closeDrawTip() {
      this.is_draw = true
    },
    tupBtn() {
      if (!this.is_start) {
        return;
      }
      if (this.user.luck_draw <= 0) {    // 没有抽奖次数
        this.is_draw = false
        return
      }
      this.is_start = false
      // 抽奖次数减一
      let new_user = JSON.parse(localStorage.user);
      new_user.luck_draw = new_user.luck_draw - 1;
      localStorage.user = JSON.stringify(new_user);
      this.$store.commit("setTokenAndUser", JSON.parse(localStorage.user));

      var turnplate = {
        restaraunts: this.turnplate.restaraunts, //大转盘奖品名称
        colors: this.turnplate.colors, //大转盘奖品区块对应背景颜色
        //fontcolors:[],				//大转盘奖品区块对应文字颜色
        outsideRadius: this.turnplate.outsideRadius, //大转盘外圆的半径
        textRadius: this.turnplate.textRadius, //大转盘奖品位置距离圆心的距离
        insideRadius: this.turnplate.insideRadius, //大转盘内圆的半径
        startAngle: this.turnplate.startAngle, //开始角度
        bRotate: this.turnplate.bRotate //false:停止;ture:旋转
      }
      console.log(turnplate.bRotate)
      // if (turnplate.bRotate) return;
      // turnplate.bRotate = !turnplate.bRotate;
      // 随机抽取
      var arr = [0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 1, 1, 7, 2]
      var index = Math.floor((Math.random() * arr.length));
      var item = arr[index];
      var data = {
        "msg": turnplate.restaraunts[item]
      };
      this.rotateFn(item + 1, turnplate.restaraunts[item], data);
    },
    drawRouletteWheel() {
      var turnplate = this.turnplate
      var canvas = document.getElementById("wheelcanvas");
      if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length / 2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 516, 516);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = 'bold 22px Microsoft YaHei';
        for (var i = 0; i < turnplate.restaraunts.length; i++) {
          var angle = turnplate.startAngle + i * arc;
          ctx.fillStyle = turnplate.colors[i];
          ctx.beginPath();
          //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
          ctx.arc(258, 258, turnplate.outsideRadius, angle, angle + arc, false);
          ctx.arc(258, 258, turnplate.insideRadius, angle + arc, angle, true);
          ctx.stroke();
          ctx.fill();
          //锁画布(为了保存之前的画布状态)
          ctx.save();

          //----绘制奖品开始----
          ctx.fillStyle = "#E83800";
          //ctx.fillStyle = turnplate.fontcolors[i];
          var text = turnplate.restaraunts[i];
          var line_height = 30;
          //translate方法重新映射画布上的 (0,0) 位置
          ctx.translate(258 + Math.cos(angle + arc / 2) * turnplate.textRadius, 258 + Math.sin(angle + arc / 2) * turnplate.textRadius);
          //rotate方法旋转当前的绘图
          ctx.rotate(angle + arc / 2 + Math.PI / 2);
          /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
          if (text.indexOf("\n") > 0) { //换行
            var texts = text.split("\n");
            for (var j = 0; j < texts.length; j++) {
              ctx.font = j == 0 ? '22px Microsoft YaHei' : '22px Microsoft YaHei';
              if (j == 0) {
                ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
              } else {
                ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
              }
            }
          } else if (text.indexOf("\n") == -1 && text.length > 6) { //奖品名称长度超过一定范围
            text = text.substring(0, 6) + "||" + text.substring(6);
            var texts = text.split("||");
            for (var j = 0; j < texts.length; j++) {
              ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
            }
          } else {
            //在画布上绘制填色的文本。文本的默认颜色是黑色
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
          }
          //把当前画布返回（调整）到上一个save()状态之前
          ctx.restore();
          //----绘制奖品结束----
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
}
</script>
<style scoped>
.turnplate {
  background-image: url(../assets/image/turnplate-bg_2.png);
  background-size: 100% 100%;
  font-size: 24px !important;
}
.rule_message {
  width: 100%;
  position: absolute;
  top: 180vw;
  z-index: 2;
  padding: 0 3rem;
  color: #ffffff;
  text-align: justify;
}
.rule_message p {
  margin-bottom: 0.5rem;
}
.last_num {
  text-align: center;
  font-size: 1.4rem;
  color: #ffffff;
}
.boroll_box {
  position: absolute;
  width: 100%;
  bottom: -2.5rem;
}
.boroll_box > div {
  width: 100%;
  padding-left: 2rem;
}
/*****抽奖页面****/
.ml-main {
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  background: #f82d2b;
  position: absolute;
  *zoom: 1;
  z-index: 1;
  left: center;
  top: 0;
  overflow: scroll;
}

.main_back {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.img_2_1 {
  width: 70vw;
  position: absolute;
  top: 6vw;
  left: 14vw;
  animation-delay: 0.25s;
  animation-duration: 1s;
  z-index: 2;
}

.img_2_2 {
  width: 15vw;
  position: absolute;
  top: 15vw;
  right: 3vw;
  animation-delay: 0.5s;
  animation-duration: 1s;
  z-index: 2;
}

.ml-main .kePublic {
  width: 80%;
  height: auto;
  position: absolute;
  top: 69vw;
  left: 10%;
  z-index: 999;
}

.bottom_shadow {
  width: 50vw;
  position: absolute;
  top: 139vw;
  left: 25vw;
  z-index: 1;
}

.kePublic_back {
  width: 85vw;
  position: absolute;
  top: 72vw;
  left: 6vw;
  z-index: 2;
}

.record_line {
  width: 90vw;
  height: 8vw;
  position: relative;
  overflow: hidden;
  top: 156vw;
  left: 5vw;
  line-height: 8vw;
  font-size: 3vw;
  color: #eecfcf;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  z-index: 2;
}
.record_line div {
  overflow: hidden;
}
#gift_coupon {
  color: #f3d008;
}
.rule_title {
  width: 40vw;
  position: absolute;
  top: 170vw;
  left: 30vw;
  z-index: 2;
}
/* 大转盘样式 */
.banner {
  display: block;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}
.banner .turnplate {
  display: block;
  width: 100%;
  position: relative;
}
.banner .turnplate canvas.item {
  width: 100%;
}
.banner .turnplate #tupBtn {
  position: absolute;
  width: 27.5%;
  height: 33.5%;
  left: 36%;
  top: 30.5%;
  border: 0;
  background: none;
}
.banner .turnplate img {
  width: 100%;
  height: auto;
}
/*******中奖页面*******/

.zj-main {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.7);
  background-size: 100% 100%;
  position: absolute;
  overflow: hidden;
  *zoom: 1;
  z-index: 10;
  left: center;
  top: 0;
}
.zj-main .txzl {
  width: 70%;
  height: auto;
  position: absolute;
  top: 28%;
  left: 15%;
  background: white;
  border-radius: 20px;
  color: #7a312d;
  overflow: hidden;
  text-align: center;
  font-size: 4vw;
  background-position: -2rem 0 0 0;
  line-height: 6vw;
}
.zj-main .txzl .zj_text {
  margin: 0vw auto;
  margin-bottom: 3vw;
}
.zj-main .close_zj {
  width: 25vw;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 5vw;
  line-height: 9vw;
  color: #e1ce85 !important;
  background: #ba2d1c;
  border-radius: 5px;
  font-size: 4vw;
}
@media (min-width: 320px) and (max-width: 359px) {
  html {
    font-size: 31% !important;
  }
}

@media (min-width: 360px) and (max-width: 399px) {
  html {
    font-size: 36% !important;
  }
}

@media (min-width: 400px) and (max-width: 479px) {
  html {
    font-size: 40% !important;
  }
}

@media (min-width: 480px) and (max-width: 639px) {
  html {
    font-size: 49% !important;
  }
}
.txzl-close {
  height: 25% !important;
}
.txzl-close .zj_text {
  margin-top: 10vw !important;
  font-size: 2rem;
}
.toOpen {
  margin-bottom: 2vw;
  margin-top: 2vw;
  display: inline-block;
  width: 36vw !important;
}
.txzl-close .close_zj {
  margin-top: 4vw;
  display: inline-block;
  margin-left: 0.5rem;
}
.toCloseMess {
  position: absolute;
  display: inline-block;
  top: 20%;
  right: 15%;
  color: gray;
  z-index: 10;
  font-size: 6vw;
  text-align: center;
  width: 8vw;
  height: 8vw;
  line-height: 8vw;
  background: #ffffff;
  border-radius: 4vw;
}
.toCloseMess::after {
  content: "";
  position: absolute;
  display: inline-block;
  width: 3px;
  height: 10vw;
  top: 85%;
  right: 43%;
  background: #fff;
  z-index: 9;
}
</style>


