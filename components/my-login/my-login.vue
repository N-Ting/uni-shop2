<template>
	<view class="login-container">
		<!-- 提示登录的的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" open-type="getUserInfo" @getUserInfo="getUserInfo">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
    computed:{
    }
    methods:{
      ...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
      getUserInfo(e){
        console.log(e)
        // 判断是否获取用户信息成功
        if(e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权')
        // 获取用户信息成功,e.detail.userInfo就是用户的基本信息
        // console.log(e.detail.userInfo)
        this.updateUserInfo(e.detail.userInfo)
        // 获取登录成功后的Token字符串
        this.getToken(e.detail)
      },
      async getToken(info){
        const [err,res] = await uni.login().catch(err=>err)
        console.log(err)
        // 判断是否调用uni.login()失败
        if(err || re.Msg !== 'login:ok') return uni.$showMsg('登录失败！')
        // 参数对象
        const query = {
          code:res.code,
          encryptedData:info.encryptedData,
          iv:info.iv,
          rawData:info.rawData,
          signature:info.signature
        }
        // 换取token
        const {data : loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin',query)
        console.log(loginResult)
        // 判断状态码是否等于200
        if(loginResult.meta.status !==200) return uni.$showMsg('登录失败')
        // uni.$showMsg('登录成功')
        this.updateToken(loginResult.message.token)
        
        this.navigateBack()
      },
      navigateBack(){
        // 判断redirectInfo是否为空
        // 并且redirectInfo的跳转方式为switchTab
        if(this.redirectInfo. && this.redirectInfo.openType === 'switchTab'){
          uni.switchTab({
            url:this.redirectInfo.from,
            // 导航成功后,把vuex中的redirectInfo对象重置为空
            complete:()=>{
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
	}
</script>

<style lang="scss">
.login-container{
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;
  &::after{
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }
  .btn-login{
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }
  .tips-text{
    font-size: 12px;
    color: gray;
  }
}
</style>
