<template>
	<div>
		<main-nav></main-nav>
		<div class="newsong-bigbox">
			<div class="newsong-headerbox" ref="newsongheaderbox" @click="activeSpan">
				<span v-for="(item,index) in list" :key="item.id" :data-index="index"
					:class="{'activespan':currentIndex==index,'hoverspan':currentIndex1==index}" @mouseenter="enterSpan"
					@mouseleave="leaveSpan">{{item.text}}</span>
			</div>
			<div class="newsong-centerbox" v-if="currentIndex==0">
				<div v-for="(item,index) in areasong" :key="item.value" class="newsong-centerhead"
					@click="TopSongList(item)">{{item.text}}</div>
				<new-top-song :gettopsong="gettopsong"></new-top-song>

			</div>
			<div class="newsong-centerbox" v-else>
				<div v-for="(item,index) in areaalbum" :key="item.value" class="newsong-centerhead"
					@click="TopAlbumList(item)">{{item.text}}</div>
				<new-top-album :gettopalbum="gettopalbum"></new-top-album>
			</div>
		</div>
	</div>
</template>

<script>
	import MainNav from '@/components/content/MainNav/index.vue'
	import newTopSong from '@/components/content/MainHome/NewSong/newTopSong.vue'
	import newTopAlbum from '@/components/content/MainHome/NewSong/newTopAlbum.vue'
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'newsong',
		components: {
			MainNav,
			newTopSong,
			newTopAlbum
		},
		data() {
			return {
				type: 7,
				type1: 'ALL',
				list: [{
						text: '新歌速递',
						id: '0',
					},
					{
						text: '新碟上架',
						id: '1'
					},
				],
				currentIndex: 0,
				// 鼠标移走
				currentIndex1: -1,
				areasong: [{
						value: 0,
						text: "全部"
					},
					{
						value: 7,
						text: "华语"
					},
					{
						value: 96,
						text: "欧美"
					},
					{
						value: 8,
						text: "日本"
					},
					{
						value: 16,
						text: "韩国"
					}
				],
				areaalbum: [{
						value: 'ALL',
						text: "全部"
					},
					{
						value: 'ZH',
						text: "华语"
					},
					{
						value: 'EA',
						text: "欧美"
					},
					{
						value: 'JP',
						text: "日本"
					},
					{
						value: 'KR',
						text: "韩国"
					}
				],
				topAlbumYear: 0,
				topAlbumMonth: 0,
				limit: 30,
				offset: 0,
			}
		},
		mounted() {
			this.TopSong()
		},
		methods: {
			async TopSong() {
				await this.$store.dispatch('getTopSong', {
					type: this.type
				})
				// let res = await this.$api.reqTopSong(this.type)
			},
			async TopAlbum() {
				await this.$store.dispatch('getTopAlbum', {
					offset: this.offset,
					limit: this.limit,
					area: this.type1,
					year: this.topAlbumYear,
					month: this.topAlbumMonth
				})
			},
			activeSpan(e) {
				this.currentIndex = e.target.dataset.index
				if (this.currentIndex == 1) {
					let nowData = this.$utils.addDate().split('-')
					this.topAlbumYear = nowData[0]
					this.topAlbumMonth = nowData[1]
					this.TopAlbum()
				}
			},
			enterSpan(e) {
				this.currentIndex1 = e.target.dataset.index
			},
			leaveSpan() {
				this.currentIndex1 = -1
			},
			TopSongList(item) {
				this.type = item.value
				this.TopSong()
			},
			async TopAlbumList(item) {
				this.type1 = item.value
				// this.TopAlbum()
				this.$bus.$emit('topAlbumType',this.type1)
			},
		},
		computed: {
			...mapGetters(["gettopsong","gettopalbum"]),
		},
		watch:{
			type1:{
				immediate: true,
				handler(newValue,oldValue){
						this.TopAlbum()
				},
				deep:true
			}
		}
	}
</script>

<style scoped>
	.newsong-bigbox {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.newsong-headerbox {
		margin: 20px auto;
		display: flex;
		justify-content: center;
		width: 250px;
		height: 25px;
		border-radius: 25px;
		border: 1px solid #bbbbbb;
	}

	.newsong-headerbox span {
		width: 125px;
		height: 25px;
		border-radius: 25px;
		text-align: center;
		line-height: 25px;
		font-size: 14px;
	}

	.hoverspan {
		background-color: #e7e7e7;
	}

	.activespan {
		background-color: #bbbbbb;
		color: #fff;
	}

	.newsong-centerbox {
		width: 1200px;
		height: 600px;
	}

	.newsong-centerhead {
		display: inline-block;
		margin-right: 20px;
		font-size: 14px;
		font-weight: 500;
	}
</style>
