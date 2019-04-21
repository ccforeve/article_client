<template>
    <div id="partner" class="flexv mainbox wrap">
        <div class="flexv partner-container">
            <div class="between theme-column">
                <div class="flex center theme">今日总收入</div>
                <div class="flex center theme">
                    {{today_profit}}
                </div>
            </div>
            <ul class="today-datum-list">
                <li class="between">
                    <div class="flex center title sub-title">我的推广奖金(30%×付费金额)</div>
                    <div class="flex center datum-cont">{{normal_profit.today_profit}}元</div>
                </li>
                <li class="between">
                    <div class="flex center title">推广人数</div>
                    <div class="flex center datum-cont">{{normal_profit.ex_user_today}}人</div>
                </li>
                <li class="between">
                    <div class="flex center title">付费人数</div>
                    <div class="flex center datum-cont">{{normal_profit.pay_user_today}}人</div>
                </li>
                <li class="between">
                    <div class="flex center title">付费金额</div>
                    <div class="flex center datum-cont">{{normal_profit.pay_money_today}}元</div>
                </li>
            </ul>
        </div>

        <div class="partner-container" style="margin-top:28px;">
            <div class="between theme-column">
                <div class="flex center theme">累计总收入</div>
                <div class="flex center theme">
                    {{total_profit}}
                </div>
            </div>
            <ul class="today-datum-list">
                <li class="between">
                    <div class="flex center title sub-title">我的推广奖金(30%×付费金额)</div>
                    <div class="flex center datum-cont">{{normal_profit.total_profit}}元</div>
                </li>
                <li class="flex">
                    <router-link to="/profit/extension/users" class="between">
                        <div class="flex center title">推广人数</div>
                        <div class="flex center title">
                            <div class="datum-cont color">{{normal_profit.ex_user_total}}人</div>
                            <div class="icon-arrow color">&gt;</div>
                        </div>
                    </router-link>
                </li>
                <li class="flex">
                    <router-link to="/profit/extension/orders" class="between">
                        <div class="flex center title">付费人数</div>
                        <div class="flex center title">
                            <div class="datum-cont color">{{normal_profit.pay_user_total}}人</div>
                            <div class="icon-arrow color">&gt;</div>
                        </div>
                    </router-link>
                </li>
                <li class="between">
                    <div class="flex center title">付费金额</div>
                    <div class="flex center datum-cont">{{normal_profit.pay_money_total}}元</div>
                </li>
            </ul>
        </div>

        <!--<a href="" class="flex center make-btn">推广明细></a>-->
    </div>
</template>

<script>
    import {getNormalProfitDetail} from '../../api.js'

    export default {
        name: "ProfitDetail",
        data () {
            return {
                type: this.$store.state.user.type,
                normal_profit: {},
                dealer_profit: {},
                today_profit: 0,
                total_profit: 0,
            }
        },
        activated () {
            let _this = this
            let user_type = this.type
            let normal = getNormalProfitDetail()
            normal.then(function (res) {
                _this.normal_profit = res
                _this.today_profit = res.today_profit
                _this.total_profit = res.total_profit
            })
        }
    }
</script>
