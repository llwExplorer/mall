<template>
	<div class="cart">
		<nav-bar class="nav-bar">
			<template v-slot:center>
				<div>
					购物车({{cartLength}})
				</div>
			</template>
		</nav-bar>
		<scroll class="content" ref="scroll">
			<cart-list></cart-list>
		</scroll>
		<cart-bottom-bar></cart-bottom-bar>
	</div>
</template>

<script>
	import NavBar from 'components/common/navbar/NavBar.vue'
	import CartList from './childComps/CartList.vue'
	import Scroll from 'components/common/scroll/Scroll.vue'
	import CartBottomBar from './childComps/CartBottomBar.vue'
	
	import {mapGetters} from 'vuex'

	export default {
		name: "Cart",
		components: {
			NavBar,
			CartList,
			Scroll,
			CartBottomBar
		},
		computed:{
			...mapGetters([
				'cartList',
				'cartLength'
			])
		},
		activated() {
			this.$refs.scroll.refresh()
		}
	}
</script>

<style scoped>
	.nav-bar{
		position: relative;
		background-color: var(--color-tint);
		color: #fff;
		z-index: 9;
	}
	.cart{
		height: 100vh;
	}
	.content{
		position: relative;
		height: calc(100% - 44px - 49px);
		overflow: hidden;
	}
</style>
