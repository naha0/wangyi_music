<template>
	<div>
		<el-card class="personalized_card">
			<div class="personalized_head">
				<img :src="firstPlayList.coverImgUrl" alt="" class="bg">
				<div>
					<img :src="firstPlayList.coverImgUrl" alt="" class="bg1">
				</div>
				<div class="userinfo">
					<div class="tag">精品歌单</div>
					<div class="title">{{firstPlayList.name}}</div>
					<div class="info">{{firstPlayList.copywriter}}</div>
				</div>
			</div>
		</el-card>
		<div>
			<el-popover placement="right-start" width="700" trigger="click">
				<div>
					<div @click="GetPersonalized()">全部歌单</div>
					<div class="personalized-bottom">
						<span class="personalized-first">语种</span>
						<div class="personalized-item">
							<div v-for="(item,index) in getCategory0" @click="GetPersonalized(item.name)">{{item.name}}
							</div>
						</div>
					</div>
					<div class="personalized-bottom">
						<span class="personalized-first">风格</span>
						<div class="personalized-item">
							<div v-for="(item,index) in getCategory1" @click="GetPersonalized(item.name)">{{item.name}}
							</div>
						</div>
					</div>
					<div class="personalized-bottom">
						<span class="personalized-first">情感</span>
						<div class="personalized-item">
							<div v-for="(item,index) in getCategory2" @click="GetPersonalized(item.name)">{{item.name}}
							</div>
						</div>
					</div>
					<div class="personalized-bottom">
						<span class="personalized-first">主题</span>
						<div class="personalized-item">
							<div v-for="(item,index) in getCategory3" @click="GetPersonalized(item.name)">{{item.name}}
							</div>
						</div>
					</div>
				</div>

				<el-button slot="reference" style="margin-top: 20px;">{{defaultSong}}</el-button>
			</el-popover>
			<div class="getNav">
				<div v-for="(navItem,index) in getNav" :key="navItem.id" @click="GetPersonalized(navItem.name)">
					{{navItem.name}}
				</div>
			</div>
		</div>
		<load-more :loadMoreData="playList" @bottomLoad="bottomLoad" isLoad @clickLoadItem="clickLoadItem"></load-more>
	</div>
</template>

<script>
	import loadMore from '@/components/common/loadMore/index.vue'
	export default {
		name: 'personalized',
		components:{
			loadMore
		},
		data() {
			return {
				highqualityTag: [],
				firstPlayList: [],
				playList: [],
				defaultSong: '',
				currentPage:1,
				isMore:false
			}
		},
		mounted() {
			this.getPlaylistHighqualityTags()
			this.GetPersonalized()
		},
		methods: {
			async getPlaylistHighqualityTags() {
				let res = await this.$api.reqPlaylistHighqualityTags()
				this.highqualityTag = res.tags
				let res1 = await this.$api.reqTopPlaylist({
					cat: '全部',
					limit: 1
				})
				this.firstPlayList = res1.playlists[0]
			},
			async GetPersonalized(perName = "全部歌单") {
				this.defaultSong = perName
				let res1 = await this.$api.reqPlaylistHighquality({
					cat: perName,
					limit: 1
				})
				this.firstPlayList = res1.playlists[0]
				this.TopPlaylist()
				
			},
			async TopPlaylist(){
				let res = await this.$api.reqTopPlaylist({
					cat: this.defaultSong,
					limit: 10,
					offset:(this.currentPage - 1)*10
				})
				console.log(res)
				this.playList.push(...res.playlists)
				this.isMore = res.more
			},
			async clickLoadItem(id) {
				this.$router.push(`/playdetail/${id}`)
				let res = await this.$api.reqPlaylistDetail(id)
				let reslist = await this.$api.reqPlaylistAll(id)
				this.$bus.$emit('playdetail',res)
				this.$bus.$emit('playlistAll',reslist)
				this.$bus.$emit('playlistId',id)
			},
			bottomLoad() {
			  // console.log("bottomLoad");
			  // 如果还有更多数据 则发送请求 将数据 push到数组
			  if (this.isMore == true) {
			    this.currentPage += 1;
			    this.TopPlaylist();
			  }
			},
		},
		watch:{
			defaultSong:{
				handler(newValue,oldValue){
					this.playList = []
				}
			}
		},
		computed: {
			getCategory0() {
				return this.highqualityTag.filter(item => item.category == 0)
			},
			getCategory1() {
				return this.highqualityTag.filter(item => item.category == 1)
			},
			getCategory2() {
				return this.highqualityTag.filter(item => item.category == 2)
			},
			getCategory3() {
				return this.highqualityTag.filter(item => item.category == 3)
			},
			getNav() {
				return this.highqualityTag.slice(0, 10)
			}
		},

	}
</script>

<style scoped="">
	/deep/ .el-card__body {
		margin: 0;
		padding: 0;
		position: relative;
		top: 0;
		display: flex;
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.personalized-first {
		float: left;
		margin-right: 80px;
		color: #DDDDDD;
	}

	.personalized-bottom {
		margin: 20px 10px;
	}

	.personalized-item {
		display: flex;
		flex-wrap: wrap
	}

	.personalized-item div {
		width: 70px;
		margin-bottom: 10px;
	}

	.personalized_head {
		width: 100%;
		height: 100%;
		position: absolute;
		background: rgba(0, 0, 0, .3);
	}

	.personalized_head .bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		filter: blur(50px);
		z-index: 0;
	}

	.personalized_head div .bg1 {
		left: 20px;
		top: 20px;
		width: 150px;
		height: 150px;
		z-index: 1;
		position: absolute;
		vertical-align: middle;
	}

	.userinfo {
		position: absolute;
		top: 20px;
		left: 200px;
	}

	.tag {
		padding: 5px;
		color: #ffc063;
		border-radius: 10px;
		border: 2px solid #ffc063;
		width: 80px;
		text-align: center;
	}

	.title {
		margin: 15px 0;
		color: #fff;
	}

	.info {
		margin: 10px 0 0;
		color: grey;
		font-size: 16px;
	}

	.getNav {
		margin-top: 20px;
		float: right;
		display: flex;
	}

	.getNav div {
		margin-left: 20px;
	}
</style>
