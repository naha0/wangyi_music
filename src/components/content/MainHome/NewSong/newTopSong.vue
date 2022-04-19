<template>
	<div>
		<el-table :data="gettopsong" style="width: 100%" stripe>
			<el-table-column type="index" width="70">
			</el-table-column>
			<el-table-column prop="album">
				<template slot-scope="{row,$index}">
					<img :src="row.album.picUrl" alt="" style="width: 50px;height: 50px;vertical-align: middle;">
					<span style="margin-left: 15px;">{{row.album.name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="album_artists.name" width="180">
			</el-table-column>
			<el-table-column prop="album.name">
			</el-table-column>
			<el-table-column prop="bMusic">
				<template slot-scope="{row,$index}">
					<div v-if="row.bMusic">
						{{$utils.formatSecondTime(row.bMusic.playTime / 1000)}}
					</div>
				</template>
			</el-table-column>
		</el-table>

	</div>
</template>

<script>
	export default {
		name: 'newTopSong',
		props: ['gettopsong'],
		
	}
</script>

<style scoped>

</style>
