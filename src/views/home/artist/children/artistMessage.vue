<template>
	<div v-if="artistInfo.cover" class="artistDetail">
		<!-- 歌单信息 -->
		<div class="listInfo">
			<!-- 歌单封面 -->
			<div class="listAvatar">
				<img :src="artistInfo.cover + '?param=200y200'" alt="" />
			</div>
			<div class="right">
				<!-- 标题 -->
				<div class="title">
					<div class="titleContent">{{ artistInfo.name }}</div>
				</div>
				<!-- 操作按钮 -->

				<div class="buttons">
					<el-button icon="el-icon-folder-add" round @click="subClick" size="mini">{{ isSub ? "已收藏" : "收藏" }}
					</el-button>
				</div>
				<!-- 歌曲列表的歌曲数量和播放量 -->
				<div class="otherInfo">
					<div class="musicNum">单曲数 : {{ artistInfo.musicSize }}</div>
					<div class="musicNum">专辑数 : {{ artistInfo.albumSize }}</div>
					<div class="musicNum">MV数 : {{ artistInfo.mvSize }}</div>
				</div>
			</div>
		</div>
		<!-- 歌曲列表 -->
		<div class="musicList">
			<el-tabs value="first">
				<el-tab-pane label="专辑" name="first">
					<div class="topSongs" v-if="topSongs.topSongs">
						<div class="topsong_album">
							<div class="topsong_cover">
								<img :src="topSongs.coverImgUrl || cover" alt=""  />
							</div>
							<div class="listContainer">
								<div class="list_title">热门50首</div>
								<table>
									<tr class="listRows" v-for="(item, index) in (topSongs.isOpen ? topSongs.topSongs : topSongs.topSongs.slice(0, 10))" :key="index" 
									@dblclick="handleRowDbClick(item)">
										<td class="index">{{ index + 1 }}</td>
										<td class="musicName">{{ item.name }}</td>
										<td class="time">{{ item.dt}}</td>
									</tr>
								</table>
								<div class="checkAll" @click="allTopSongs"  v-show="checkMoreResource">
									查看全部
								</div>
							</div>
						</div>
						<div class="albumItem" v-for="(item, index) in artistAlbum" :key="index">
							<div class="topsong_cover">
								<img :src="item.album.picUrl || cover" alt="" />
							</div>
							<div class="listContainer">
								<div class="list_title">{{item.album.name}}</div>
								<table>
									<tr class="listRows" v-for="(song, index1) in item.songs.slice(0, 10)" :key="index1" 
									@dblclick="handleRowDbClick(song)">
										<td class="index">{{ index1 + 1 }}</td>
										<td class="musicName">{{ song.name }}</td>
										<td class="time">{{ song.dt}}</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="歌手详情" name="third">
					<div class="artistDesc">{{ artistInfo.briefDesc }}</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	// 记录上一首播放的音乐信息  用于清空小喇叭和红字样式
	let currentRowInfo = {};
	// 定时器名称
	let timer;

	export default {
		name: "aritistmessage",
		data() {
			return {
				artistInfo: {},
				topSongs: {},
				artistAlbum: [],
				isAlbumMore: false,
				checkMoreResource:true,
				checkMoreResource1:true,
				isSub: false,
				cover: require('@/assets/images/home/topSongsLogo.png')
			};
		},
		methods: {
			// 请求
			// 请求歌手详情
			async getArtistInfo() {
				let res = await this.$api.reqArtistDetail(this.$route.query.id)
				console.log(res);
				this.artistInfo = res.data.artist;
			},
			// 请求歌手热门50首歌曲
			async getArtistTopSongs() {
				let res = await this.$api.reqArtistTopSong(this.$route.query.id)
				console.log(res);
				let topSongs = res.songs;
				topSongs.forEach((item, index) => {
					topSongs[index].dt = this.$utils.formatSecondTime(item.dt / 1000);
				});
				this.topSongs = {
					topSongs,
					isOpen: false
				};
			},
			// 请求专辑列表 再用专辑id查询专辑信息
			async getAlbumInfo() {
				let res = await this.$api.reqArtistAlbum({
					id: this.$route.query.id,
					limit: 20,
				})
				console.log(res)
				this.isAlbumMore = res.more;
				res = res.hotAlbums;
				await res.forEach((item) => {
					this.getAlbumDetail(item.id);
				});
				console.log("拿到了专辑数据并保存", this.artistAlbum);
			},
			// 请求专辑详情信息
			async getAlbumDetail(id) {
				let res = await this.$api.reqAlbum({
					id
				})
				let songs = res.songs;
				console.log(res)
				songs.forEach((item, index) => {
					songs[index].dt = this.$utils.formatSecondTime(item.dt / 1000);
				});
				res.songsObj = {
					songs
				};
				this.artistAlbum.push(res);
			},
			// 请求收藏的歌手列表
			async getSubArtistList() {
				let timestamp = Date.parse(new Date());
				let res = await this.$api.reqArtistSublist({
					limit: 1000,
					timestamp,
				})

				console.log(res);
				this.$store.commit("updateSubArtistList", res.data);
			},
			// 判断用户是否收藏了该歌手
			getIsSub() {
				this.isSub = this.$store.state.play.subArtistList.find(
					(item) => item.id == this.$route.query.id
				);
			},
			async subClick() {
				if (!this.$store.state.home.login.token) {
					this.$message.error("登录后再进行操作");
					return;
				}
				if (this.isCreated == true) {
					this.$message.warning('用户创建的歌单不可取消收藏！')
					return;
				}
				this.isSub = !this.isSub;
				console.log(this.$route.params.id)
				let timestamp = Date.parse(new Date());
				await this.$api.reqArtistSub({
					id: this.$route.query.id,
					t: this.isSub ? 1 : 0,
					timestamp,
				})
				let res = await this.$api.reqUserPlaylist({
					uid: this.$store.state.home.login.profile.userId,
					timestamp
				})
				this.getSubArtistList()
			},
			allTopSongs(){
				this.topSongs.isOpen = true;
				this.checkMoreResource = false
			},
			handleRowDbClick(item) {
				this.$store.commit("updateMusicId", item.id);
				let row1 = []
				row1.push(item)
				this.$store.commit('updateMusicList',{
					musicList: row1.concat(this.$store.state.play.musicList)
				})
			}
		},
		created() {
			this.getArtistInfo();
		},
		mounted() {
			this.getArtistTopSongs();
			this.getAlbumInfo();
			if (this.$store.state.home.login.token) {
					this.getIsSub();
			}
		},
		// watch:{
		// 	"$store.state.play.musicList":{
		// 		handler(newValue,oldValue){
		// 			newValue.forEach((item,index)=>{
		// 				if(item.dt.indexOf(':')!==-1){
		// 					let time = newValue[index].dt.split(':')
		// 					let min = time[0]
		// 					let sec = time[1]
		// 					newValue[index].dt = this.$utils.formatMiner(min,sec)
		// 					this.musicDetail = newValue[index]
		// 					// 直接从audio标签中的duration属性拿时长会有请求时差问题，所以直接在musicInfo中拿
		// 					this.duration = this.$store.state.play.musicList[index].dt;
		// 				}
		// 			})
		// 		}
					
		// 	}
		// }
	};
</script>

<style scoped>
	.singerDetail {
		overflow-y: scroll;
	}

	.listInfo {
		display: flex;
		padding: 25px 10px;
	}

	.listAvatar {
		width: 200px;
		height: 200px;
		overflow: hidden;
		border-radius: 10px;
		margin-right: 15px;
	}

	.listAvatar img {
		width: 100%;
	}

	.title {
		display: flex;
		align-items: center;
	}

	.titleTag {
		font-size: 12px;
		color: #ec4141;
		border: 1px solid #ec4141;
		padding: 1px 2px;
		border-radius: 2px;
		margin-right: 5px;
	}

	.titleContent {
		font-size: 25px;
		font-weight: 600;
		color: #373737;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.buttons {
		margin: 10px 0 0 5px;
		display: flex;
	}


	.playAll {
		background-color: #ec4141;
		color: white;
	}

	.otherInfo {
		margin: 15px 0 0 10px;
		display: flex;
		font-size: 14px;
	}

	.musicNum {
		margin-right: 15px;
	}

	.musicList {
		margin: 0 10px;
	}

	.title {
		font-size: 16px;
		font-weight: 600;
		color: black;
		margin-bottom: 10px;
	}

	.singerDesc {
		font-size: 12px;
		color: #373737;
		line-height: 25px;
		letter-spacing: 0.5px;
		text-indent: 2em;
	}

	.red {
		color: #ec4141;
	}

	/deep/ .el-tabs__active-bar {
		background-color: #ec4141;
		transition: none;
	}

	/deep/ .el-tabs__item:hover,
	.el-tabs__item.is-active {
		color: #000;
	}

	/deep/ .el-tabs__nav-wrap::after {
		background-color: transparent;
	}

	/deep/ .el-tabs__item.is-active {
		color: #ec4141;
	}

	.topsong_album,.albumItem {
		display: flex;
		margin: 20px 0 50px 0;
	}

	.topsong_cover {
		width: 200px;
		height: 200px;
		margin-right: 30px;
	}

	.topsong_cover img {
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}

	.listContainer {
		width: calc(100% - 300px);
	}

	.list_title {
		font-weight: 700;
		margin-bottom: 10px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		border-radius: 5px;
		overflow: hidden;
	}

	.listRows {
		height: 35px;
		font-size: 14px;
		line-height: 35px;
		color: #7f7f7f;
		width: 100%;
		display: flex;
		align-items: center;
		position: relative;
	}

	.listRows:nth-child(odd) {
		background-color: #f9f9f9;
	}

	.listRows:hover {
		background-color: #f4f4f4;
	}

	.index {
		text-align: center;
		font-size: 12px;
		width: 40px;
	}

	.listRows .musicName {
		color: rgb(31, 31, 31);
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		width: 80%;
	}

	.time {
		text-align: right;
		position: absolute;
		right: 80px;
		font-size: 12px;
		color: #7f7f94;
	}

	.checkAll {
		color: rgb(134, 134, 134);
		font-size: 12px;
		transform: scale(0.9) translateX(-5%);
		width: 100px;
		height: 30px;
		line-height: 30px;
		cursor: pointer;
	}

	.checkAll i {
		font-size: 12px;
	}

	.selectRow {
		background-color: #efefef !important;
	}

	tr {
		cursor: pointer;
	}
</style>
