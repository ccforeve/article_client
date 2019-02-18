<template>
    <div class="loading" v-if="!has_data">
        <div class="loading-icon">
            <fulfilling-bouncing-circle-spinner
                    :animation-duration="4000"
                    :size="60"
                    color="#ff1d5e"
            />
        </div>
    </div>
    <div id="focus" class="flexv wrap redbag" v-else>
        <div class="flexitemv mainbox datum">

            <user-center-header :center="center"></user-center-header>

            <center-icons></center-icons>

            <center-posters :posters="posters"></center-posters>
        </div>

        <center-footer></center-footer>

        <!--提示关注公众号-->
        <!--<subscribe-alert @subscribe="subscribe" v-if="!is_subscribe"></subscribe-alert>-->
    </div>
</template>

<script>
    import UserCenterHeader from '@/components/user_center/Header.vue'
    import CenterIcons from '@/components/user_center/IconList.vue'
    import CenterPosters from '@/components/user_center/Posters.vue'
    import SubscribeAlert from '@/components/user_center/SubscribeAlert.vue'
    import CenterFooter from "@/components/common/Footer.vue"
    import {getUserInfo, getUserCenter, randPoster} from '../api.js'
    import { FulfillingBouncingCircleSpinner } from 'epic-spinners'

    export default {
        name: "UserCenter",
        components: {
            UserCenterHeader,
            CenterIcons,
            CenterPosters,
            SubscribeAlert,
            CenterFooter,
            FulfillingBouncingCircleSpinner,
        },
        data () {
            return {
                has_data: false,
                center: {},
                posters: {}
            }
        },
        created () {
            let _this = this
            let posters = randPoster(4)
            posters.then(function (res) {
                _this.posters = res
                _this.has_data = true
            })
        },
        activated () {
            this.getDate()
        },
        computed: {
            is_subscribe () {
                return this.$store.state.user.is_subscribe ? true : false
            }
        },
        methods: {
            subscribe () {
                let user = getUserInfo()
                user.then(function (res) {
                    let new_user = JSON.parse(localStorage.user)
                    new_user.is_subscribe = res.is_subscribe
                    localStorage.user = JSON.stringify(new_user)
                })
            },
            getDate () {
                let _this = this
                let center = getUserCenter()
                center.then(function (res) {
                    _this.center = res
                })
            },
        }
    }
</script>

<style scoped>
    .datum{padding-bottom: 63px;}
</style>
