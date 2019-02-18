<template>
      <div
      id="appraisal"
      class="flexv wrap"
    >
      <div class="head-img"><img
          src="../../assets/image/health.png"
          class="fitimg"
        ></div>

      <div class="flex center btn">
        <router-link :to="'/consultation/vip_chart/' + this.$route.params.user_id" class="flex center">马上测评</router-link>
        </div>
      <p class="flex center tex">已有<span>{{count}}</span>人测评</p>
    </div>
</template>
<script>
import { getFamilyMessageCount } from '../../api.js'

export default {
    data() {
        return {
            count: 0
        }
    },
    activated () {
        let _this = this
        let family_message = getFamilyMessageCount()
        family_message.then(function (res) {
            _this.count = res.count
        }).catch(function (e) {
            console.log(e)
        })
    }
}
</script>

