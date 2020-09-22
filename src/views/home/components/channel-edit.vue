<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <van-button
        size="mini"
        round
        type="danger"
        plain
        @click="isEditShow=!isEditShow"
      >{{isEditShow?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(channelItem, index) in myChannels"
        :key="index"
        :text="channelItem.name"
        icon="close"
        @click="onMyChannelClick(channelItem,index)"
      >
        <span class="text" :class="{ active: active === index }" slot="text">{{ channelItem.name }}</span>
        <!-- 通过插槽自定义图标 -->
        <van-icon v-show="isEditShow && index!==0" slot="icon" name="close" />
      </van-grid-item>
    </van-grid>
    <van-cell title="频道推荐" :border="false"></van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="channel in recommendChannels"
        :key="channel.id"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannele,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道
      isEditShow: false // 控制编辑状态
    }
  },
  computed: {
    recommendChannels() {
      return this.allChannels.filter(
        (channel) =>
          !this.myChannels.find((myChannel) => myChannel.id === channel.id)
      )
    },
    // 获取user
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannele()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    // 添加操作
    onAddChannel(channel) {
      // this.myChannels.push(channel)
      this.$emit('add-channel', channel)
      if (this.user) {
        // 已登录
        try {
          // 已登录，数据存储到线上
          addUserChannel({
            id: channel.id, // 频道 id
            seq: this.myChannels.length // 频道的 序号
          })
          this.$toast('添加成功')
        } catch (err) {
          this.$toast('保存失败')
        }
      } else {
        // 未登陆
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 点击我的频道
    onMyChannelClick(channelItem, index) {
      if (this.isEditShow) {
        // 执行删除操作
        this.$emit('del-active', channelItem, index)
        // 删除数据持久化
        this.deleteChannel(channelItem)
      } else {
        // 执行跳转操作
        this.$emit('update-active', index)
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('删除频道失败,请稍后重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  .van-grid {
    display: flex;
    flex-wrap: wrap;
    .van-grid-item {
      width: 25%;
      padding: 5px;
    }
  }
  /deep/ .recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      color: #222;
      .van-icon {
        font-size: 24px;
      }

      .van-grid-item__text {
        font-size: 28px;
        margin-top: 0;
      }
    }
  }
  /deep/ .van-icon-close {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 36px;
    color: #ccc;
  }
  /deep/ .van-grid-item__content {
    background-color: #f5f5f6;
    .van-grid-item__text,
    .text {
      color: #222;
      font-size: 28px;
      white-space: nowrap;
    }

    .active {
      color: red;
    }
  }
  .channel-item {
    height: 86px;
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text {
        color: #222;
        font-size: 28px;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
}
</style>
