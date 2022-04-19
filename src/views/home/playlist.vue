<template>
	<div>
		<main-nav></main-nav>
		<personalized></personalized>
	</div>
</template>

<script>
	import MainNav from '@/components/content/MainNav/index.vue'
	import personalized from '@/components/content/MainHome/personalized.vue'
	export default {
		name: 'playlist',
		components: {
			personalized,
			MainNav
		}
	}
</script>

<style scoped>

</style>
