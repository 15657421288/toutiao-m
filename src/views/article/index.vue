<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- :is_followed="article.is_followed" -->
          <!--  @updete-is_followed="article.is_followed=$event" -->
          <follow-user
            v-model="article.is_followed"
            :user-id="article.aut_id"
            class="follow-btn"
          ></follow-user>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="isFollowLoading"
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
            :loading="isFollowLoading"
            @click="onFollow"
          >关注</van-button>-->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          @click-reply="onReplyClick"
          type="a"
        />
        <!-- /文章评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <collect-article
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <like-article
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
      </div>

      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant'
import './github-markdown.css'
// import { addFollow, deleteFollow } from '@/api/user'
// import { delete } from 'vue/types/umd'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentPost from './components/comment-post'
import CommentList from './components/comment-list'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentPost,
    CommentList,
    CommentReply // 存储当前点击回复的评论对象
  },
  // 给所有的后代组件提供数据
  // 注意：不要滥用
  provide: function() {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading 状态
      errStatus: 0, // 失败状态码
      isFollowLoading: false,
      isPostShow: false, // 控制底部弹出层
      totalCommentCount: 0, // 控制发布评论的显示状态
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {} // 当前点击回复的评论项
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      // 展示 loading 加载中
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        //  if (Math.random() > 0.5) {
        //   JSON.parse('dsankljdnskaljndlkjsa')
        // }
        // console.log(data)
        this.article = data.data
        // setTimeout(() => {
        //   this.previewImage()
        // }, 0)

        this.loading = false
        this.$nextTick(() => {
          this.previewImage()
        })
      } catch (err) {
        // 加载失败 404
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('获取失败')
      }
      // 无论成功或失败,都关闭loging
      this.loading = false
    },
    previewImage() {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')

      // console.log(imgs)
      // 获取所有 img 地址

      const images = []
      imgs.forEach((item, index) => {
        images.push(item.src)
        // 给每个 img 注册点击事件，在处理函数中调用预览

        item.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从 0 开始
            startPosition: index
          })
        }
      })
    },

    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick(comment) {
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
  .van-icon-cross {
    color: #fff !important;
  }
}
</style>
