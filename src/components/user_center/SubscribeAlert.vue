<template>
    <div class="flex center gzh" style="display: block;">
        <div class="mask"></div>
        <div class='content'>
            <h3 class="flex center">关注公众号享受更多功能</h3>
            <div class="qrcode">
                <img src="../../assets/image/qrcode.jpg" class="fitimg">
            </div>
            <p class="flex center">长按识别二维码</p>
            <div class="subscribe" style="text-align: center;padding-bottom: 1rem">
                <button class="subscribe-button" @click="subscribe">已关注</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SubscribeAlert",
        methods: {
            subscribe () {
                this.$emit('subscribe')
            }
        }
    }
</script>

<style scoped>
    .subscribe {
        text-align: center;
        padding-bottom: 1rem;
    }
    .subscribe-button{
        width: 5rem;
        height: 3rem;
        color: #fff;
        background: #DD726B;
        border: 1px solid #999;
        border-radius: .5rem;
        text-align: center;
    }
</style>
