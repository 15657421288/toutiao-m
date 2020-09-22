<template>
  <div class="update-avatar">
    <img class="img" :src="img" ref="img" />
    <div class="toolbar">
      <span @click="$emit('close')">取消</span>
      <span @click="onConfirm">完成</span>
    </div>
  </div>
</template>
<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user.js'
export default {
  name: 'UpdataPhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      retuired: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  computend: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: 'move', // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false // 关闭默认背景
      // movable: true // 拖动，默认值，可不配置
    })
  },
  methods: {
    onConfirm() {
      //   console.log(this.cropper.getData());
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto(blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        this.$emit('close')
        this.$emit('update-photo', data.data.photo)
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
      // this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
.update-avatar {
  background: #000;
  width: 100%;
  height: 100%;
  .toolbar {
    position: fixed;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
