<template>
	<div id="home" class="wrapper">
		<nav-bar class="home-nav">
			<template v-slot:center>
				<div>购物街</div>
			</template>
		</nav-bar>
		<tab-control :title="['流行','新款','精选']" ref="tabControl1"
						@tabClick="tabClick" class="tab-control" v-show="isTabFixed"></tab-control>
		<scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" 
				:pull-up-load="true" @pullingUp="loadMore">
			<home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
			<recommend-view :recommends="recommends"></recommend-view>
			<feature-view></feature-view>
			<tab-control :title="['流行','新款','精选']" ref="tabControl2" 
							@tabClick="tabClick"></tab-control>
			<goods-list :goods="goods[currentType].list" ></goods-list>
		</scroll>
		<back-top @click.native="backClick" v-show="isShow"></back-top>
	</div>
</template>

<script>
	import {
		getHomeMultidata,
		getHomeGoods
	} from 'network/home'
	
	import HomeSwiper from './childComps/HomeSwiper.vue'
	import RecommendView from './childComps/RecommendView.vue'
	import FeatureView from './childComps/FeatureView.vue'
	
	import NavBar from 'components/common/navbar/NavBar.vue'
	import TabControl from 'components/content/tabControl/TabControl.vue'
	import GoodsList from 'components/content/goods/GoodsList.vue'
	import Scroll from 'components/common/scroll/Scroll.vue'
	import BackTop from 'components/content/backTop/BackTop.vue'
	
	import {debounce} from 'common/utils'
	import {itemListenerMixin} from 'common/mixin.js'
	
	export default {
		name: "Home",
		data(){
			return {
				banners:[],
				recommends:[],
				goods:{
					pop:{page:0, list:[]},
					new:{page:0,list:[]},
					sell:{page:0,list:[]}
				},
				currentType:'pop',
				isShow:false,
				tabOffsetTop:0,
				isTabFixed:false,
				saveY: 0
			}
		},
		mixins:[itemListenerMixin],
		components: {
			NavBar,
			HomeSwiper,
			RecommendView,
			FeatureView,
			TabControl,
			GoodsList,
			Scroll,
			BackTop
		},
		created() {
			this.getHomeMultidata()
			
			this.getHomeGoods('pop')
			this.getHomeGoods('new')
			this.getHomeGoods('sell')
		},
		mounted(){			
		},
		activated(){
			this.$refs.scroll.scrollTo(0,this.saveY)
			
			//此处刷新better-scroll 防止回到home时，滑动时突然滚到开始位置
			this.$refs.scroll.refresh()
		},
		deactivated(){
			this.saveY = this.$refs.scroll.scroll.y
			
			this.$bus.$off('itemImageLoad',this.itemImgListener)
		},
		methods:{
			getHomeMultidata(){
				getHomeMultidata().then(res => {
					this.banners = res.data.banner.list
					this.recommends = res.data.recommend.list
				})
			},
			getHomeGoods(type){
				const page = this.goods[type].page+1
				getHomeGoods(type,page).then(res=>{
					this.goods[type].list.push(...res.data.list)
					this.goods[type].page+=1
					
					this.$refs.scroll.finishPullUp()
				})
			},
			tabClick(index){
				switch(index){
					case 0:
						this.currentType='pop'
						break
					case 1:
						this.currentType='new'
						break
					case 2:
						this.currentType='sell'
				}
				this.$refs.tabControl2.currentIndex = index
				this.$refs.tabControl1.currentIndex = index
			},
			backClick(){
				this.$refs.scroll.scrollTo(0,0)
			},
			contentScroll(position){
				// if(position.y<-800){
				// 	this.isShow = true
				// }else{
				// 	this.isShow = false
				// }
				
				//这种写法更简洁
				this.isShow = (-position.y) > 800
				
				this.isTabFixed = (-position.y) > this.tabOffsetTop
			},
			loadMore(){
				this.getHomeGoods(this.currentType)
			},
			swiperImageLoad(){
				this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
			}
		}
	}
</script>

<style scoped>
	#home{
		position: relative;
		/* padding-top: 44px; */
		height: 100vh;
	}
	
	.home-nav {
		background-color: var(--color-tint);
		color: #fff;
		/* position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 9; */
	}
	
	.tab-control{
		position: relative;
		z-index: 9;
	}
	.content{
		position: absolute;
		top: 44px;
		left: 0;
		right: 0;
		
		/* calc() 之间运算符与操作数之间必须空格隔开*/
		height: calc(100% - 93px);
		overflow: hidden;
	}
	
</style>
