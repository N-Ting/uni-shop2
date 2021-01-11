<template>
	<view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>
    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">
            收货人：{{address.userName}}
          </view>
        </view>
        <view class="row1-right">
          <view class="phone">电话:{{address.telNumber}}</view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addStr}}</view>
      </view>
    </view>
		<!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
 import { mapState, mapMutations,mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// address:{}
			};
		},
    computed:{
     ...mapState('m_user', ['address']),
     ...mapGetters('m_user',['addStr'])
      
    },
    methods:{
      ...mapMutations('m_user',['updateAddress']),
     async chooseAddress(){
        // 调用小程序提供的chooseAddress()方法，即可选择收货地址的功能
        const [err,succ] = await uni.chooseAddress().catch(err=>err)
        // 用户成功选择了收货地址
        // 如果返回的错误等于null,并且成功的信息
        if(err === null && succ.errMsg === 'chooseAddress:ok') {
          // console.log(succ)
          // 就将data里的address赋值
          // this.address = succ
          // 将数据存储到vuex中
          this.updateAddress(succ)
        }
        // 如果err不等于null,并且有返回信息
        if( err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
          console.log('需要重新授权')
          // 通过这个方法,让用户重新授权
          this.reAuth()
        }
      },
      // 让用户重新授权
      async reAuth(){
        const [err2,confirmResult] =await uni.showModal({
          content:'检测到您没打开地址权限，是否去设置打开',
          confirmText:'确认',
          cancelText:'取消'
        })
        
        if(err2) return
        console.log(confirmResult)
        if(confirmResult.cancel) return uni.$showMsg('您取消了地址授权')
        if(confirmResult.confirm) return uni.openSetting({
          success(settingResult){
            console.log(settingResult)
            // 如果scope.address为false,表示取消了授权
            if(!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了授权')
            if(settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了授权')
          }
        })
      }
    }
	}
</script>

<style lang="scss">
.address-border{
  display: block;
  width: 100%;
  height: 5px;
}
.address-choose-box{
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.address-info-box{
  height: 90px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 5px;
  .row1{
    display: flex;
    justify-content: space-between;
   .row1-right{
     display: flex;
     justify-content: space-between;
   }
  }
  .row2{
    display: flex;
    align-items: center;
    margin-top: 10px;
    .row2-left{
      white-space: nowrap;
    }
  }
}
</style>
