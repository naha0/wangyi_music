<template>
	<div>
		<div class="artist">
			<div class="artist_first">
				<div class="artist_category">
					<span>语种:</span>
					<div v-for="(item,index) in area" :key="item.value" @click="changeArea(item.value)">{{item.name}}
					</div>
				</div>
			</div>
			<div class="artist_first">
				<div class="artist_category">
					<span>分类:</span>
					<div v-for="(item,index) in type" :key="item.value" @click="changeType(item.value)">{{item.name}}
					</div>
				</div>
			</div>
			<div class="artist_first">
				<div class="artist_category">
					<span>筛选:</span>
					<div v-for="(item,index) in initial" @click="changeItem(item)">{{item}}</div>
				</div>
			</div>
		</div>
		<div>
			<load-more :loadMoreData="firstArtist" isLoad @bottomLoad="bottomLoad" @clickLoadItem="clickLoadItem"></load-more>
		</div>
	</div>

</template>

<script>
	import loadMore from '@/components/common/loadMore/index.vue'
	export default {
		name: 'artistDetail',
		components: {
			loadMore
		},
		data() {
			return {
				type: [{
						name: '全部',
						value: -1
					},
					{
						name: '男歌手',
						value: 1
					},
					{
						name: '女歌手',
						value: 2
					},
					{
						name: '乐队',
						value: 3
					},
				],
				area: [{
						name: '全部',
						value: -1
					},
					{
						name: '华语',
						value: 7
					},
					{
						name: '欧美',
						value: 96
					},
					{
						name: '日本',
						value: 8
					},
					{
						name: '韩国',
						value: 16
					},
					{
						name: '其他',
						value: 0
					},
				],
				initial: ['热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
					'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'
				],
				firstArtist: [],
				currentPage: 1,
				isMore: false,
				areaData: -1,
				typeData: -1,
				initialData: -1,
			}
		},
		mounted() {
			this.getArtistList()
		},
		methods: {
			async getArtistList() {
				let res = await this.$api.reqArtistList({
					limit: 5,
					offset: (this.currentPage - 1) * 5,
					area: this.areaData,
					initial: this.initialData,
					type: this.typeData
				})
				console.log(res)
				this.firstArtist.push(...res.artists)
				this.isMore = res.more
			},
			changeArea(val) {
				this.areaData = val
				console.log(this.area)
				this.getArtistList()
			},
			changeType(val) {
				this.typeData = val
				console.log(this.type)
				this.getArtistList()
			},
			changeItem(val) {
				if (val == "热门") {
					this.initialData = -1
				} else if (val == "#") {
					this.initialData = 0
				} else {
					this.initialData = val
				}
				console.log(this.initialData)
				this.initialData = val
				this.getArtistList()
			},
			bottomLoad() {
				// 如果还有更多数据 则发送请求 将数据 push到数组
				if (this.isMore == true) {
					this.currentPage += 1;
					this.getArtistList();
				}
			},
			clickLoadItem(id){
				this.$router.push({path:'/home/aritistmessage',query:{id:id}})
			}
		},
		watch: {
			areaData: {
				handler(newValue, oldValue) {
					this.firstArtist = []
				}
			},
			initialData: {
				handler(newValue, oldValue) {
					this.firstArtist = []
				}
			},
			typeData: {
				handler(newValue, oldValue) {
					this.firstArtist = []
				}
			}
		}
	}
</script>

<style scoped>
	.artist {
		padding: 20px;
	}

	.artist_first {
		margin-top: 10px;
	}

	.artist_first span {
		margin-right: 20px;
		width: 50px;

	}

	.artist_category {
		display: flex;
	}

	.artist_category div {
		width: 50px;
		text-align: center;
		font-size: 14px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.artist_content {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
	}

	.artist_item {
		justify-content: flex-end;
		width: 18.4%;
		margin: 0 2% 20px 0;
	}

	.artist_item:nth-child(5n) {
		margin-right: 0;
	}

	.artist_item img {
		width: 100%;
		border-radius: 10px;
	}
</style>
