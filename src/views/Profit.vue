<template>
  <div
    id="expand"
    class="twinkle flexv wrap"
  >
    <div
      class="loading"
      v-if="!has_data"
    >
      <div class="loading-icon">
        <fulfilling-bouncing-circle-spinner
          :animation-duration="4000"
          :size="60"
          color="#ff1d5e"
        />
      </div>
    </div>

    <div class="flexitemv datum">
      <div class="flexv center sub">
        <h2 class="flex center income">今日收益</h2>
        <div class="flex center num">{{profit.today_profit}}</div>
        <router-link
          to="/profit/detail"
          class="flex center btn"
        >推广记录</router-link>
        <div class="flexv centerv front">
          <div class="flexitemv center myfront">
            <em class="flex">{{profit.used_profit}}</em>
            <span class="flex center">已提现</span>
          </div>
          <div class="flexitemv center myfront">
            <em class="flex">{{profit.surplus_profit}}</em>
            <span class="flex center">可提现</span>
          </div>
          <div class="flexitemv center myfront">
            <em class="flex">{{profit.total_profit}}</em>
            <span class="flex center">累计收益</span>
          </div>
        </div>
      </div>

      <div class="flexv func">
        <router-link
          to="/profit/withdraw_cash"
          class="flexitem centerv tx"
        >
          <i
            class="flex center bls bls-tixian"
            style="background:#3399fd;"
          ></i>
          <span class="flex center text">申请提现</span>
        </router-link>
        <router-link
          to="/profit/cash/list"
          class="flexitem centerv jl"
        >
          <i
            class="flex center bls bls-jilu"
            style="background:#ea1c61;"
          ></i>
          <span class="flex center text">提现记录</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfit } from "../api.js";
import { wechatConfig } from "../cookie.js";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";

export default {
  name: "extension",
  components: {
    FulfillingBouncingCircleSpinner
  },
  data() {
    return {
      has_data: false,
      profit: {}
    };
  },
  activated() {
    wechatConfig();

    let _this = this;
    let profit = getProfit();
    profit.then(function(res) {
      _this.profit = res;
      _this.$store.commit("updateSurplusProfit", res.surplus_profit);
      _this.has_data = true;
    });
  }
};
</script>
