<template>
  <van-icon
    :color="value ? '#ffa500' : ''"
    :name="value ? 'star' : 'star-o'"
    @click="onCollect"
    :loading="loading"
  />
</template>
<script>
import { addCollect, deleteCollect } from '@/api/article.js'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
      requered: true
    },
    articleId: {
      type: [Number, String, Object],
      requered: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computend: {},
  watch: {
    value() {
      this.$toast.success(this.value ? '收藏成功' : '取消收藏')
    }
  },
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      // console.log(this.articleId)
      this.loading = true
      try {
        if (this.value) {
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        this.$emit('input', !this.value)
      } catch (err) {
        this.$toast.fail('操作失败！请重试')
      }
      this.loading = false
    }
  }
}
</script>
<style lang='less' scoped>
</style>
