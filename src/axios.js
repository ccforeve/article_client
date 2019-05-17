import router from './router'
import axios from 'axios'
import {throwErr} from './utils'  //utils 捕捉服务端http状态码的方法
import {getCookie} from "./cookie"
import {Toast} from 'mint-ui'

const Axios = axios.create({
  baseURL: "https://stl.yxcxin.com/api", // 基础URL
  // timeout: 10000,
  responseType: "json",
  headers: {}
})

//过滤请求
Axios.interceptors.request.use(config => {
  //config 为请求的一些配置 例如：请求头 请求时间 Token  可以根据自己的项目需求个性化配置，参考axios的中文说明手册  自己多动动手
  //由于我们项目的后端大大给力，很多东西在服务端帮我们处理好了所以请求阶段只要传好参数就好了
  let token = getCookie('token')
  if (token) {
    config.headers.Authorization = token
  }

  return config
}, error => {
  return Promise.reject(error)
})

// 添加响应拦截器
Axios.interceptors.response.use(
    response => {
      if (response.data) {
        return Promise.resolve(response.data) //使用Promise.resolve 正常响应
      } else if (response.status !== 200) {
        return Promise.reject(response.data)
      }
    },
    error => {
      if (error && error.response) {
        let res = {},
            errors = error.response.data.errors
        res.code = error.response.status
        if (res.code === 401) {      //操作时检测登录是否过期
          Toast({message: '登录已失效', duration: 1000})
          setTimeout(function () {
            router.push({path: '/', query: {redirect: window.location.pathname}})
          }, 1000)
        }
        if(errors) {
          return Promise.reject(errors)
        }
        res.msg = throwErr(error.response.status, error.response) //throwErr 捕捉服务端的http状态码 定义在utils工具类的方法
        return Promise.reject(res)
      }
      return Promise.reject(error)
    }
)

export default function request(method, url, data) {  //暴露 request 给我们好API 管理
  if (method === 'post') {
    return Axios.post(url, data)    //axios的post 默认转化为json格式
  } else if (method === 'get') {
    return Axios.get(url, {
      params: data
    })
  } else if (method === 'patch') {
    return Axios.patch(url, data)
  } else if (method === 'delete') {
    return Axios.delete(url, {
      params: data
    })
  }
}
