<template>
	<div class="wrapper" ref="aaa">
		
	</div>
</template>

<script>
	import BScroll from 'better-scroll'

	export default {
		name: "Category",
		data(){
			return {
				scroll:null
			}
		},
		mounted(){
			this.scroll = new BScroll(this.$refs.aaa,{
				click:true
			})
		},
		methods: {
		  btnClick() {
		    console.log('btnClick');
		  },
		  divClick() {
		    console.log('divClick');
		  }
		}
	}
</script>

<style scoped>
	.wrapper{
		height: 150px;
		background-color: pink;
		
		overflow: hidden;
	}
</style>
