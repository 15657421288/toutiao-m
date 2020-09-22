<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @cancel="$emit('close')"
      @change="onChange"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user.js'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      gender: this.value
    }
  },
  computend: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onChange(picker, value, index) {
      this.gender = index
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        await updateUserProfile({
          gender: this.gender
        })
        // 更新视图
        this.$emit('input', this.gender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast('更新成功')
      } catch (err) {
        this.$toast('更新失败')
      }
    }
  }
}
</script>
<style lang='less' scoped>
</style>
