<template>
	<view class="my-search-container" :style="{'background-color': bgcolor}">
    <!-- 使用view组件模拟input输入框的样式 -->
		<view class="my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
		  <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
    props:{
      // 使用者自定义搜索组件的背景颜色和圆角尺寸
      // 背景颜色
      bgcolor:{
        // 类型为字符串
        type:String,
        // 默认值
        default:'#c00000'
      },
      radius:{
        // 类型为数字型
        type:Number,
        // 默认值,单位是px
        default:18
      }
    },
		data() {
			return {
				
			};
		},
    methods:{
      // 点击搜索触发的事件处理函数
      searchBoxHandler(){
        this.$emit('click')
      }
    }
	}
</script>

<style lang="scss">
.my-search-container{
  // background-color: #c00000;
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  .my-search-box{
    width: 100%;
    height: 36px;
    background-color: #ffffff;
    // border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    .placeholder{
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>
