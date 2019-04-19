<template>
  <div id='details' class="flexitemv">
    <div class="loading" v-if="!has_data">
      <div class="loading-icon">
        <fulfilling-bouncing-circle-spinner
                :animation-duration="4000"
                :size="60"
                color="#ff1d5e"
        />
      </div>
    </div>
    <div class="info" v-else>
      <div class="p1">
        <span class="">咨询类型：</span>
        <span>{{is_member ? detail.type : '***'}}</span>
      </div>
      <div class="p1">
        <span class="">姓&ensp;&ensp;&ensp;名：</span>
        <span>{{is_member ? detail.name : '***'}}</span>
      </div>
      <div class="p1">
        <span class="">性&ensp;&ensp;&ensp;别：</span>
        <span>{{detail.gender}}</span>
      </div>
      <div class="p1">
        <span class="">手 机 号：</span>
        <span>{{is_member ? detail.phone : detail.phone.substr(0,3) + '********'}}</span>
      </div>
      <div class="p1">
        <span class="">年&ensp;&ensp;&ensp;龄：</span>
        <span>{{is_member ? detail.age : '***'}}</span>
      </div>
      <div class="p1">
        <span class="">地&ensp;&ensp;&ensp;区：</span>
        <span>{{is_member ? detail.region : '***'}}</span>
      </div>
      <div class="p1">
        <span class="">咨询内容：</span>
        <span>{{is_member ? detail.message : '***'}}</span>
      </div>
    </div>
    <!--end-->
    <div class="flexv center qrcode">
      <div class="img">
        <img src="../../assets/image/qrcode.jpg"/>
      </div>
      <p>长按识别二维码</p>
      <p>联系客服咨询</p>
    </div>
    <div class="flexv centerv dredge">
      <router-link to="/open_member" class="flex center button" v-if="!is_member">开通绿叶事业</router-link>
    </div>
  </div>
</template>

<script>
  import {messageDetail} from '../../api.js'
  import {FulfillingBouncingCircleSpinner} from 'epic-spinners'

  export default {
    name: "NormalDetail",
    components: {
      FulfillingBouncingCircleSpinner
    },
    data() {
      return {
        has_data: false,
        message_id: this.$route.params.id,
        detail: {}
      }
    },
    computed: {
      is_member() {
        return this.$store.state.user.is_member
      }
    },
    watch: {
      '$route'(to, from) {
        this.message_id = to.params.id
      }
    },
    activated() {
      let _this = this
      let detail = messageDetail(this.message_id, {type: 'family'})
      detail.then(function (data) {
        _this.has_data = true
        _this.detail = data
      })
    }
  }
</script>
