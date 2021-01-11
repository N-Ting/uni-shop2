import {mapGetters} from 'vuex'

export default {
  computed:{
    ...mapGetters('m_cart',['total'])
  },
  watch:{
    total(){
      this.setBadge()
    }
  },
  onShow(){
    this.setBadge()
  },
  methods:{
    setBadge(){
      // 调用uni.setTabBarBadge()方法,为购物车设置右上角的徽标
      uni.setTabBarBadge({
        // 索引值
        index:2,
        // text的属性必须为字符串
        text:this.total+''
      })
    }
  }
}