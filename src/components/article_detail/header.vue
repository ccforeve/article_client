<template>
    <div class="title max">
        <h2 class="flex">标题</h2>
        <div class="flex subhead">
            <span class="date">时间</span>
            <span class="name">用户名</span>
            <a href="javascript:;" class="site" id="index">事业头条</a>
        </div>

        <div class="around consult-box">
            <div class="flex center c-img"><img src="" class="radimg"></div>
            <a href="" class="flex center c-zx"></a>
            <div class="flexv no">
                <div class="between phone">
                    <i class="flex center bls bls-shouji" style="color:#0178d6;"></i>
                    <div class="flex center number"><span></span></div>
                    <a href="tel:" class="flex center n-btn">打电话</a>
                </div>
                <div class="between wx">
                    <i class="flex center bls bls-wx" style="width:1.6rem;color:#4ba601;"></i>
                    <div class="flex center number"><span></span></div>
                    <a href="javascript:;" class="flex center n-btn book">加微信</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "header"
    }
</script>
