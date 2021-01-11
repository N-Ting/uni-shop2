export default {
  // 为当前模块开启命名空间
  namespaced:true,
  // 模块中的数据
  state:()=>({
    // 从本地存储中取数据
    cart:JSON.parse(uni.getStorageSync('cart')||'[]')
  }),
  mutations:{
    addToCart(state,goods){
      // 查找cart数组中是否存在这件商品
      // 如果不存在返回的为underfined，否则为找到的商品信息对象
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      // 如果cart数组中不存在这件商品,就往cart数组中添加
      if(!findResult) {
        state.cart.push(goods)
      }else{
        // 如果cart数组中存在这件商品,只需要更新数量
        findResult.goods_count++
      }
      // 无论时增加商品数量还是添加商品,都需要进行数据持久化
      this.commit('m_cart/saveStorage')
    },
    // 持久化购物车数据
    saveStorage(state){
      // 调用uni.setStorageSync()方法,将购物车数据存储到本地存储中
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    },
    // 更新购物车中的勾选状态
    updateGoodsState(state,goods){
      // 根据goods_id查找对应的商品信息
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // 判断findResult是否有值
      if(findResult) {
        // 更新商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 存储到本地存储中
        this.commit('m_cart/saveStorage')
      }
    },
    updateGoodsCount(state,goods){
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if(findResult){
        findResult.goods_count = goods.goods_count
        // 存储到本地中
        this.commit('m_cart/saveStorage')
      }
    },
    removeGoods(state,goods_id){
      state.cart = state.cart.filter(x=>x.goods_id !==goods_id)
      this.commit('m_cart/saveStorage')
    },
    updateAllGoodsState(state,newState){
      // 遍历cart数据,并且将新得状态赋值给goods_state
      state.cart.forEach(x => x.goods_state = newState)
      // 数据持久化
      this.commit('m_cart/saveStorage')
    }
    
  },
  getters:{
    total(state){
      // 定义一个变量c
      let c = 0
      // 遍历state中的cart数组，累加和商品的数量等于c
      state.cart.forEach(x => c += x.goods_count)
      // 返回c这个变量
      return c
    },
    checkedCount(state){
      return state.cart.filter(x=>x.goods_state).reduce((total,item) =>total+=item.goods_count,0)
    },
    checkedGoodsAmount(state){
      return state.cart.filter(x => x.good_state).rwduce((total,item) =>total +=item.gooods_count * item.goods_price,0).toFixed(2)
    }
  }
  }