<template>
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- /轮播图区域 -->
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="goods-price">￥{{goods_info.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <view class="goods-name">
         {{goods_info.goods_name}}
        </view>
        <!-- 收藏 -->
        <view class="faiv">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="yf">
        快递：免运费
      </view>
    </view>
    <!-- 商品详细信息 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <!-- 商品导航组件 -->
   <view class="goods-nav">
      <uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
   </view>
	</view>
</template>

<script>
  import {mapState,mapMutations,mapGetters} from 'vuex'
	export default {
    computed:{
      ...mapState('m_cart',['cart']),
      // 将store中的total映射过来
      ...mapGetters('m_cart',['total'])
    },
    watch:{
      // 监听total中数据的变化
      // total(val){
      //   // 查找options中的购物车，返回的时找到的数据对象
      //  const findResult = this.options.find(x => x.text === '购物车')
      // // 判断findResult是否有值
      // if(findResult){
      //   // 将变化后的数量赋值给options中的info
      //   findResult.info = val
      // }
      // }
      total:{
        handler(val){
            // 查找options中的购物车，返回的时找到的数据对象
           const findResult = this.options.find(x => x.text === '购物车')
          // 判断findResult是否有值
          if(findResult){
            // 将变化后的数量赋值给options中的info
            findResult.info = val
          }
        },
        // 页面初始完毕后立即调用
        immediate: true
      }
    },
		data() {
			return {
				// 商品详情的对象
        goods_info:{},
        // 组件的参数
        options: [{
                    icon: 'shop',
                    text: '店铺'
                },  {
                    icon: 'cart',
                    text: '购物车',
                    info: 0
                }],
                  buttonGroup: [{
                          text: '加入购物车',
                          backgroundColor: '#ff0000',
                          color: '#fff'
                        },
                        {
                          text: '立即购买',
                          backgroundColor: '#ffa200',
                          color: '#fff'
                        }
                        ]
			};
		},
    onLoad(options){
      // console.log(options)
      // 定义一个常量,接收传过来的商品id值
      const goods_id=options.goods_id
      // 获取商品详情数据
      this.getGoodsDetail(goods_id)
    },
    methods:{
      ...mapMutations('m_cart',['addToCart']),
      async getGoodsDetail(goods_id){
        const {data:res} = await uni.$http.get('/api/public/v1/goods/detail',{ goods_id })
        if(res.meta.status !== 200) return uni.$showMsg()
        console.log(res)
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,'<img style="display:block"').replace(/webp/g,'jpg')
        this.goods_info = res.message
      },
      // 轮播图的预览效果
      preview(i){
        // 调用uni.previewImage()的方法预览图片
         uni.previewImage({
           // 当前显示图片的索引
           current:i,
           // 所有图片的url地址，使用map方法遍历prics，不会改变原有数据的值，返回的是一个新数组 
           urls	:this.goods_info.pics.map(x=>x.pics_big)
         })
      },
      onClick(e){
        console.log(e)
        if(e.content.text === '购物车'){
          uni.switchTab({
            url:'/pages/cart/cart'
          })
      }
      },
      buttonClick(e){
        console.log(e)
        if(e.content.text === '加入购物车'){
          // 定义一个商品的信息对象
          const goods = {
            goods_id:this.goods_info.goods_id,     // 商品的Id
            goods_name: this.goods_info.goods_name,   // 商品的名称
            goods_price: this.goods_info.goods_price, // 商品的价格
            goods_count:1,  // 商品的数量
            goods_small_logo:this.goods_info.goods_small_logo ,// 商品的图片
            goods_state:true // 商品勾选的状态
          }
          // 通过this调用映射过来的的addToCart方法,把商品信息对象存储到购物车中
          this.addToCart(goods)
        }
      }
      }
    
	}
</script>

<style lang="scss">

.goods-detail-container{
  padding-bottom: 50px;
  swiper{
    height: 750rpx;
    image{
      width: 100%;
      height: 100%;
    }
  }
  .goods-info-box{
    padding: 10px;
    padding-right: 0;
    .goods-price{
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }
    .goods-info-body{
      display: flex;
      justify-content: space-between;
      .goods-name{
        font-size: 13px;
        padding-right: 10px;
      }
      .faiv{
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #efefef;
        color: gray;
        }
    }
    .yf{
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    } 
  }
  .goods-nav{
    // 为商品导航组件添加固定定位
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
  }
}
</style>
