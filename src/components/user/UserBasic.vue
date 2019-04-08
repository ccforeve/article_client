<template>
  <div
    id="basic"
    class="flexv wrap"
  >
    <form
      action=""
      id="form"
      method="post"
      v-if="is_show_upload"
    >
      <div class="flexitemv user">
        <div class="users">
          <div class="item portrait">
            <span class="flex centerv">头像</span>
            <div class="flex centerv right">
              <label
                class="previewStyle"
                for="qrcode"
              >
                <div style="width: 132px;height: 132px">
                  <img
                    :src="image_url.avatar"
                    width="100%"
                    style="border-radius: 50%"
                  >
                </div>
              </label>
              <input
                type="hidden"
                ref="avatar"
                :value="image_url.avatar"
              >
              <input
                type="file"
                id="qrcode"
                :value="imgFile"
                style="position:absolute; clip:rect(0 0 0 0);"
                accept="image/*"
                @change="uploadImg($event, 'avatar')"
              >
              <i class="flex center bls bls-yjt"></i>
            </div>
          </div>
          <div class="item name">
            <span class="flex centerv">姓名</span>
            <div class="flex centerv right">
              <input
                type="text"
                ref="nickname"
                class="flexi center userimg"
                :value="user.nickname"
                maxlength="11"
              >
              <i class="flex center bls bls-yjt"></i>
            </div>
          </div>
          <div class="item phone">
            <span class="flex centerv">手机号</span>
            <div class="flex centerv right">
              <input
                type="tel"
                ref="phone"
                class="flex center userimg"
                :value="user.phone"
              >
              <i class="flex center bls bls-yjt"></i>
            </div>
          </div>
          <div class="item phone">
            <span class="flex centerv">微信号</span>
            <div class="flex centerv right">
              <input
                type="text"
                ref="wechat"
                class="flex center userimg"
                :value="user.wechat"
              >
              <i class="flex center bls bls-yjt"></i>
            </div>
          </div>
        </div>
        <div class="users">
          <div class="item area">
            <span class="flex centerv">职业</span>
            <div class="flex centerv right">
              <input
                ref="profession"
                class="flex center userimg"
                type="text"
                :value="user.profession"
              >
              <i class="flex center bls bls-yjt"></i>
            </div>
          </div>
          <div class="item area">
            <span class="flex centerv">从业地区</span>
            <div class="flex centerv right">
              <input
                ref="employed_area"
                class="flex center userimg"
                type="text"
                placeholder="请选择"
                :value="user.employed_area"
                @click="showPacker"
              >
              <i class="flex center bls bls-yjt"></i>
            </div>
          </div>
        </div>
        <div class="users">
          <div class="item qrcode">
            <span class="flex centerv">个人微信二维码</span>
            <div class="flex centerv right">
              <label
                class="previewStyle"
                for="avatar"
              >
                <div style="width: 132px;height: 132px">
                  <img
                    :src="image_url.qrcode"
                    width="100%"
                  >
                </div>
              </label>
              <input
                type="hidden"
                ref="qrcode"
                :value="image_url.qrcode"
              >
              <input
                type="file"
                id="avatar"
                :value="imgFile"
                style="position:absolute; clip:rect(0 0 0 0);"
                accept="image/*;"
                @change="uploadImg($event, 'qrcode')"
              >
              <i class="flex center bls bls-yjt"></i>
            </div>
          </div>
        </div>
        <router-link
          to="/index"
          class='clook'
        >查看如何获取二维码？</router-link>
        <div class="button">
          <a
            class="flex center"
            @click="updateSubmit"
          >保存</a>
        </div>
      </div>
    </form>
    <upload-image
      :option="option"
      category="avatar"
      @isShowUpload="isShowUpload"
      @imagePath="getUploadImage"
      v-else-if="upload_category == 'avatar'"
    ></upload-image>

    <upload-image
      :option="option"
      @isShowUpload="isShowUpload"
      category="qrcode"
      @imagePath="getUploadImage"
      v-else-if="upload_category == 'qrcode'"
    ></upload-image>

    <animation>
      <div
        class="city-picker"
        v-show="is_picker_show"
      >
        <div class="picker-head">
          <div
            class="picker-head-left"
            @click="showPacker"
          >取消</div>
          <div class="picker-head-center">从业地区</div>
          <div
            class="picker-head-right"
            @click="confirm"
          >确定</div>
        </div>
        <mt-picker
          :slots="myAddressSlots"
          @change="onMyAddressChange"
        ></mt-picker>
      </div>
    </animation>
    <div
      class="alertBox"
      v-if="message"
    >
      <span>请填写：{{message}}</span>
    </div>
  </div>
</template>

<script>
import UploadImage from "@/components/common/UploadImage";
import { Picker, Popup, Indicator } from "mint-ui";
import myaddress from "../../assets/js/city.json";
import Animation from "@/components/fade/PickerAnimation.vue";
import { UpdateUserInfo } from "../../api.js";

export default {
  name: "user_basic",
  components: {
    UploadImage,
    Animation,
    "mt-picker": Picker,
    "mt-popup": Popup
  },
  data() {
    return {
      message: "",
      // user: this.$store.state.user,
      is_show_upload: true,
      upload_category: "",

      //剪切图片上传
      image_url: {
        avatar: JSON.parse(localStorage.user).avatar,
        qrcode: JSON.parse(localStorage.user).wechat_qrcode
      },
      option: {
        img: this.img,
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false, //输出原图比例截图 props名full
        outputType: "png",
        original: false,
        canMoveBox: false,
        autoCrop: true,
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true
      },
      imgFile: "",

      //地区选择
      is_picker_show: false,
      myAddressSlots: [
        {
          flex: 1,
          defaultIndex: 1,
          values: Object.keys(myaddress), //省份数组
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: [],
          className: "slot5",
          textAlign: "center"
        }
      ],
      myAddressProvince: "",
      myAddressCity: "",
      myAddresscounty: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    this.$nextTick(() => {
      //vue里面全部加载好了再执行的函数  （类似于setTimeout）
      this.myAddressSlots[0].defaultIndex = 0;
      // 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
      //因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
    });
  },
  methods: {
    isShowUpload() {
      this.is_show_upload = !this.is_show_upload;
    },
    getUploadImage(value) {
      console.log(value);
      this.image_url[value.cate] = value.path;
    },
    //选择本地图片
    uploadImg(e, type) {
      var _this = this;
      _this.upload_category = type;
      _this.is_show_upload = !_this.is_show_upload;
      //上传图片
      var file = e.target.files[0];
      _this.fileName = file.name;
      if (
        !/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG|WebP|BPM)$/.test(e.target.value)
      ) {
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data = e.target.result;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        }
        _this.option.img = data;
      };
      // 转化为base64
      reader.readAsDataURL(file);
      // 转化为blob
      // reader.readAsArrayBuffer(file);
    },

    onMyAddressChange(picker, values) {
      picker.setSlotValues(1, Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
      picker.setSlotValues(2, myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
      this.myAddressProvince = values[0];
      this.myAddressCity = values[1];
      this.myAddresscounty = values[2];
    },
    showPacker() {
      this.is_picker_show = !this.is_picker_show;
    },
    confirm() {
      this.is_picker_show = !this.is_picker_show;
      this.user.employed_area =
        this.myAddressProvince +
        " " +
        this.myAddressCity +
        " " +
        this.myAddresscounty;
    },
    messHide() {
      let _this = this;
      setTimeout(function() {
        _this.message = "";
      }, 1000);
    },
    //提交表单
    updateSubmit() {
      let _this = this;
      let from = this.$refs;
      let arr = {};

      for (var i in from) {
        arr[i] = from[i].value;
      }
      if (!arr.nickname) {
        this.message = "姓名";
        this.messHide();
        return false;
      }
      if (!arr.phone) {
        this.message = "手机号";
        this.messHide();
        return false;
      }
      if (!arr.wechat) {
        this.message = "微信号";
        this.messHide();
        return false;
      }
      let update_info = UpdateUserInfo(arr);
      Indicator.open("正在修改...");
      update_info
        .then(function(res) {
          let new_user = JSON.parse(localStorage.user);
          new_user.avatar = arr.avatar;
          new_user.nickname = arr.nickname;
          new_user.wechat = arr.wechat;
          new_user.phone = arr.phone;
          new_user.profession = arr.profession;
          new_user.employed_area = arr.employed_area;
          new_user.wechat_qrcode = arr.qrcode;
          localStorage.user = JSON.stringify(new_user);
          _this.$store.commit("setTokenAndUser", JSON.parse(localStorage.user));
          Indicator.close();
          _this.$router.push("/user");
        })
        .catch(function(e) {
          Indicator.close();
          console.log(e);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../node_modules/mint-ui/lib/style.css");

.city-picker {
  z-index: 20;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #e6e6e6;
  .picker-head {
    height: 45px;
    line-height: 45px;
    font-size: 1.2rem;
    background: #fff;
    .picker-head-left,
    .picker-head-center,
    .picker-head-right {
      float: left;
      width: 33.33%;
      text-align: center;
    }
    .picker-head-left,
    .picker-head-right {
      color: #3b8adf;
    }
    .picker-head-center {
      font-size: 1.4rem;
      font-weight: bold;
    }
  }
}

.mint-popup-top {
  width: 100%;
  text-align: center;
  line-height: 65px;
  font-size: 1.4rem;
  color: #fff;
  opacity: 0.7;
  background: #333;
}

.previewStyle {
  width: 150px;
  height: 150px;
  overflow: hidden;
  margin: 0;
  border-radius: 50%;
  zoom: 0.4;
}

.alertBox {
  position: fixed;
  width: 70%;
  top: 10%;
  margin: 0 auto;
  margin-left: 15%;
  z-index: 100;
  background: antiquewhite;
  height: 7rem;
  font-size: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-radius: 1rem;
}
</style>
