<template>
	<div class="main-header">
		<el-menu :default-active="$route.path" mode="horizontal" router
			active-text-color="#dd4c53">
			<el-menu-item v-for="(item,idx) in menuList" :key="idx" :index="item.path" :router="{path:item.path}" class="activeItem">
				<router-link :to="item.path">{{item.title}}</router-link>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
	export default {
		name: 'MainNav',
		data() {
			return {
				key: 0,
				defaultActive: '',
				menuList:[
					{
						title:'个性推荐',
						name:'/hi',
						path:'/home/hi'
					},
					{
						title:'歌单',
						name:'/playlist',
						path:'/home/playlist'
					},
					{
						title:'歌手',
						name:'/artist',
						path:'/home/artist'
					},
					{
						title:'最新音乐',
						name:'/newsong',
						path:'/home/newsong'
					}
				]
			}
		},
		mounted() {
			
		},
		watch:{
			$route(){
				this.initHightlight()
			}
		},
		methods:{
			initHightlight(){
				console.log(this.$router.options)
			}
		}
	}
</script>

<style scoped="">
	.main-header {
		padding: 0;
		position: sticky;
		top: 0;
		background-color: #fff;
		width: 100%;
		z-index: 98;
	}

	.el-menu-item {
		font-size: 16px;
		font-weight: 500;
	}

	.el-menu {
		border-bottom: 0;
	}

	.activeItem {
		font-size: 18px;
		font-weight: 900;
	}

	a {
		text-decoration: none;
	}
</style>
