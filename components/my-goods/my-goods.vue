<template>
	<view class="goods-item">
	  <!-- 商品左侧图片区域 -->
	  <view class="left-goods-item">
        <radio :checked="goods.goods_state" color="#c00000" v-if="showRaido" @click="raidoClickHandle"></radio>
	    <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
	  </view>
	  <!-- 商品右侧区域 -->
	  <view class="right-goods-item">
	    <!-- 商品标题 -->
	    <view class="goods-name">
	      {{goods.goods_name}}
	    </view>
	    <view class="goods-info-box">
	      <!-- 商品价格 -->
	      <view class="goods-price">
	        ￥{{goods.goods_price | tofixed}}
	      </view>
        <uni-number-box :mim="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandle"></uni-number-box>
	    </view>
	  </view>
    </view>
</template>

<script>
	export default {
    // 使用props接收从外界传过来的值
    props:{
      goods:{
        // 类型为对象
        type:Object,
        // 默认值为空
        default:{}
      },
      showRaido:{
          type:Boolean,
          // 默认情况下不会展示raido组件
          default:false
      },
      // 是否展示右侧的NumberBox组件
      showNum:{
        type:Boolean,
        default:false
      }
    },
		data() {
			return {
				// 防止某些图片不存在，需要在data中定义一个默认的图片
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
			};
		},
    filters:{
      // 把数字处理为两位小数点的数字
      tofixed(num){
        return Number(num).toFixed(2)
        }
    },
    methods:{
      raidoClickHandle(){
        this.$emit('raido-change',{
          goods_id:this.goods.goods_id,
          goods_state:!this.goods.goods_state
        })
      },
      numChangeHandle(val){
        this.$emit('num-change',{
          goods_id:this.goods.goods_id,
          goods_count: +val
        })
      }
    }
	}
</script>

<style lang="scss">
.goods-item{
  width: 750rpx;
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .left-goods-item{
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .goods-pic{
      width: 100px;
      height: 100px;
      display: block;
     
    }
  }
  .right-goods-item{
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .goods-name{
      font-size: 13px;
    }
    .goods-info-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .goods-price{
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>
