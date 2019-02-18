<template>
    <div id="contact" class="flexv wrap">
        <div class="flexv mainbox">
            <div class="flexv center sub">
                <div class="userimg">
                    <img :src="data.user.avatar" class="fitimg">
                </div>
                <h2 class="flex center name">{{data.user.nickname}}</h2>
                <p class="several">共阅读你的头条<em class="color">{{data.read_count}}</em>次，分享<span class="color">{{data.share_count}}</span>次</p>
                <p class="time">最近访问<em class="color">{{data.last_visit}}</em>。</p>
            </div>
        </div>
        <div class="flexitemv center">
            <div class="flexv center text">
                <i class="flex center bls bls-bottom"></i>
                <p>根据事业爆文人脉分析，</p>
                <p>此客户可能是你的{{data.relationship}}。</p>
            </div>
            <div class="flex center relation">
                <div class="img">
                    <img :src="my_avatar" class="fitimg">
                </div>
                <i class="flex center bls bls-xianlu"></i>
                <div class="img">
                    <img :src="data.user.avatar" class="fitimg">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { footprintFind } from '../../api.js'
    import { FulfillingBouncingCircleSpinner } from 'epic-spinners'

    export default {
        name: "Connection",
        data () {
            return {
                has_data: false,
                user_id: this.$route.params.user_id,
                data: {user: {}}
            }
        },
        watch: {
            '$route' (to, from) {
                this.message_id = to.params.id
            }
        },
        computed: {
            my_avatar () {
                return this.$store.state.user.avatar
            }
        },
        activated () {
            let _this = this
            let detail = footprintFind(this.user_id)
            detail.then(function (data) {
                _this.has_data = true
                _this.data = data
            })
        }
    }
</script>
