<template>
  <div class="like-article">
    <van-icon
      :color="value===1 ? '#e5645f' : ''"
      :name="value===1 ? 'good-job' : 'good-job-o'"
      @click="onLike"
      :loading="loading"
    />
  </div>
</template>
<script>
import { addLike, deleteLike } from '@/api/comment.js'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
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
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLike() {
      this.loading = true
      let status = -1
      try {
        if (this.value === 1) {
          await deleteLike(this.articleId)
        } else {
          await addLike(this.articleId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
        // this.$emit('input', this.value === 1 ? -1 : 1)
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
      }
      this.loading = false
    }
  }
}
</script>
<style lang='less' scoped>
</style>
