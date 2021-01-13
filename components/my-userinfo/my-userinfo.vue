<template>
	<view class="my-userinfo-container">
		<!-- 头像昵称区域 -->
    <view class="top-box">
      <image :src="userInfo.avatarUrl" class="avatar"></image>
      <view class="nickname">{{userInfo.nickName}}</view>
    </view>
    <!-- 面板列表区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <view class="panel">
        <!-- 主体区域 -->
        <view class="panel-body">
          <!-- panel的item项 -->
          <view class="panel-item">
            <text>8</text>
            <text>收藏店铺</text>
          </view>
          <view class="panel-item">
            <text>14</text>
            <text>收藏商品</text>
          </view>
          <view class="panel-item">
            <text>18</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>84</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <!-- 第二个面板 -->
      <view class="panel">
        <!-- 面板的标题 -->
        <view class="panel-title">我的订单</view>
        <!-- 面板的主体 -->
        <view class="panel-body">
          <!-- 面板主体中的item项 -->
          <view class="panel-item">
            <image src="/static/my-icons/icon1.png" class="icon"></image>
            <text>待付款</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon3.png" class="icon"></image>
            <text>退款/退货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item">
          <text>联系客服</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
    computed:{
      ...mapState('m_user',['userInfo'])
    },
    methods:{
      ...mapMutations('m_user',['updateAddress','updateUserInfo','updateToken'])
      async logout(){
       const [err,succ] = await uni.showModal({
          title:'提示'
          content:'确认退出登录吗？'
        }).catch(err=>err)
        
        // 判断succ是否为true,并且有succ.confirm
        if(succ && succ.confirm) {
          // 清空store里的toke 、uerinfo和address
          this.updateToken('')
          this.updateUserInfo({})
          this.updateAddress({})
        }
      }
    }
	}
</script>

<style lang="scss">
.my-userinfo-container{
  height: 100%;
  background-color: #f4f4f4;
  .top-box{
    height: 400rpx;
    background-color: #c00000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .avatar{
      display: block;
      width: 90px;
      height: 90px;
      border-radius: 45%;
      border:2px solid white;
      box-shadow: 0 1px 5px black;
    }
    .nickname{
      color: white;
      font-weight: bold;
      font-size: 16px;
      margin-top: 10px;
    }
  }
  .panel-list{
    padding: 0 10px;
    top: -10px;
    position: relative;
    
    .panel{
      background-color: white;
      border-radius: 3px;
      margin-bottom: 8px;
      .panel-title{
        line-height: 45px;
        padding-left: 10px;
        font-size: 15px;
        border-bottom: 1px solid #f4f4f4;
        }
      .panel-body{
        display: flex;
        justify-content: space-around;
        
        .panel-item{
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-direction: column;
          font-size: 13px;
          padding: 10px 0;
          
          .icon{
            width: 35px;
            height: 35px;
          }
        }
      }
      .panel-list-item{
        height: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        padding: 0 10px;
      }
    }
  }
    
}
</style>
