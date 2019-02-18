<template>
    <div class="listbox">
        <div class="between title">
            <div class="flex center text"></div>
            <div class="flex centerv change" @click="changePoster"><i class="flex center bls bls-change"></i>换一批</div>
        </div>
        <ul class="fwrap list" id="rand_list">
            <li class="item" v-for="(item, index) of posters" :key="index">
                <router-link :to="'/poster/detail/' + item.id" class="flex link center" style="height: 15rem">
                    <img :src="item.image_url" width="100%">
                </router-link>
                <p class="flex center name">{{item.title}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Detail",
        props: ['posters'],
        methods: {
            changePoster () {
                this.$emit('changePoster')
            }
        }
    }
</script>
