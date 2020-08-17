<template>
	<div id='detail'>
		<detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="navBar"></detail-nav-bar>
		<scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
			<detail-swiper :top-images="topImages"></detail-swiper>
			<detail-base-info :goods="goods"></detail-base-info>
			<detail-shop-info :shop="shop"></detail-shop-info>
			<detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
			<detail-param-info :paramInfo="paramInfo" ref="paramInfo"></detail-param-info>
			<detail-comment-info :commentInfo="commentInfo" ref="commentInfo"></detail-comment-info>
			<goods-list :goods="recommends" ref="recommends"></goods-list>
		</scroll>
		<detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
		<!-- <toast :message="message" :show="show"></toast> -->
	</div>
</template>

<script>
	import DetailNavBar from './childComps/DetailNavBar.vue'
	import DetailSwiper from './childComps/DetailSwiper.vue'
	import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
	import DetailShopInfo from './childComps/DetailShopInfo.vue'
	import Scroll from 'components/common/scroll/Scroll.vue'
	import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
	import DetailParamInfo from './childComps/DetailParamInfo.vue'
	import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
	import GoodsList from 'components/content/goods/GoodsList.vue'
	import DetailBottomBar from './childComps/DetailBottomBar.vue'
	// import Toast from 'components/common/toast/Toast.vue'
	
	import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail.js'
	
	import {debounce} from 'common/utils.js'
	import {itemListenerMixin} from 'common/mixin.js'
	
	import {mapActions} from 'vuex'
	
	export default {
		name:'Detail',
		data(){
			return {
				iid:null,
				topImages:[],
				goods:{},
				shop:{},
				detailInfo:{},
				paramInfo: {},
				commentInfo:{},
				recommends:[],
				themeTopYs: []
			}
		},
		mixins:[itemListenerMixin],
		components:{
			DetailNavBar,
			DetailSwiper,
			DetailBaseInfo,
			DetailShopInfo,
			Scroll,
			DetailGoodsInfo,
			DetailParamInfo,
			DetailCommentInfo,
			GoodsList,
			DetailBottomBar
		},
		created(){
			this.iid = this.$route.query.id
			
			getDetail(this.iid).then(res=>{
				console.log(res)
				const data = res.result
				this.topImages = data.itemInfo.topImages
				this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
				this.shop = new Shop(data.shopInfo)
				this.detailInfo = data.detailInfo
				this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
				if(data.rate.cRate){
					this.commentInfo = data.rate.list[0]
				}
				/*
				//1.第一次获取，值不对。
				//原因：this.$refs.paramInfo.$el压根没有渲染
				this.themeTopYs = []
				this.themeTopYs.push(0)
				this.themeTopYs.push(this.$refs.paramInfo.$el.offsetTop)
				this.themeTopYs.push(this.$refs.commentInfo.$el.offsetTop)
				this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
				console.log('nextTick------------')
				console.log(this.themeTopYs)
				
				this.$nextTick(()=>{
					//1.第二次获取，值不对。
					//原因：图片还没有加载完
					this.themeTopYs = []
					this.themeTopYs.push(0)
					this.themeTopYs.push(this.$refs.paramInfo.$el.offsetTop)
					this.themeTopYs.push(this.$refs.commentInfo.$el.offsetTop)
					this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
					console.log('nextTick------------')
					console.log(this.themeTopYs)
				})
				*/
			   
			   
			})
			
			getRecommend().then(res=>{
				console.log(res)
				this.recommends = res.data.list
			})
			
			
		},
		mounted() {
		},
		updated(){
		},
		methods:{
			...mapActions([
				'addCart'
			]),
			imageLoad(){
				this.$refs.scroll.scroll.refresh()
				
				this.themeTopYs = []
				this.themeTopYs.push(0)
				this.themeTopYs.push(this.$refs.paramInfo.$el.offsetTop)
				this.themeTopYs.push(this.$refs.commentInfo.$el.offsetTop)
				this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
				console.log(this.themeTopYs)
				
			},
			titleClick(index){
				this.$refs.scroll.scrollTo(0,-this.themeTopYs[index])
			},
			contentScroll(position){
				for(let i =0 ; i<this.themeTopYs.length-1 ; i++){
					if(position.y<=-this.themeTopYs[i] && position.y>-this.themeTopYs[i+1]){
						this.$refs.navBar.currentIndex = i
					}
				}
				if(position.y<=-this.themeTopYs[this.themeTopYs.length-1]){
					this.$refs.navBar.currentIndex = this.themeTopYs.length-1
				}
			},
			addToCart(){
				const product = {}
				product.image = this.topImages[0]
				product.title = this.goods.title
				product.desc = this.goods.desc
				product.price = this.goods.realPrice
				product.iid = this.iid
				
				this.addCart(product).then(res=>{
					
					// 普通方式封装toast组件
					// this.show = true
					// this.message = res;
					
					// setTimeout(()=>{
					// 	this.show = false
					// 	this.message = ''
					// },1500)
					
					//插件方式封装
					this.$toast.show(res,2000)
					
				})
				
				// this.$store.dispatch('addCart',product).then(res=>{
				// 	console.log(res)
				// })
				
			}
		},
		destroyed(){
			this.$bus.$off('itemImageLoad',this.itemImgListener)
		}
	}
</script>

<style scoped>
	#detail{
		position: relative;
		z-index: 9;
		background-color: #fff;
		height: 100vh;
		overflow: hidden;
	}
	.detail-nav{
		position: relative;
		z-index: 9;
		background-color: #fff;
	}
	.content{
		position: relative;
		/* calc() 之间运算符与操作数之间必须空格隔开*/
		height: calc(100% - 44px);
	}
</style>
