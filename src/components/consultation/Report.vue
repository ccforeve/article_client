<template>
  <div id="resule" class="flexv wrap">
    <div class="head">
      <div class="between top">
        <div class="flexv left-t">
          <h4>风险评估报告</h4>
          <p class="date">2019-01-06</p>
        </div>
        <router-link
          :to="'/consultation/vip_chart/' + detail.user_id"
          class="flex center right-t"
        >重测</router-link>
      </div>
      <div class="flexv center chart">
        <canvas id="chart" width="187" height="128"></canvas>
        <p>健康风险</p>
      </div>
    </div>
    <div class="tbtext">
      <div class="tex">45岁后，重大疾病的发病率明显提升，没有健康的基石，看起来安稳的幸福也是脆弱的。</div>
    </div>
    <p class="flex center sex">男性25种重疾发病率</p>
    <p class="flex center caption">中国重大疾病经验发生率表</p>
    <!--曲线图-->
    <div class="chart_excel">
      <div id="main" style="height: 100%; -webkit-tap-highlight-color: transparent; user-select: none; background: transparent;" _echarts_instance_="ec_1546745498434">
        <div style="position: relative; overflow: hidden; width: 375px; height: 216px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"><canvas data-zr-dom-id="zr_0" width="750" height="432" style="position: absolute; left: 0px; top: 0px; width: 375px; height: 216px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas></div>
      </div>
      <div class="flexv center xians">
        <p class="age">71岁</p>
        <p class="percent">NaN%</p>
      </div>
    </div>
    <!--标题-->
    <div class="flex center subhead">
      <span class="s-age"></span>岁<span class="s-sex">男</span>性易发重疾
    </div>
    <!--易发重疾显示-->
    <div class="nessbox">
      <div class="around nessbox_t">
        <div class="flexv center nessbox1">
          <img src="" style="display: block">
          <span></span>
        </div>
        <div class="flexv center nessbox2">
          <img src="" style="display: block">
          <span></span>
        </div>
        <div class="flexv center nessbox3">
          <img src="" style="display: block">
          <span></span>
        </div>
      </div>
    </div>
    <!--咨询按钮-->
    <div class="flex center zx-btn">
      <a href="javascript:;" class="flex center">咨询健康专家</a>
    </div>
    <!--弹窗提示-->
    <div id="wechat" class="alert" style="display: none;">
      <div class="mask"></div>
      <div class="content wechat trans">
        <h3 class="flex center">加我免费咨询</h3>
        <div class="qrcode">
          <img src="/kf_qrcode.png" class="fitimg">
        </div>
        <p class="flex center">长按识别二维码</p>
      </div>
    </div>
  </div>
</template>
<script>
import { echartsman, echartswoman } from '../../assets/js/echarts.js'
import echarts from 'echarts'
import { messageDetail } from '../../api.js'

export default {
  data() {
    return {
      detail: {},
      message_id: this.$route.params.id,
    };
  },
  watch: {
    '$route' (to, from) {
      this.message_id = to.params.id
    }
  },
  mounted() {
    let _this = this
    let message_detail = this.getData()
    message_detail.then(function (res) {
      _this.detail = res
      _this.init();
    }).catch(function (e) {
      console.log(e)
    })
  },
  activated () {
    // this.getData()
  },
  methods: {
    getData() {
      return messageDetail(this.message_id, {type: 'family'})
    },
    init() {
      console.log(this.detail)
      // 获取数据
      let birthday = this.detail.age
      let matter = this.detail.type
      let place = this.detail.region
      let name = this.detail.name
      let tel = this.detail.phone
      let family = this.detail.family
      let age = birthday.substring(-1, 4)
      let income = this.detail.income
      let sex = this.detail.sex === 1 ? "男" : "女"
      let deg = 0
      let gzd = ""

      $(".sex").text(`${sex}性25种重疾发病率`);
      $(".subhead .s-sex").text(sex);
      // 当前日期
      function getDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = year + "-" + month + "-" + strDate;
        return currentdate;
      }
      $(".left-t .date").text(getDate());
      // 健康状况||当前年龄
      let date = new Date(),
        year = date.getFullYear(),
        yx = parseInt(year) - parseInt(age);
      if (yx >= 45) {
        deg = 75;
        gzd = "高";
        $(".tbtext .tex").text(
          "45岁后，重大疾病的发病率明显提升，没有健康的基石，看起来安稳的幸福也是脆弱的。"
        );
      }
      if (yx >= 31 && yx <= 45) {
        deg = 50;
        gzd = "中";
        $(".tbtext .tex").text(
          "30岁后，我们的身体衰老加速，拼搏事业、照顾家庭的同时别忘了多多关心自身的健康。"
        );
      }
      if (yx >= 18 && yx <= 30) {
        deg = 25;
        gzd = "低";
        $(".tbtext .tex").text(
          "年轻就是身体的本钱，但也要加强运动！因为在30岁以后，身体机能开始下滑，需要未雨绸缪哦。"
        );
      }
      // 健康测评圆形图
      $(function() {
        var can = document.getElementById("chart"),
          ctx = can.getContext("2d");
        (can.width = $(document).width() / 2),
          (can.height = $(document).height() / 6);
        var cenX = can.width / 2,
          cenY = can.height / 2,
          rad = (Math.PI * 2) / 100;
        //绘制白色外圈
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 12; //设置线宽
        ctx.strokeStyle = "#96c6ff";
        ctx.arc(cenX, cenY, 40, 0, Math.PI * 2, false);
        ctx.stroke();
        //绘制运动外圈
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 12;
        ctx.strokeStyle = "#fff9ac";
        ctx.arc(cenX, cenY, 40, -Math.PI / 2, -Math.PI / 2 + deg * rad, false);
        ctx.stroke();
        // 绘制文字
        ctx.save();
        ctx.font = "20px Arial"; //设置字体大小和字体
        ctx.fillStyle = "#fff600"; //设置描边样式
        //绘制字体，并且指定位置
        ctx.textAlign = "center";
        ctx.fillText(gzd, cenX, cenY + 8);
        ctx.stroke(); //执行绘制
        ctx.restore();
        // 绘制曲线图
        initEchart(sex);
      });
      // 标题年龄段
      if (yx >= 18 && yx <= 29) {
        $(".subhead .s-age").text("18~29");
      }
      if (yx >= 30 && yx <= 39) {
        $(".subhead .s-age").text("30~39");
      }
      if (yx >= 40 && yx <= 49) {
        $(".subhead .s-age").text("40~49");
      }
      if (yx >= 50 && yx <= 59) {
        $(".subhead .s-age").text("50~59");
      }
      if (yx >= 60 && yx <= 70) {
        $(".subhead .s-age").text("60~70");
      }
      // 曲线图表
      function initEchart(sex) {
        if (sex == "男") {
          var xdata = echartsman.age,
            ydata = echartsman.pro;
          let perc = parseFloat(echartsman.pro[echartsman.age[yx]]).toFixed(2);
          $(".xians .age").text(`${yx}岁`);
          $(".xians .percent").text(`${perc}%`);
          //男性重疾显示
          if (yx >= 18 && yx <= 29) {
            $(".nessbox1")
              .children("img")
              .attr("src", "../../assets/image/heart.jpg");
            $(".nessbox2")
              .children("img")
              .attr("src", "../../assets/image/leukemia.jpg");
            $(".nessbox3")
              .children("img")
              .attr("src", "../../assets/image/brain.jpg");
            $(".nessbox1")
              .children("span")
              .text("心脏病");
            $(".nessbox2")
              .children("span")
              .text("白血病");
            $(".nessbox3")
              .children("span")
              .text("脑血管病");
          }
          if (yx >= 30 && yx <= 39) {
            $(".nessbox1")
              .children("img")
              .attr("src", "~@/assets/image/heart.jpg");
            $(".nessbox2")
              .children("img")
              .attr("src", "~@/assets/image/gan.jpg");
            $(".nessbox3")
              .children("img")
              .attr("src", "~@/assets/image/brain.jpg");
            $(".nessbox1")
              .children("span")
              .text("心脏病");
            $(".nessbox2")
              .children("span")
              .text("肝癌");
            $(".nessbox3")
              .children("span")
              .text("脑血管病");
          }
          if (yx >= 40 && yx <= 49) {
            $(".nessbox1")
              .children("img")
              .attr("src", "~@/assets/image/heart.jpg");
            $(".nessbox2")
              .children("img")
              .attr("src", "~@/assets/image/brain.jpg");
            $(".nessbox3")
              .children("img")
              .attr("src", "~@/assets/image/gan.jpg");
            $(".nessbox1")
              .children("span")
              .text("心脏病");
            $(".nessbox2")
              .children("span")
              .text("脑血管病");
            $(".nessbox3")
              .children("span")
              .text("肝癌");
          }
          if (yx >= 50 && yx <= 59) {
            $(".nessbox1")
              .children("img")
              .attr("src", "~@/assets/image/brain.jpg");
            $(".nessbox2")
              .children("img")
              .attr("src", "~@/assets/image/heart.jpg");
            $(".nessbox3")
              .children("img")
              .attr("src", "~@/assets/image/gan.jpg");
            $(".nessbox1")
              .children("span")
              .text("脑血管病");
            $(".nessbox2")
              .children("span")
              .text("心脏病");
            $(".nessbox3")
              .children("span")
              .text("肝癌");
          }
          if (yx >= 60 && yx <= 70) {
            $(".nessbox1")
              .children("img")
              .attr("src", "~@/assets/image/heart.jpg");
            $(".nessbox2")
              .children("img")
              .attr("src", "~@/assets/image/fei.jpg");
            $(".nessbox3")
              .children("img")
              .attr("src", "~@/assets/image/brain.jpg");
            $(".nessbox1")
              .children("span")
              .text("心脏病");
            $(".nessbox2")
              .children("span")
              .text("肺癌");
            $(".nessbox3")
              .children("span")
              .text("脑血管病");
          }
        } else {
          var xdata = echartswoman.age,
            ydata = echartswoman.pro;
          let perc = parseFloat(echartswoman.pro[echartswoman.age[yx]]).toFixed(
            2
          );
          $(".xians .age").text(`${yx}岁`);
          $(".xians .percent").text(`${perc}%`);
          //女性重疾显示
          if (yx >= 18 && yx <= 29) {
            $(".nessbox1")
              .children("img")
              .attr("src", "../../assets/image/heart.jpg");
            $(".nessbox2")
              .children("img")
              .attr("src", "../../assets/image/leukemia.jpg");
            $(".nessbox3")
              .children("img")
              .attr("src", "../../assets/image/nerve.jpg");
            $(".nessbox1")
              .children("span")
              .text("心脏病");
            $(".nessbox2")
              .children("span")
              .text("白血病");
            $(".nessbox3")
              .children("span")
              .text("神经系统疾病");
          }
          if (yx >= 30 && yx <= 39) {
            $(".nessbox1")
              .children("img")
              .prop("src", "../../assets/image/heart.jpg");
            $(".nessbox2")
              .children("img")
              .prop("src", "../../assets/image/xr.jpg");
            $(".nessbox3")
              .children("img")
              .prop("src", "../../assets/image/brain.jpg");
            $(".nessbox1")
              .children("span")
              .text("心脏病");
            $(".nessbox2")
              .children("span")
              .text("乳腺癌");
            $(".nessbox3")
              .children("span")
              .text("脑血管病");
          }
          if (yx >= 40 && yx <= 70) {
            $(".nessbox1")
              .children("img")
              .attr("src", "../../assets/image/brain.jpg");
            $(".nessbox2")
              .children("img")
              .attr("src", "../../assets/image/heart.jpg");
            $(".nessbox3")
              .children("img")
              .attr("src", "../../assets/image/fei.jpg");
            $(".nessbox1")
              .children("span")
              .text("脑血管病");
            $(".nessbox2")
              .children("span")
              .text("心脏病");
            $(".nessbox3")
              .children("span")
              .text("肺癌");
          }
        }
        var myChart = echarts.init(document.getElementById("main"));
        let option = {
          title: {
            show: false
          },
          tooltip: {
            trigger: "axis",
            show: false,
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#e8f5fd"
              }
            }
          },
          toolbox: {
            show: false,
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: "2%",
            right: "4%",
            bottom: "5%",
            top: "4%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: xdata,
              axislabel: { show: false },
              axisline: { show: false },
              axisLine: {
                lineStyle: {
                  color: "#c2cdd3"
                }
              },
              //隐藏坐标轴刻度点
              axisTick: {
                show: false,
                length: 10
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              min: 0,
              max: 4,
              axisLine: {
                lineStyle: {
                  color: "#c2cdd3"
                }
              },
              axisLabel: {
                formatter: "{value} %"
              },
              //隐藏坐标轴刻度点
              axisTick: {
                show: false
              }
            }
          ],
          series: [
            {
              name: "发病率",
              type: "line",
              stack: "总量",
              //拐点!!!!大小
              symbolSize: 0,
              itemStyle: {
                normal: {
                  color: "#e8f5fd"
                }
              },
              lineStyle: {
                normal: {
                  width: 1, //连线粗细
                  color: "#0087e8" //连线颜色
                }
              },
              areaStyle: { normal: {} },
              data: ydata
            }
          ]
        };
        myChart.setOption(option, true);
      }

      // 弹窗
      $(".zx-btn a").click(function() {
        $("#wechat")
          .show()
          .find(".content")
          .addClass("trans");
      });
      $(".mask").click(function() {
        $(".alert").hide();
      });
    }
  }
};
</script>


