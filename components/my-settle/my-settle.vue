<template>
	 <!-- 最外层的容器 -->
	  <view class="my-settle-container">
	     <!-- 全选区域 -->
	      <label class="radio" @click="changeAllState">
	        <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
	      </label>
	    
	      <!-- 合计区域 -->
	      <view class="amount-box">
	        合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
	      </view>
	    
	      <!-- 结算按钮 -->
	      <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	  </view>
</template>

<script>
  import {mapGetters,mapMutations,mapState} from 'vuex'
	export default {
		data() {
			return {
				seconds:3,
        timer:null
			};
		},
    computed:{
       ...mapGetters('m_cart', ['checkedCount', 'total','checkedGoodsAmount']),
       ...mapGetters('m_user',['addStr']),
       ...mapState('m_user',['token','redirectInfo']),
       // 是否全选
        isFullCheck(){
             return this.total === this.checkedCount
           }
    },
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState']),
      ...mapMutations('m_user',['updateRedirectInfo'])
      // 点击全选时得事件处理
      changeAllState(){
        // 取反
          this.updateAllGoodsState(!this.isFullCheck)
      },
      settlement(){
        // 判断是否选中商品
        if(!this.checkedCount) return uni.$showMsg('请选择要结算得商品')
        // 判断是否选中地址
        if(!this.addStr) return uni.$showMsg('请选择收货地址')
        // 判断用户是否登录了
        // if(!this.token) return uni.$showMsg('请选登录')
        if(!this.token) return uni.delayNavigate()
        
        // 实现微信支付功能
        this.payOrder()
      },
      delayNavigate(){
        this.showTap(this.seconds)
      this.timer = setInterval(()=>{
          this.seconds--
          if(this.seconds<=0){
            clearInterval(this.timer)
            uni.switchTab({
              url:'/pages/my/my',
              success:()=>{
                // 调用vuex中的updateRedirectInfo方法,把跳转信息存储到store中
                this.updateRedirectInfo({
                  // 跳转方式
                  openType:'switchTab',
                  from:'/pages/cart/cart'
                })
              }
            })
            return  
          }
          this.showTap(this.seconds)
        })
      }
      showTap(n){
        uni.showModal({
          icon:'none',
          title:'请登录后在结算！' + n +'秒后自动跳转到登录页',
          mask:true,
          duration:1500
        })
      },
      // 微信支付
     async payOrder(){
        // 创建订单
        // 组织订单的信息对象
        const orderInfo = {
          // 开发期间注释掉真是的订单价格
          // order_price:this.checkedGoodsAmount
          order_price:0.01,
          consignee_addr:this.addStr,
          // 过滤出来勾选的商品信息
           goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
        }
        const {data:res} = await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
        // 判断状态码是否等于200
        if(res.meta.status !== 200) return uni.$showMsg('创建订单失败')
        // 得到服务器响应的订单编号
        const orderNumber = res.message.order_number
        
        // 订单预支付
        // 发起请求获取订单的支付信息
        const {data:res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder',{ order_number:orderNumber})
        // 预付订单生成失败
        if(res.meta.status !== 200) return uni.$showMsg('预付订单生成失败')
        // 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
        
         // 发起微信支付
         // 调用uni.requestPayment()发起微信支付
         const [err,succ] = await uni.requestPayment(payInfo)
         
         // 未完成支付
         if(err) return uni.$showMsg('订单未支付')
         // 完成了支付,进一步查询支付的结果
         const {data:res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder',{ order_number: orderNumber })
         if(res3.meta.state !== 200) return uni.$showMsg('订单未支付！')
         uni.showToast({
           title:'支付完成！',
           icon:'success'
         })
      }
    }
	}
</script>

<style lang="scss">
.my-settle-container {
  /* 底部固定定位 */
  position: fixed;
  bottom: 0;
  left: 0;
  /* 设置宽高和背景色 */
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  font-size: 14px;
  .radio {
      display: flex;
      align-items: center;
    }
  
    .amount {
      color: #c00000;
    }
     .btn-settle {
        height: 50px;
        min-width: 100px;
        background-color: #c00000;
        color: white;
        line-height: 50px;
        text-align: center;
        padding: 0 10px;
      }
}
</style>
