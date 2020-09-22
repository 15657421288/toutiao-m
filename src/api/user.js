import request from '@/utils/request.js'
// import store from '@/store'

export const login = data => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  })
}

export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // 发送请求头数据
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   //       token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
/**
 * 获取用户自己的信息
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
/**
 * 添加关注
 */
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target
    }
  })
}
/**
 * 取消关注
 */
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${target}`
  })
}

/**
 * 获取用户个人资料
 */
// 获取指定用户信息
export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}
