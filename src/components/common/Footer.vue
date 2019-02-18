<template>
    <div class="flex tabbars">
        <div class="flexitem center middle">
            <router-link to="/index" class="flexv center user">
				<span class="flex userimg">
					<img class="fitimg" :src="user_avatar"/>
				</span>
                <em class="flex center">首页</em>
            </router-link>
        </div>
        <router-link to="/visitor" class="flexv center item">
            <i class="flex center bls bls-fkjl" :class="{'fk': new_visitor}"></i>
            <em class="flex center">访客记录</em>
        </router-link>
        <router-link to="/open_member" class="flexv center item">
            <i class="flex center bls bls-zfkt"></i>
            <em class="flex center">支付开通</em>
        </router-link>
        <router-link to="/user" id="data" class="flexv center item">
            <i class="flex center bls bls-grzx"></i>
            <em class="flex center">个人中心</em>
        </router-link>
    </div>
</template>

<script>
    import {ifNewVisitor} from '../../api.js'

    export default {
        name: "Footer",
        computed: {
            new_visitor () {
                return this.$store.state.check_visitor
            },
            user_avatar () {
                return this.$store.state.user.avatar
            }
        },
        activated () {
            let _this = this
            if(!_this.$store.state.check_visitor) {
                let check = ifNewVisitor()
                check.then(function (res) {
                    if(res.data) {
                        _this.$store.commit('checkVisitor')
                    }
                })
            }
        }
    }
</script>
