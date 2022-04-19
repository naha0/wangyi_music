<template>
	<div id="app">
		<el-container>
			<el-header class="header">
				<nav-bar></nav-bar>
			</el-header>
			<el-container class="home-container">
				<el-aside width="300px">
					<left-menu></left-menu>
				</el-aside>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
			<bottom-play></bottom-play>
		</el-container>
	</div>
</template>

<script>
	export default {
		name: 'app',
	}
</script>

<style scoped="">
	.header {
		padding: 0;
	}

	.home-container {
		height: calc(100vh - 60px);
		background-color: #FFFFFF;
	}

	.el-aside {
		height: 100%;
		background-color: #FFFFFF;
	}

	.el-main {
		padding: 0 20px;
		height: calc(100% - 50px);
	}
</style>
