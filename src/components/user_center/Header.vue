<template>
    <div class="flexv sub">
        <div class="flexitem centerv userbox">
            <div class="userimg">
                <img :src="user.avatar" class="fitimg">
            </div>
            <div class="flexitemv info">
                <div class="flex name">
                    <h2 class="flex center">{{user.nickname}}</h2>
                </div>
                <p class="flex lock" v-if="!user.is_member"><span>未开通试用会员</span></p>
                <template v-else>
                    <p class="vip">正式会员</p>
                    <p class="flex lock">
                      有效期至：
                      <span v-if="user.type == 1">永久</span>
                      <span v-else>{{moment(user.member_lock_at).format("YYYY-MM-DD")}}</span>
                    </p>
                </template>
            </div>
            <router-link to="/open_member" class="flex center renew" v-if="!user.type">{{user.is_member ? "续费会员" : "开通VIP"}}</router-link>
        </div>

        <div class="flexv centerv around front">
            <router-link :to="'/articles/' + user.id" class="flexitemv center myfront" @click="notMember">
                <em class="flex">{{center.article_count}}</em>
                <div class="flex">
                    <span class="flex center">我的头条</span>
                    <i class="flex center bls bls-yjt"></i>
                </div>
            </router-link>
            <div class="flex line"></div>
            <router-link to="/footprint" class="flexitemv center myfront">
                <em class="flex">{{center.footprint_count}}</em>
                <div class="flex">
                    <span class="flex center">谁查看我的头条 </span>
                    <i class="flex center bls bls-yjt"></i>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui'

    export default {
        name: "user_center_header",
        props: {
            center: Object
        },
        data () {
            return {

            }
        },
        computed: {
            user() {
                return this.$store.state.user
            }
        },
        methods: {
            notMember () {
                Toast({
                    message: '你尚未开通会员',
                    duration: 1500
                });
                //跳转到开通会员页面
                setTimeout(function () {
                    this.$route.push('open_member')
                }, 1500)
            }
        }
    }
</script>
