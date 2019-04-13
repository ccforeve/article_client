<template>
  <div class="listbox">
    <div class="between title">
      <div class="flex center text"></div>
      <div class="flex centerv change" @click="changePosterList"><i class="flex center bls bls-change"></i>换一批</div>
    </div>
    <ul class="fwrap list" id="rand_list">
      <li class="item" v-for="(item, index) of posters" :key="index">
        <!--                <router-link :to="'/poster/detail/' + item.id" class="flex link center" style="height: 15rem">-->
        <!--                    <img :src="item.image_url" width="100%">-->
        <!--                </router-link>-->
        <p class="flex link center" style="height: 15rem" @click="changePoster(item.id)">
          <img :src="item.image_url" width="100%">
        </p>
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
      changePosterList() {
        this.$emit('changePosterList')
      },
      changePoster (id) {
        this.$emit('changePoster', id)
      }
    }
  }
</script>
