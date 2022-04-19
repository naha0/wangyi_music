<template>
	<div style="margin-top: 10px;">
		<div class="fix-album" style="float: left;">本周新碟</div>
		<div>
			<song-item :listdata="gettopalbum"></song-item>
		</div>

	</div>
</template>

<script>
	import songItem from './songItem/index.vue'
	export default {
		name: 'newTopAlbum',
		props: ["gettopalbum"],
		components:{
			songItem,
		},
		data() {
			return {
			}
		},
		methods: {
			getAddData() {
				let res = this.$utils.addDate()
			},

		}
	}
</script>

<style scoped>
	.fix-album {
		height: 100%;
		position: sticky;
		top: 60px;
		width: 50px;
		font-size: 18px;
		font-weight: 800;
	}

</style>
