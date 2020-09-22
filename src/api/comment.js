/**
 * 评论请求模块
 */
import request from '@/utils/request.js'

// 点赞
export const addLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target
    }
  })
}

// 取消点赞
export const deleteLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${target}`
  })
}

// 获取评论
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}

// 对评论或评论回复点赞
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

// 取消对评论或评论回复点赞
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`
  })
}

// 添加评论或评论回复
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
