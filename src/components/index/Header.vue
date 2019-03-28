<template>
    <div class="flexitemv box">
        <!--<div class="flex center nav">-->
            <!--<span-->
                <!--class="flex center item"-->
                <!--v-for="(item, index) of categories"-->
                <!--:key="index"-->
                <!--:class="{current: active == index}"-->
            <!--&gt;-->
                <!--<span class="flex center" @click="changeActive(index, item.id)">{{item.title}}</span>-->
            <!--</span>-->
        <!--</div>-->
        <!--<form action="" method="get" id="search">-->
            <!--<div class="flex center search">-->
                <!--<div class="flex centerv home-sea">-->
                    <!--<input type="text" name="key" class="flexitem sea-text" placeholder="输入关键字，找文章111">-->
                    <!--<i class="flex smtxt"></i>-->
                    <!--<span class="flex center bls bls-fdj submit"></span>-->
                <!--</div>-->
            <!--</div>-->
        <!--</form>-->
    </div>
</template>

<script>
    export default {
        name: "IndexHeader",
        props: {
            categories: Array
        },
        data () {
            return {
                active: 0
            }
        },
        methods: {
            changeActive: function (index, id) {
                this.active = index
                this.$emit('handleChange', id)
            }
        }
    }
</script>
