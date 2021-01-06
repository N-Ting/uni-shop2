import Vue from 'vue'
import App from './App'
// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'

Vue.config.productionTip = false
// 将按需导入的 $http 挂载到 uni顶级对象之上，方便全局调用
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'
// 请求拦截器
// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  // 请求发送之前展示loading状态
  uni.showLoading({
      title: '数据加载中...',
    })
}
// 响应拦截器
// 请求完成之后做一些事情
$http.afterRequest = function () {
  // 隐藏loading效果
  wx.hideLoading()
}
uni.$showMsg=function(title="数据加载失败!",duration=1500){
   uni.showToast({
    title,
    duration,
    icon:'none'
  })
}
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
