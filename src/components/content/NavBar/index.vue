<template>
	<div class="home-header">
		<div class="icon-box" @click="$router.push('/home/hi')">
			<svg t="1647687342230" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
				p-id="12746" width="30" height="30">
				<path
					d="M995 538.7c-13.8-8.9-30.3-12-46.4-8.5l-182.9 39.3c-28.2 6.1-48.6 31.4-48.6 60.2v224.6c0 21.8-17.7 39.5-39.6 39.5-21.8 0-39.5-17.7-39.5-39.5s17.7-39.6 39.5-39.6c15.4 0 27.8-12.4 27.8-27.8s-12.4-27.8-27.8-27.8c-52.4 0-95.1 42.7-95.1 95.2 0 52.4 42.7 95.1 95.1 95.1 52.5 0 95.1-42.7 95.1-95.1V629.8c0-2.9 2-5.3 4.8-5.9l182.9-39.3c1.9-0.5 3.6 0.2 4.5 0.8 1 0.6 2.2 1.8 2.7 5V814c0 21.8-17.7 39.6-39.6 39.6-10.5 0-20.5-4.1-27.9-11.6-7.5-7.5-11.6-17.4-11.6-28 0-21.8 17.7-39.6 39.6-39.6 15.4 0 27.8-12.4 27.8-27.8s-12.4-27.8-27.8-27.8c-52.5 0-95.1 42.7-95.1 95.1 0 25.4 9.9 49.3 27.9 67.3s41.8 27.9 67.2 27.9c52.5 0 95.1-42.7 95.1-95.1V590.5c0-4.4-0.5-8.7-1.4-12.9-3.4-16.1-12.9-29.9-26.7-38.9z"
					fill="#ffffff" p-id="12747"></path>
				<path
					d="M338.3 315.1c35.3-63.9 90.4-114.1 158.6-143.6 81.4-35.2 171.7-36.6 254.1-3.9 106.7 42.3 183 134.9 204.1 247.8 3.1 16.7 17.7 28.4 34.1 28.4 2.1 0 4.3-0.2 6.4-0.6 18.9-3.5 31.3-21.7 27.8-40.5C997.9 266.2 905.7 154.1 776.6 103c-99.7-39.5-208.8-37.8-307.3 4.7-92.5 40-165.1 111.6-206.4 202.8-48.9 3.6-96.2 19.8-137.8 48C62.2 400.9 19.7 465.3 5.3 539.7c-14.4 74.4 1 150 43.5 212.9 52.9 78.3 140.8 125 235.2 125h153.3c19.2 0 34.7-15.6 34.7-34.7s-15.6-34.7-34.7-34.7H284c-71.3 0-137.7-35.3-177.7-94.4C74.2 666.3 62.6 609.3 73.5 553c10.9-56.2 43-104.8 90.5-136.9 47.5-32.1 104.5-43.7 160.8-32.8 56.2 10.9 104.8 43 136.9 90.5 10.7 15.9 32.3 20.1 48.2 9.3 15.9-10.7 20.1-32.3 9.3-48.2-42.4-62.8-106.6-105.3-180.9-119.8z"
					fill="#ffffff" p-id="12748"></path>
			</svg>
			<span class="icon-text">某易云音乐</span>
		</div>
		<div class="buttons">
		  <i class="el-icon-arrow-left goClick" @click="$router.go(-1)"></i>
		  <i class="el-icon-arrow-right goClick" @click="$router.go(1)"></i>
		</div>
		<search-input></search-input>
		<div class="header-icon">
			<div class="block" @click="goLogin">
				<el-avatar fit="fill" :size="30"
					:src="login.profile.avatarUrl?login.profile.avatarUrl:circleUrl"></el-avatar>
					{{login.profile.nickname?login.profile.nickname:'未登录'}}
			</div>
			<div class="logout" @click="getlogout" v-if="login.profile.nickname">退出</div>
		</div>
		<login ref="login"></login>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import searchInput from './search/searchInput.vue'
	import login from './login/login.vue'
	export default {
		name: 'NavBar',
		components: {
			searchInput,
			login
		},
		data() {
			return {
				activeIndex: 0,
				circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
				searchShow: false,
			}
		},
		methods: {
			goLogin() {
				this.$refs.login.loginVisible = true
			},
			search() {
				this.searchShow = true
			},
			async getlogout(){
				let res = await this.$api.reqLogout()
				if(res.code == 200){
					this.$store.commit('logout')
				}
			}

		},
		computed: {
			...mapState({
				login:(state) => state.home.login
			}),
		},
		beforeUpdate() {
			window.sessionStorage.setItem('avatarUrl',this.login.profile.avatarUrl)
			window.sessionStorage.setItem('nickname',this.login.profile.nickname)
			window.sessionStorage.setItem('userId',this.login.profile.userId)
			window.sessionStorage.setItem('token',this.login.token)
			window.sessionStorage.setItem('code',this.login.code)
		},
		mounted() {
			this.$store.state.home.login.profile.avatarUrl = window.sessionStorage.getItem('avatarUrl')
			this.$store.state.home.login.profile.nickname = window.sessionStorage.getItem('nickname')
			this.$store.state.home.login.profile.userId = window.sessionStorage.getItem('userId')
			this.$store.state.home.login.token = window.sessionStorage.getItem('token') 
			this.$store.state.home.login.code = window.sessionStorage.getItem('code') 
			this.$store.dispatch('getLoginState')
		},
	}
</script>

<style scoped="">
	.home-header {
		position: relative;
		width: 100%;
		height: 60px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: #ec4141;
		z-index: 500 !important;
	}

	.icon-box {
		margin-left: 100px;
		line-height: 60px;
		width: 180px;
		cursor: pointer;
	}

	.icon {
		vertical-align: text-bottom;
	}

	.icon-text {
		color: #fff;
		font-weight: 600;
		font-family: "ocr a extended";
		margin-left: 15px;
		letter-spacing: 3px;
	}
	.header-icon{
		display: flex;
		justify-content: center;
		/* width: 150px; */
		line-height: 60px;
		font-size: 14px;
		color: #fff;
	}
	.block {
		cursor: pointer;
	}

	.block /deep/ .el-avatar {
		vertical-align: middle;
	}

	.register_next {
		width: 84px;
		height: 40px;
		margin: 0 auto;
	}

	.logout {
		font-size: 14px;
		margin-left: 20px;
		/* line-height: 65px; */
		color: #fff;
	}
	.porbidclick{
		pointer-events: none;
	}
	.buttons{
		display: flex;
		align-items: center;
		position: absolute;
		left: 300px;
		height: 60px;
		text-align: center;
	}
	.goClick{
		background-color: #d93b3b;
		color: #e37171;
		height:30px;
		width: 30px;
		line-height: 30px;
		border-radius: 50%;
		margin-right: 15px;
		
	}
</style>
