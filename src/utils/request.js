/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
import jsonBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 接口基础路径
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [
    function(data) {
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data)
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data
        }
      }
    }
  ]
})
// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  function(resp) {
    return resp
  },
  async function(error) {
    console.dir(error)
    // 如果401 代表登录超时
    if (error.response && error.response.status === 401) {
      // router.push('/login') 需要导入 router ,用户体验差
      const refreshToken = store.state.user.refresh_token
      console.log(refreshToken)

      const ret = await axios({
        method: 'put',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: 'Bearer ' + refreshToken
        }
      })
      store.commit('setUser', {
        token: ret.data.data.token,
        refresh_token: refreshToken
      })
      // 刷新页面
      return request(error.config)
    }
    return Promise.reject(error)
  }
)

export default request
