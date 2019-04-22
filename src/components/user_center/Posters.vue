<template>
    <div class="picture" style="padding-bottom: 15px">
        <div class="between title">
            <div class="tex">展业美图</div>
            <router-link to="/poster" class="flex center more">更多 <i class="flex center bls bls-yjt"></i></router-link>
        </div>
        <div class="flex imgbox">
            <router-link :to="'/poster/detail/' + item.id" class="flex center" style="width:24%;height:100%;padding-left:1rem;" v-for="(item, index) of posters" :key="index">
                <img class="lazy" :src="item.image_url" width="100%" height="100%" style="max-width: 100%">
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Posters",
        props: ['posters']
    }
</script>
