import axios from 'axios'
import store from '@/store'
import { Toast ,Dialog } from 'vant'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})


service.interceptors.request.use(
  config => {
    if (!config.hideloading) {
      Toast.loading({
        forbidClick: true,
        message: '加载中...',
        duration:0
      })
    }
    // if (store.getters.token) {
    //   config.headers['X-Token'] = ''
    // }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      return Promise.reject(res || 'error')
    } else {
        //session 超时
        if (res.code === 0) {
            store.dispatch('user/logOut')
            return Promise.reject(res.error)
        }
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
