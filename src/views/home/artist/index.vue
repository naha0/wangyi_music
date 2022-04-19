<template>
	<div>
		<main-nav></main-nav>
		<artist-detail></artist-detail>
	</div>
</template>

<script>
	import MainNav from '@/components/content/MainNav/index.vue'
	import artistDetail from '@/components/content/MainHome/artistDetail.vue'
	export default{
		name:'artist',
		components:{
			MainNav,
			artistDetail
		}
	}
</script>

<style>
</style>