<template>
	<view class="search-box">
    <!-- 使用uni-app提供的搜索组件 -->
		<uni-search-bar @input="input" radius="100" cancelButton="none"></uni-search-bar>
    <!-- 搜索建议列表 -->
    <!-- 当搜索结果的长度不等于0的时候，渲染搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length!==0">
      <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="goroDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
     <!-- /搜索建议列表 -->
     <!-- 搜索历史 -->
     <view class="history-box" v-else>
       <!-- 标题区域 -->
       <view class="history-title">
         <text>搜索历史</text>
         <uni-icons type="trash" size="17"  @click="clearHistory"></uni-icons>
       </view>
       <!-- 搜索历史列表区域 -->
       <view class="history-list">
         <!-- 使用uni-app提供的tag组件 -->
         <uni-tag :text="item" v-for="(item,i) in history" :key="i" @click="gotoGoodsList(item)"></uni-tag>
       </view>
       <!-- /搜索列表区域结束 -->
     </view>
     <!-- /搜索历史 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
        // 延时器的timerId
				timer:null,
        // 搜索的关键字
        kw:'',
        // 搜索结果列表
        searchResults:[],
        // 搜索关键字的历史记录
        historyList:['a','app','apple']
			};
		},
    computed:{
      history(){
        // 使得最新的搜索关键字,在前面
        // 将搜索关键字的历史记录数组展开,调用reverse()方法,对数组进行反转
        return [...this.historyList].reverse()
      }
    },
    onLoad(){
      // 页面初始化时,加载本地存储中的数据,并且赋值给historyList数组
      // 将本地存储中json格式的字符串转换为对象
      // 本地存储中有数据,就将数据取出来,否则就是空数组
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
      
    },
    methods:{
      // input事件处理函数
      input(e){
        // 清除延时器
        clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
          // 如果500毫秒内,没有触发新的输入事件,就将最新的值赋值给关键字
          this.kw=e.value
          // console.log(this.kw)
          // 调用获取搜索结果列表的方法
          this.getSearchResults()
        },500)
        // e.value为最新的值
        // console.log(e.value)
      },
      // 搜索建议事件处理函数
     async getSearchResults(){
       // 判断关键字是否为空
       if(this.kw===''){
         // 获取搜索建议结果的数组为空
         this.searchResults=[]
         return
       }
       const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{ query: this.kw })
       // console.log(res)
       if(res.meta.status!==200) return uni.$showMsg()
       this.searchResults=res.message
       console.log(this.searchResults,111)
       // 查询到搜索建议后,调用saveSearchHistory方法保存搜索关键字
       this.saveSearchHistory()
     },
     // 点击搜索item项的事件处理函数
      goroDetail(goods_id){
        // 跳转到商品详情页
        uni.navigateTo({
          url:"/subpkg/goods_detail/goods_detail?goods_id"+goods_id
        })
      },
      saveSearchHistory(){
        // 将搜索关键字添加到historyList数组中
        // this.historyList.push(this.kw)
        // 因为会有关键字重复的问题
        // 使用Set对象，因为Set对象是存储唯一的值
        // 首先,先将数组转换为Set对象
        const set =new Set(this.historyList)
        // 调用delete方法,删除对象中对应的关键字
        set.delete(this.kw)
        // 添加进新的关键字
        set.add(this.kw)
        // 将set对象转换为Array数组,并且赋值给historyList
        this.historyList=Array.from(set)
        // this.historyList= [...set]
        // 解决数据不持久化
        // 调用 uni.setStorageSync方法，将历史数组中的数据存储到本地存储中
        // 因为存储在本地存储中的数据为json格式的字符串
         uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      // 清空历史记录事件处理函数
      clearHistory(){
        console.log('12')
        // 将data中的historyList数组重置为空
        this.historyList = []
        // 清空本地存储中的数据
        uni.setStorageSync('kw','[]')
      },
      // 点击历史记录的事件处理函数
     gotoGoodsList(kw) {
       uni.navigateTo({
         url: '/subpkg/goods_list/goods_list?query=' + kw
       })
     }
    }
	}
</script>

<style lang="scss">
.search-box{
  // 搜索框的吸顶效果
  position: sticky;
  top: 0;
  z-index: 999;
  .sugg-list{
    padding: 0 5px;
    .sugg-item{
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefefef;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .goods-name{
        // 文字不允许换行
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出部分用...代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }
  .history-box{
    padding: 0 5px;
    .history-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
    .history-list{
      display: flex;
      flex-wrap: wrap;
      .uni-tag{
        margin-top: 5px;
        margin-right: 5px;
      }
    }
    }
}

</style>
