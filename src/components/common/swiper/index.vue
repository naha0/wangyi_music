<template>
	<div class="swiper-box">
		<div class="swiper-container" ref="cur">
			<div class="swiper-wrapper">
				<div class="swiper-slide" v-for="(image,index) in bannerList" :key="image.targetId">
					<img :src="image.imageUrl" alt="">
				</div>
			</div>
			<!-- 如果需要分页器 -->
			<div class="swiper-pagination"></div>
		
			
		</div>
		<!-- 如果需要导航按钮 -->
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>
	
</template>

<script>
	import Swiper from 'swiper'
	export default {
		name:'swiper',
		props:['bannerList'],
		data(){
			return{
				
			}
		},
		watch: {
			bannerList(newValue, oldValue) {
				this.$nextTick(() => {
					new Swiper(this.$refs.cur, {
						// 无线循环
						loop: true,
						// 时间
						speed:800,
						effect : 'fade',
						// 如果需要分页器
						pagination: {
							el: ".swiper-pagination",
							//点击小球的时候也切换图片
							clickable: true,
						},
						// 如果需要前进后退按钮
						navigation: {
							nextEl: ".swiper-button-next",
							prevEl: ".swiper-button-prev",
						},
						autoplay:{
							delay:3000,
							stopOnLastSlide:false,
						},
						observer:true,
						observerParents:true
					});
				});
			}
		}
	}
</script>

<style scoped="">
	.swiper-box{
		height: 300px;
		width: 1000px;
		margin: 15px auto;
		position: relative;
	}
	.swiper-container /deep/{
		height: 300px;
		width: 900px;
		border-radius: 10px;
	}
	.swiper-slide{
		position: relative;
	}
	img{
		width: 100%;
		height: 100%;
	}
	.swiper-button-prev,.swiper-button-next{
		color: #000000;
	}
</style>
