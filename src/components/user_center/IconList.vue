<template>
    <div class="flexv func">
        <router-link to="/user/basic" class="flexitem centerv card">
            <i class="flex center bls bls-mp" style="background:#fbc45d; "></i>
            <span class="flex center text">设置名片</span>
        </router-link>
        <router-link to="/invitation" class="flexitem centerv">
            <i class="flex center bls bls-jhy" style="background:#67cef9; "></i>
            <span class="flex center text">邀请好友<span>（可得30%佣金）</span></span>
        </router-link>
        <router-link to="/profit" class="flexitem centerv tg">
            <i class="flex center bls bls-generalize" style="background:#35f921; "></i>
            <span class="flex center text">推广中心</span>
        </router-link>
        <router-link to="/message" class="flexitem centerv tg">
            <i class="flex center bls bls-consult" style="background:#ffc0cb"></i>
            <span class="flex center text">留言管理</span>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "IconList"
    }
</script>
