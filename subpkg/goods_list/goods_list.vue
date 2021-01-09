<template>
	<view>
		<view class="good-list">
		  <view v-for="(item,i) in goodsList" :key="i" @click="gotoDetail(item)">
		   <my-goods :goods="item"></my-goods>
       </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
        queryInfo:{
          // 查询关键字
          query:'',
          // 分类id
          cid:'',
          // 页码值
          pagenum:1,
          // 每页长度
          pagesize:10
        },
        // 总数量
        total:0,
        // 商品列表数据
        goodsList:[],
        // 节流阀，判断是否正在请求数据
        isLoading:false
			};
		},
    onLoad(options){
      console.log(options)
      // 将页面参数转存到查询对象中
      this.queryInfo.query = options.query || ''
      this.queryInfo.cid = options.cid || ''
      
      this.getGoodsList()
    },
    methods:{
      async getGoodsList(cb){
        // 发送请求时,表明正在请求数据
        this.isLoading=true
       const {data:res} = await uni.$http.get('/api/public/v1/goods/search',this.queryInfo) 
       // 数据请求成功后,关闭节流阀
       this.isLoading=false
       // 只要数据请求完毕,就按需调用cb回调函数，关闭下拉刷新事件
       cb && cb()
       if(res.meta.status!==200) return uni.$showMsg()
       console.log(res)
       // 将获取过来的数据赋值给商品列表数组，和总数量
       // 通过张开运算符,为新旧数据进行拼接
       this.goodsList = [...this.goodsList,...res.message.goods]
       this.total = res.message.total
     
      },
      // 触底事件
      onReachBottom(){
        // 判断下一页是否还有数据,如果页码乘以每页的长度大于等于总数量，表明数据已经加载完毕
        if(this.queryInfo.pagenum * this.queryInfo.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
        // 判断是否正在请求数据，如果是就直接返回
        if(this.isLoading) return
        // 让页码加1
        this.queryInfo.pagenum += 1
        // 重新调用获取商品列表数据
        this.getGoodsList()
      },
      // 下拉刷新事件
      onPullDownRefresh(){
        // 重置关键数据
          this.queryInfo.pagenum = 1
          this.total = 0
          this.isLoading = false
          this.goodsList = []
          // 获取商品列表数据，传一个回调函数，关闭下拉刷新事件
          this.getGoodsList(()=>uni.stopPullDownRefresh())
      },
      // 点击商品item项的事件处理函数
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id
        })
      }
    }
	}
</script>

<style lang="scss">

</style>
