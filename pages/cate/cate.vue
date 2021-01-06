<template>
	<view>
		<view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
		  <scroll-view scroll-y="true" class="left-scroll-view" :style="{height:wh+'px'}">
        <block v-for="(item,i) in cateList" :key="i">
          <view :class="['left-scroll-item',i===active?'active':'']" @click="activeChange(i)">{{item.cat_name}}</view>
          </block>
		  </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view scroll-y="true" class="right-scroll-view" :style="{height:wh+'px'}" :scroll-top="scrollTop">
        <!-- 二级分类列表 -->
        <view class="cate-lv2" v-for="(item2,i2) in catelevel2" :key="i2">
           <view class="cate-lv2-item">{{item2.cat_name}}</view>
           <!-- 三级分类列表 -->
           <view class="cate-lv3-list">
             <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
        <image :src="item3.cat_icon"></image> 
              <text>{{item3.cat_name}}</text>
             </view>
           </view>
        </view>
      </scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//动态计算窗口的剩余高度
        // 窗口可用高度=屏幕高度-navigationBar高度-tabbar高度
        wh:0,
        // 获取分类数据类别
        cateList:[],
        // 当前选中项的索引,默认让第一项被选中
        active:0,
        // 二级分类的数据列表
        catelevel2:[],
        // 滚动条距离顶部的距离
        scrollTop:0
			};
		},
    onLoad(){
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // console.log(sysInfo)
      // 将获取过来当前的高度赋值给wh
      this.wh=sysInfo.windowHeight
      this.getCateList()
    },
    methods:{
      async getCateList(){
        const {data:res} = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status!==200) return uni.$showMsg()
        this.cateList=res.message
        // 为二级分类赋值
        this.catelevel2=res.message[0].children
      },
      // 点击时,传入当前索引值
      activeChange(i){
        // 让激活项的索引等于传入的i
        this.active=i,
        // 当索引发生改变时,当前的二级分类渲染也要发生改变
        this.catelevel2=this.cateList[i].children
        // 当切换一级分类时,二级分类的滚动条要重置为0,不能为scroll-top赋相同的值,所以在1和0之间切换
        this.scrollTop= this.scrollTop === 0 ? 1 : 0
      },
      // 点击三级分类的item项时
      gotoGoodsList(item3){
        // 跳转到商品列表页面,并且传入当前商品的id值
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid='+item3.cat_id
        })
      }
    }
	}
</script>

<style lang="scss">
.scroll-view-container{
  display: flex;
  .left-scroll-view{
    width: 120px;
    .left-scroll-item{
      line-height: 60px;
      background-color: #f7f7f7f;
      text-align: center;
      font-size: 12px;
      &.active{
        background-color: #FFFFFF;
        position: relative;
        &::before{
          content: '';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .cate-lv2-item{
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate-lv3-list{
    display: flex;
    flex-wrap: wrap;
    .cate-lv3-item{
      width: 33.3%;
      margin-bottom: 10px;
      display: flex;
      // 元素垂直显示
      flex-direction:column;
      // 元素位于盒子的中心
      align-items: center;
      image{
        width: 60px;
        height: 60px;
      }
      text{
        font-size: 12px;
      }
    }
  }
}
</style>
