<template>
    <div class="loading" v-if="!option.img">
        <fulfilling-bouncing-circle-spinner
                :animation-duration="4000"
                :size="60"
                color="#ff1d5e"
        />
    </div>
    <div class="info-item" v-else>
        <div class="header">
            <div class="button-cancel" @click="cancelUpload">
                <span class="btn btn-orange">取消</span>
            </div>
            <div class="button-upload" @click="finish">
                <input type="button" class="btn btn-blue" value="上传头像">
            </div>
        </div>
        <div class="line">
            <div class="cropper-content">
                <div class="cropper">
                    <vueCropper
                        ref="cropper"
                        :img="option.img"
                        :outputSize="option.size"
                        :outputType="option.outputType"
                        :info="true"
                        :full="option.full"
                        :canMove="option.canMove"
                        :canMoveBox="option.canMoveBox"
                        :original="option.original"
                        :autoCrop="option.autoCrop"
                        :autoCropWidth="option.autoCropWidth"
                        :autoCropHeight="option.autoCropHeight"
                        :fixedBox="option.fixedBox"
                    ></vueCropper>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueCropper }  from 'vue-cropper'
    import { uploadImage } from '../../api.js'
    import { Indicator } from 'mint-ui';
    import { FulfillingBouncingCircleSpinner } from 'epic-spinners'

    export default {
        name: "UploadImage",
        props: {
            option: Object,
            category: String
        },
        components: {
            VueCropper,
            FulfillingBouncingCircleSpinner
        },
        data () {
            return {
                fileName:'',  //本机文件地址
            }
        },
        methods: {
            cancelUpload () {
                this.option.img = ''
                this.$emit('isShowUpload')
            },
            //放大/缩小
            changeScale(num) {
                num = num || 1;
                this.$refs.cropper.changeScale(num);
            },
            //坐旋转
            rotateLeft() {
                this.$refs.cropper.rotateLeft();
            },
            //右旋转
            rotateRight() {
                this.$refs.cropper.rotateRight();
            },
            //上传图片（点击上传按钮）
            finish() {
                let _this = this;
                // 输出
                this.$refs.cropper.getCropData((data) => {
                    Indicator.open()
                    let upload = uploadImage({type: _this.category, 'image': data})
                    upload.then(function (res) {
                        Indicator.close()
                        _this.$emit('imagePath', {cate: _this.category, path: res.path})
                        _this.$emit('isShowUpload')
                    })
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    .loading{
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: fixed;
        left: 44%;
        right: 0;
        top: 0;
        bottom: 0;
        text-align: center;
    }
    .info-item {
        z-index: 99;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        .header {
            height: 60px;
            .button-cancel, .button-upload {
                float: left;
                width: 50%;
                line-height: 60px;
                color: #fff;
                font-size: 1.5rem;
                text-align: center;
                background: #3b8adf;
            }
        }
        label {
            display: inline-block;
            width: 100px;
            text-align: right;
        }
        .sel-img-dv {
            position: relative;
            .sel-file {
                position: absolute;
                width: 90px;
                height: 30px;
                opacity: 0;
                cursor: pointer;
                z-index: 2;
            }
            .sel-btn {
                position: absolute;
                cursor: pointer;
                z-index: 1;
            }
        }
    }

    .line{
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin-top: 60px;
    }

    .cropper-content{
        margin: 0 auto;
        .cropper{
            width: 260px;
            height: 260px;
        }
        .show-preview{
            flex: 1;
            -webkit-flex: 1;
            display: flex;
            display: -webkit-flex;
            justify-content: center;
            -webkit-justify-content: center;
            .preview{
                overflow: hidden;
                border-radius: 50%;
                border:1px solid #cccccc;
                background: #cccccc;
                margin-left: 40px;
            }
        }
    }
    .cropper-content .show-preview .preview {margin-left: 0;}
</style>
