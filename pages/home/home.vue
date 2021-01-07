<template>
	<view>
    <!-- 搜索组件 -->
  <view class="search-box">
     <my-search @click="gotosearch"></my-search>
  </view>
    <!-- /搜索组件结束 -->
    <!-- 轮播图的区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
		  <swiper-item v-for="(item,i) in swiperList" :key="i">
		    <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
		  </swiper-item>
		</swiper>
     <!-- /轮播图的区域结束 -->
     <!-- 分类导航区域 -->
     <view class="nav-list">   
       <view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
         <image :src="item.image_src" class="nav-img"></image>
       
       </view>
     </view>
      <!-- /分类导航区域结束 -->
      <!-- 楼层区域 -->
      <view class="floor-list">
          <!-- 楼层item项 -->
        <view class="floor-item" v-for="(item,i) in floorList" :key="i">
            <!-- 楼层标题 -->
          <image :src="item.floor_title.image_src" class="floor-title"></image>
          <!-- 楼层里的图片 -->
          <view class="floor-img-box">
            <!-- 左侧大盒子的图片 -->
            <navigator class="left-img-box" :url="item.product_list[0].url">
              <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}" mode="widthFix"></image>
            </navigator>
            <!-- 右侧4个小图片的盒子 -->
            <view class="right-img-box">
              <!-- 因为每一张图片是在product_list里,所以循环这个数组,但是会把第一项循环出来,所以要忽略第一项 -->
              <navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
                <image :src="item2.image_src" mode="widthFix" :style="{width:item2.image_width+'rpx'}"></image>
              </navigator>
            </view>
          </view>
        </view>
      </view>
       <!-- /楼层区域结束 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//轮播图的数据列表,默认为空数组
        swiperList:[],
        // 分类导航的数据列表
        navList:[],
        // 楼层数据列表
        floorList:[]
			}
		},
    onLoad(){
      // 在小程序页面刚加载的时候,调用获取轮播图数据的方法
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods:{
     async getSwiperList(){
        const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
        console.log(res)
        // 请求失败
        if(res.meta.status!==200) return uni.$showMsg()
        // 请求成功,将数据保存到swiperList数组中
        this.swiperList=res.message
      },
      async getNavList(){
        const {data:res} = await uni.$http.get('/api/public/v1/home/catitems')
        if(res.meta.status!==200) return uni.$showMsg()
        this.navList=res.message
      },
      // 点击分类时跳转到分类页面
      navClickHandler(item){
        // 判断点击的是否为分类
        if(item.name==='分类'){
         uni.switchTab({
            url: '/pages/cate/cate'
             })
        }
      },
     async getFloorList(){
        const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
        if(res.meta.status!==200) return uni.$showMsg()
        // 对数据进行处理
        // 通过双层for循环,遍历出楼层图片的url地址
        res.message.forEach(floor=>{
          floor.product_list.forEach(pro=>{
            // 遍历出来的url地址前面要加上分包的路径,以?进行分割,拿到下标为1的元素
            pro.url='/subpkg/goods_list/goods_list?'+pro.navigator_url.split('?')[1]
          })
        })
        this.floorList=res.message
      },
      gotosearch(){
        console.log('ok')
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      }
    }
	}
</script>

<style lang="scss">
  .search-box{
    // 设置定位效果为吸顶
    position: sticky;
    // 吸顶的位置
    top: 0;
    // 提高层级,防止被轮播图覆盖
    z-index: 999;
  }
    swiper{
     height: 330rpx;
     .swiper-item,
     image{
       width: 100%;
       height: 100%;
     }
    }
    .nav-list{
      display: flex;
      justify-content: space-around;
      margin: 15px 0 ;
      .nav-img{
        width: 128rpx;
        height: 140rpx;
      }
    }
    .floor-title{
      height: 60rpx;
      width: 100%;
      display: flex;
    }
    .right-img-box{
      display: flex;
      // 让弹性盒子在必要的时候换行
      flex-wrap: wrap;
      // 让弹性盒子对象的元素中各项留有空白
      justify-content: space-around;
    }
    .floor-img-box{
      display: flex;
      padding-left: 10rpx;
    }
</style>
