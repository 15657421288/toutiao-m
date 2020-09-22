<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>

    <!-- 滑动导航栏 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="(channel, index) in channels" :key="index" :title="channel.name">
        <article-list :channel="channel" />
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn">
        <i class="toutiao toutiao-gengduo" @click="isChannelEditShow = true"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isChannelEditShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <!-- 传递channels -->
      <!-- 传递channels 传递active高亮索引-->
      <channel-edit
        :active="active"
        :myChannels="channels"
        @update-active="onUpdateActive"
        @del-active="delIndex"
        @add-channel="addIndex"
      />
    </van-popup>
  </div>
</template>

<script>
// 1. 导入 获取频道列表的方法
import { getUserChannels } from '@/api/user.js'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'
export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0,
      // 4. 定义数据接收频道列表
      channels: [],
      isChannelEditShow: false // 控制弹窗
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    // 3. 调用获取频道列表
    this.loadChannels()
  },
  mounted() {},
  methods: {
    // 2. 定义加载频道列表数据的方法
    async loadChannels() {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        // let channels = []
        if (this.user) {
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            this.channels = localChannels
          } else {
            const { data } = await getUserChannels()
            this.channels = data.data.channels
          }
        }
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    // 添加我的频道
    addIndex(channel) {
      this.channels.push(channel)
    },
    // 跳转我的频道
    onUpdateActive(index) {
      this.active = index
      this.isChannelEditShow = false
    },
    // 删除我的频道
    delIndex(channelItem, index) {
      if (index === 0) return
      if (index <= this.active) {
        this.active -= 1
      }
      this.channels.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 180px;
  padding-bottom: 100px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 2;
      width: 100%;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
    }

    .van-tab--active .van-tab__text {
      color: #333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
  .edit-channel-popup {
    padding-top: 100px;
    box-sizing: border-box;
  }
}
</style>
