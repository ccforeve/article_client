<template>
  <div>
    <div class="ml-main" id="ml-main">
      <img class="main_back" src="../assets/image/back.png">
      <img class="animated zoomIn img_2_1" src="../assets/image/img_1.png">
      <img class="animated bounceIn img_2_2" src="../assets/image/img_2.png">
      <div class="kePublic">
        <!--转盘效果开始-->
        <p class="last_num">剩余抽奖次数：{{last_num}}</p>
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
          <div class="flip" v-for="(item, index) of order_list">
            <div v-for="(itemLow, ind) of item">
              恭喜 {{itemLow.nickname}} <span v-if="itemLow.phone">{{itemLow.phone}}</span> 的用户抽中 <span id="gift_coupon">{{itemLow.money}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-------------底部声明-------------->
      <img class="rule_title" src="../assets/image/rule_title.png">
      <!-- 抽奖规则说明 -->
      <div class="rule_message">
        <p>* 1 活动时间：2019年6月6号 -- 2019年6月16号</p>
        <p>* 2 参与群体：本次活动针对群体为事业分享网站付费会员。抽奖次数为：一年会员/一次，两年会员/两次，五年会员/三次。续费根据客户后续续费年限增加抽奖次数</p>
        <p></p>
        <p>* 3 活动奖品：</p>
        <p>一等奖：华为P30 Pro 521G(麒麟980) 价值6788元 10份</p>
        <p>二等奖：华为M5平板 青春版 64G 价值1899元 20份</p>
        <p>三等奖：现金红包 999元 50份</p>
        <p>幸运奖： 20元/10元/5元现金红包送不停</p>
        <p></p>
        <p>* 4 领奖方式：中将之后会弹出工作人员微信二维码。请长按二维码扫描添加，出示您得获奖信息，待工作人员核实之后为您发放奖品。</p>
        <p style="text-align: right;margin-top: 1.5rem;">活动最终解释权归事业分享工作室所有。</p>
      </div>
    </div>

    <!-------------中奖弹窗页面-------------->
    <div class="zj-main" id="zj-main">
      <div class="txzl">
        <div class="zj_text">
          中奖啦<br>恭喜获得<span id="jiangpin"></span>一份<br>可在我的钱包中查看
        </div>
        <div class="close_zj">关闭</div>
      </div>
    </div>

    <!-------------谢谢参与弹窗-------------->
    <div class="xxcy-main" id="xxcy-main">
      <div class="xxcy">
        <div class="xxcy_text">
          很遗憾<br>没有抽中礼品
        </div>
        <div class="close_xxcy">关闭</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      last_num: 3,
      order_list: [
        [{
          id: 123,
          nickname: "11111",
          phone: '13507812335',
          money: "999元现金红包"
        },
        {
          id: 345,
          nickname: "22222",
          phone: '13507812335',
          money: "200元县级红包"
        },
        {
          id: 567,
          nickname: "33333",
          phone: '13507812335',
          money: "5元现金红包"
        }],
        [{
          id: 123,
          nickname: "oooo",
          phone: '13507812335',
          money: "999元现金红包"
        },
        {
          id: 345,
          nickname: "ZqweJ",
          phone: '13507812335',
          money: "200元县级红包"
        },
        {
          id: 567,
          nickname: "kkk",
          phone: '13507812335',
          money: "5元现金红包"
        }],
        [{
          id: 123,
          nickname: "zxczxc",
          phone: '13507812335',
          money: "999元现金红包"
        },
        {
          id: 345,
          nickname: "zxczxczxc",
          phone: '13507812335',
          money: "200元县级红包"
        },
        {
          id: 567,
          nickname: "qweqweqw",
          phone: '13507812335',
          money: "5元现金红包"
        }],
      ],
      turnplate: {
        restaraunts: ["5元现金红包", "10元现金红包", "20元现金红包", "999元现金红包", "50元现金红包", "华为M5平板电脑", "5元现金红包", "10元现金红包", "华为P30 Pro"], //大转盘奖品名称
        colors: ["#FBDB00", "#FACA00", "#FBDB00", "#FACA00", "#FBDB00", "#FACA00", "#FBDB00", "#FACA00", "#FFEB64"], //大转盘奖品区块对应背景颜色
        //fontcolors:[],				//大转盘奖品区块对应文字颜色
        outsideRadius: 222, //大转盘外圆的半径
        textRadius: 165, //大转盘奖品位置距离圆心的距离
        insideRadius: 65, //大转盘内圆的半径
        startAngle: 0, //开始角度
        bRotate: false //false:停止;ture:旋转
      }
    }
  },
  mounted() {
    this.initStart()
    this.start()
    // this.roll()
  },
  activated() {
    this.roll()
  },
  methods: {
    start() {
      var Mar = document.getElementById("Marquee");
      var child_div = Mar.getElementsByTagName("div")
      var picH = 35; //移动高度 
      var scrollstep = 3; //移动步幅,越大越快 
      var scrolltime = 50; //移动频度(毫秒)越大越慢 
      var stoptime = 3000; //间断时间(毫秒) 
      var tmpH = 0;
      Mar.innerHTML += Mar.innerHTML;
      if (tmpH < picH) {
        tmpH += scrollstep;
        if (tmpH > picH) tmpH = picH;
        Mar.scrollTop = tmpH;
        let funStart = this.start
        setTimeout(funStart, stoptime);
      } else {
        tmpH = 0;
        Mar.appendChild(child_div[0]);
        Mar.scrollTop = 0;
        let funStart = this.start
        setTimeout(funStart, stoptime);
      }
    },
    //旋转转盘 item:奖品位置; txt：提示语;
    rotateFn(item, txt, data) {
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
          $("#zj-main").fadeIn();
          var resultTxt = txt.replace(/[\r\n]/g, ""); //去掉回车换行
          $("#jiangpin").text(data.msg);
          save();
          turnplate.bRotate = !turnplate.bRotate;
        }
      });
    },
    theEnd() {
      $('#tupBtn').unbind('click'); //提交成功解除点击事件。   
      return 2;
    },
    roll() {
      this.timer = setInterval(function roll() {
        console.log('个人中心')
        var objh = $('.flip').height();
        $("#Marquee .boroll_box").append($("#Marquee .boroll_box .flip").first().height(0).animate({ "height": objh + "px" }, 500));
      }, 2000);
    },
    initStart() {
      var turnplate = this.turnplate
      var Mar = document.getElementById("Marquee");
      var child_div = Mar.getElementsByTagName("div")
      var picH = 35; //移动高度 
      var scrollstep = 3; //移动步幅,越大越快 
      var scrolltime = 50; //移动频度(毫秒)越大越慢 
      var stoptime = 3000; //间断时间(毫秒) 
      var tmpH = 0;
      Mar.innerHTML += Mar.innerHTML;
      let funStart = this.start
      setTimeout(funStart, stoptime);
      /********弹窗页面控制**********/
      $('.close_zj').click(function () {
        $('#zj-main').fadeOut();
        $('#tx-main').fadeIn(); //提醒框显示
        //判断用户是否确认放弃
        $(".do").click(function () { //点确认就默认放弃
          $('#tx-main').fadeOut();
          this.theEnd();
          // save();
        });
        $(".not_do").click(function () { //点取消就回到提交页面
          $('#tx-main').fadeOut();
          $('#zj-main').fadeIn();
        });

        $('#ml-main').fadeIn();

      });

      $('.close_xxcy').click(function () {
        $('#xxcy-main').fadeOut();
      });

      /********抽奖开始**********/
      this.drawRouletteWheel()

    },
    tupBtn() {
      var turnplate = {
        restaraunts: ["5元现金红包", "10元现金红包", "20元现金红包", "999元现金红包", "50元现金红包", "华为M5平板电脑", "5元现金红包", "10元现金红包", "华为P30 Pro"], //大转盘奖品名称
        colors: ["#FBDB00", "#FACA00", "#FBDB00", "#FACA00", "#FBDB00", "#FACA00", "#FBDB00", "#FACA00", "#FFEB64"], //大转盘奖品区块对应背景颜色
        //fontcolors:[],				//大转盘奖品区块对应文字颜色
        outsideRadius: 222, //大转盘外圆的半径
        textRadius: 165, //大转盘奖品位置距离圆心的距离
        insideRadius: 65, //大转盘内圆的半径
        startAngle: 0, //开始角度
        bRotate: false //false:停止;ture:旋转
      }
      var gamed = $("#gamed").val();
      var gameState = $("#gameState").val();
      var cardCode = $("#cardCode").val();
      var mId = $("#mId").val();
      if (gamed == 1) {
        $(".xxcy_text").html("今日抽奖次数已用完<br>每天分享可以增加一次抽奖机会");
        $("#xxcy-main").fadeIn();
        return;
      }
      if (turnplate.bRotate) return;
      turnplate.bRotate = !turnplate.bRotate;
      // 随机抽取
      var arr = [0, 1, 2, 7, 6, 0, 1]
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
              //ctx.fillStyle = j == 0?'#FFFFFF':'#FFFFFF';
              if (j == 0) {
                //ctx.fillText(texts[j]+"M", -ctx.measureText(texts[j]+"M").width / 2, j * line_height);
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
            //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
          }

          //把当前画布返回（调整）到上一个save()状态之前 
          ctx.restore();
          //----绘制奖品结束----
        }
      }
    }
  }
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
  top: 188vw;
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
}
</style>


