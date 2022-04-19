<template>
	<div>
		<div v-if="type=='ALL'" class="container">
			<div v-for="(item,index) in listdata.WeekData" class="containerItem">
				<div class="image">
					<img :src="item.picUrl + '?param=200y200'" alt="">
				</div>
				<div style="margin-top: 5px;">{{item.name}}</div>
				<div class="title">{{item.artist_name}}</div>
			</div>
		</div>
		<div v-else class="container">
			<div v-for="(item,index) in listdata.MonthData" class="containerItem">
				<div class="image">
					<img :src="item.picUrl + '?param=200y200'" alt="">
				</div>
				<div style="margin-top: 5px;">{{item.name}}</div>
				<div class="title">{{item.artist_name}}</div>
			</div>
		</div>
	</div>

</template>

<script>
	export default {
		name: 'songItem',
		props: ['listdata'],
		data() {
			return {
				type: ''
			}
		},
		mounted() {
			this.$bus.$on('topAlbumType', (val) => {
				this.type = val
				console.log(val)
			})
		}
	}
</script>

<style scoped="">
	.container {
		display: flex;
		flex-wrap: wrap;
		margin: 10px 0;
	}

	.containerItem {
		width: 23%;
		margin: 0 2% 20px 0;
		overflow: hidden;
		cursor: pointer;
	}

	.containerItem:nth-child(4n) {
		margin-right: 0;
	}

	.image {
		width: 100%;
		padding-bottom: 100%;
		height: 0;
		position: relative;
	}


	.image img {
		width: 100%;
		border-radius: 10px;
	}

	.title {
		margin-top: 8px;
		padding: 0 2px;
		font-size: 12px;
		color: black;
		line-height: 17px;
		/* 两行溢出 */
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
