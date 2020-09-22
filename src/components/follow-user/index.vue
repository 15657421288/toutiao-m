<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
  >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
  >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  components: {},
  model: {
    prop: 'isFollowed',
    event: 'updete-is_followed'
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  created() {},
  methods: {
    async onFollow() {
      // console.log(this.isFollowed)
      this.loading = true
      try {
        // 如果已关注，则取消关注
        if (this.isFollowed) {
          await deleteFollow(this.userId)
        } else {
          // 否则添加关注
          await addFollow(this.userId)
        }
        // 更新视图
        // this.article.is_followed = !this.article.is_followed
        this.$emit('updete-is_followed', !this.isFollowed)
      } catch (err) {
        // console.log(err)
        let message = '操作失败，请重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
