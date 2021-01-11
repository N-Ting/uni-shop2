export default {
  // 开启命名空间
 namespaced: true,
  
  // state 数据
    state: () => ({
      // 收货地址
      // 从本地存储中获取地址信息，有信息就获取，没有就为一个空对象
      address:JSON.parse(uni.getStorageSync('address') || '{}')
    }),

  // 方法
  mutations:{
    // 更新收货地址
    updateAddress(state,address){
      state.address = address
      this.commit('m_user/saveAddressToSrorage')
    },
    // 地址持久化
    saveAddressToSrorage(state) {
      // 将地址信息储存到本地存储中
      uni.setStorageSync('address',JSON.stringify(state.address))
    }
  },
  getters:{
    addStr(state){
      // 判断省份是否存在，如果不存在，直接返回一个空字符串
      if(!state.address.provinceName) return ''
      // 将省份城市区详细地址拼接起来
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  },
}