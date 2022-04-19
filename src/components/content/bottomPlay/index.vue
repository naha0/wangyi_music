<template>
	<div class="bottomControl">
		<audio autoplay ref="audioPlayer" :src="musicUrl" @play="changeState(true)" @ended="Ended"
			@timeupdate="timeUpdate"></audio>
		<!-- 左边 -->
		<div class="left">
			<div class="avatar">
				<img :src="musicDetail.al.picUrl" alt="" v-if="musicDetail.al" :draggable="false" @click="isShowLyric">
				<img src="~/assets/images/home/cloundMusic.png" alt="" v-else>
			</div>
			<div class="musicInfo">
				<div class="musicName">
					<span>{{musicDetail.name}}</span>
					<div class="likeSong">
						<img src="~/assets/images/home/like.svg" v-show="!$store.state.play.changeLike" @click="isLike"
							alt="">
						<img src="~/assets/images/home/fillLike.svg" v-show="$store.state.play.changeLike"
							@click="isLike" alt="">
					</div>
				</div>
				<div class="singer" v-if="musicDetail&&musicDetail.length>=0">
					{{musicDetail | rmlength}}
				</div>
			</div>

		</div>
		<!-- 中间 -->
		<div class="center">
			<div class="buttons">
				<span><i class="el-icon-caret-left"
						@click="$store.state.play.musicList.length> 1 ? changeMusic('pre'): ''"></i></span>
				<span class="buttons_center">
					<i class="el-icon-video-play" v-show="!$store.state.play.isPlay"
						@click="$store.state.play.musicList.length!== 0 ? StartMusic(): ''" ref="startmusic"></i>
					<i class="el-icon-video-pause" v-show="$store.state.play.isPlay" @click="PauseMusic"
						ref="pausemusic"></i>
				</span>
				<span><i class="el-icon-caret-right"
						@click="$store.state.play.currentIndex < $store.state.play.musicList.length ? changeMusic('next'): ''"></i></span>
			</div>
			<div class="progressBar">
				<span class="currentTime">{{$utils.handleMusicTime($store.state.play.currentTime)}}</span>
				<el-slider class="progressSlider" :show-tooltip="false" v-model="timeProgress" @change="changeProgress"
					style="width: 500px;">
				</el-slider>
				<span class="totalTime">{{$utils.formatSecondTime(musicDetail.dt / 1000)}}</span>
			</div>
		</div>
		<!-- 右边 -->
		<div class="right">
			<div class="volumeControl">
				<el-popover placement="top" style="width: 30px;" trigger="click" width="30px">
					<el-slider class="volumeSlider" v-model="volume" :show-tooltip="false" style="width: 150px;"
						@change="changeSound">
					</el-slider>
					<img src="~/assets/images/home/sound.svg" alt="" slot="reference" />
				</el-popover>
			</div>
			<div class="playList" @click="openDrawer">
				<img src="~/assets/images/home/playList.svg" alt="">
			</div>
		</div>
		<!-- 抽屉 -->
		<el-drawer size="30%" :visible.sync="drawer" :modal="false" :append-to-body="true" style="z-index: 200;" class="smalldrawer">
			<h1 style="margin-left: 20px;">当前播放</h1>
			<div class="drawerHeader">
				<span>总{{ $store.state.play.musicList.length }}首</span>
				<span class="clearSongList" @click="clearSongList">清空列表</span>
			</div>
			<el-table :data="$store.state.play.musicList" stripe style="width: 100%" :show-header="false"
				highlight-current-row lazy @row-dblclick="clickCurrentPlayList">
				<el-table-column prop="name"> </el-table-column>
				<el-table-column prop="ar[0].name"> </el-table-column>
				<el-table-column prop="dt" width="100px">
					<template slot-scope="{row,$index}">
						{{$utils.formatSecondTime(row.dt / 1000)}}
					</template>
				</el-table-column>
			</el-table>
		</el-drawer>
		<home-lyric ref="homelyric" :isLyric="lyric" :lyricComment="lyricComment"></home-lyric>
	</div>
</template>

<script>
	import HomeLyric from '../HomeLyric/index.vue'
	export default {
		name: "bottomPlay",
		components:{
			HomeLyric
		},
		data() {
			return {
				musicUrl: "",
				musicDetail: {},
				// 进度条位置
				timeProgress: 0,
				duration: 0,
				isbooth: false,
				drawer: false,
				volume: 30,
				lyric:{},
				lyricComment:{},
				musicIndex:0
			}
		},
		methods: {
			async getMusicDetail(id) {
				this.$store.commit("updateMusicLoadState", true);
				let res = await this.$api.reqSongUrl(id)
				// this.musicDetail = res.data
				this.musicUrl = res.data[0].url;
				if (this.musicUrl == null) {
					this.$message.error("需要会员才能收听");
					return;
				}
				this.$store.commit("updateMusicLoadState", false);
			},
			// 是否显示大抽屉
			async isShowLyric(){
				this.$store.commit('getLyric')
				// console.log(1111111111)
				let res = await this.$api.reqLyric(this.$store.state.play.musicId)
				// 处理歌词，转化成key为时间，value为歌词的对象
				let lyricArr = res.lrc.lyric.split('[').slice(1); // 先以[进行分割
				let lrcObj = {};
				lyricArr.forEach(item => {
				    let arr = item.split(']');	// 再分割右括号
				    // 时间换算成秒
				    let m = parseInt(arr[0].split(':')[0])
				    let s = parseInt(arr[0].split(':')[1])
				    arr[0] = m*60 + s;
				    if (arr[1] != '\n') { // 去除歌词中的换行符
				        lrcObj[arr[0]] = arr[1];
				     }
				 })
				this.lyric = lrcObj;
				let timestamp = Date.parse(new Date())
				let res1 = await this.$api.reqPlayComment({
					id:this.$store.state.play.musicId,
					type:0,
					sortType:2,
					timestamp
				})
				this.lyricComment = res1.data
			},
			// audio开始或暂停播放的回调  在vuex中改变状态
			changeState(state) {
				this.$store.commit("changePlayState", state);
			},
			// 根据id找到 musicList中对应的musicDetail
			fromMusicIdGetMusicDetail() {
				let index = this.$store.state.play.musicList.findIndex(
					item => item.id == this.$store.state.play.musicId
				);
				if (index !== -1) {
					// 将索引传至vuex
					this.$store.commit("updateCurrentIndex", index);
				}
				this.musicDetail = this.$store.state.play.musicList[index]
				// 直接从audio标签中的duration属性拿时长会有请求时差问题，所以直接在musicInfo中拿
				this.duration = this.$store.state.play.musicList[index].dt;
			},
			// 当前播放时间位置
			timeUpdate() {
				let musicStart = 0
				if(this.$store.state.play.musicList.length!==0){
					// console.log(time)
					let time = this.$refs.audioPlayer.currentTime
					this.$store.commit("updateCurrentTime", time);
					time = Math.round(time);
					let dt = Math.round(this.duration / 1000)
					if (time !== musicStart) {
						this.$store.state.play.currentTime = time;
						// 计算进度条的位置
						this.timeProgress = Math.round(time / dt * 100)
							if(this.$refs.audioPlayer.ended){
								this.Ended()
							}
					}
				}
			},
			// 判断音频是否已播放结束
			Ended() {
				this.$store.commit('updateCurrentTime',0)
				this.timeProgress = 0
				this.$store.commit('changePlayState',false)
			},
			// 拖动进度条
			changeProgress(e) {
				let goTime = Math.round(e / 100 * this.duration / 1000)
				console.log(goTime)
				this.$refs.audioPlayer.currentTime = goTime
			},
			// 点击开始 播放音乐
			StartMusic() {
				this.$refs.audioPlayer.play()
				this.$store.commit('changePlayState', true)
				this.timeUpdate()
			},
			// 点击暂停 停止音乐
			PauseMusic() {
				console.log(333)
				this.$refs.audioPlayer.pause();
				this.$store.commit('changePlayState', false)
			},
			// 点击上一首下一首 
			changeMusic(type) {
				// let currentIndex = this.$store.state.play.currentIndex
				if (type == 'pre') {
					let preIndex = this.$store.state.play.currentIndex - 1
					this.$store.state.play.musicId = this.$store.state.play.musicList[preIndex].id
				}
				if (type == 'next') {
					let nextIndex = this.$store.state.play.currentIndex + 1
					this.$store.state.play.musicId = this.$store.state.play.musicList[nextIndex].id
				}
			},
			// 用户喜欢的歌单
			UserLikeList() {
				let userId = this.$store.state.home.login.profile.userId
				var timestamp = Date.parse(new Date())
				if (userId) {
					let res = this.$api.reqLikelist({
						uid: userId,
						timestamp
					}).then(res => {
						if (res.code == 200) {
							this.$store.commit('likesList', res.ids)
						}
					}).catch(err => this.$messgae.error(err))
					// console.log(res)

				}
			},
			// 判断用户是否喜欢
			checkUserLike() {
				if (this.$store.state.home.login.profile.userId) {
					// this.$message.error('此操作需要用户登录')
					return false
				}
				this.UserLikeList()
				this.isbooth = this.$store.state.play.likeList.some(item => {
					return item == this.$store.state.play.musicId
				})
				this.$store.commit('changeSongLike', this.isbooth)


			},
			// 点击喜欢
			async isLike() {
				if (!this.$store.state.home.login.profile.userId) {
					return false
				}
				await this.UserLikeList()
				if (this.$store.state.play.changeLike == true) {
					this.$store.commit('changeSongLike', false)
					await this.$api.reqLikeSong(this.$store.state.play.musicId, this.$store.state.play.changeLike)
					await this.UserLikeList()
					console.log(this.$store.state.play.changeLike)
					return;
				}
				if (this.$store.state.play.changeLike == false) {
					this.$store.commit('changeSongLike', true)
					await this.$api.reqLikeSong(this.$store.state.play.musicId, this.$store.state.play.changeLike)
					await this.UserLikeList()
					console.log(this.$store.state.play.changeLike)
					return;
				}
			},
			// 点击打开抽屉的回调
			openDrawer() {
				this.drawer = !this.drawer
			},
			// 清空播放列表
			clearSongList() {
				this.PauseMusic()
				this.$store.state.play.musicList = []
			},
			// 点击当前播放列表的单元格播放音乐
			clickCurrentPlayList(row) {
				this.$store.commit("updateMusicId", row.id);
			},
			// 拖动进度条改变音量大小
			changeSound(e) {
				this.$refs.audioPlayer.volume = e / 100
			},
		},
		watch: {
			"$store.state.play.musicId": {
				// immediate:true,
				handler(newValue, oldValue) {
					// console.log(newValue)
					// this.PauseMusic()
					this.getMusicDetail(newValue)
					this.fromMusicIdGetMusicDetail()
					this.timeUpdate()
					this.checkUserLike()
				},
			},
			'$store.state.play.isPlay': {
				handler(newValue, oldValue) {
					if (newValue) {
						this.StartMusic();
					} else {
						this.PauseMusic();
					}
				}
			},
			"$store.state.play.token": {
				handerle(newValue, oldValue) {
					if (newValue) {
						this.UserLikeList();
					} else {
						this.$store.state.play.likesList = [];
					}
				}
			},
			// "$store.state.play.musicList":{
			// 	handler(newValue,oldValue){
			// 		if(this.$store.state.play.musicList[this.musicIndex].dt.indexOf(':') == -1){
			// 			this.musicDetail = this.$store.state.play.musicList[this.musicIndex]
			// 			// 直接从audio标签中的duration属性拿时长会有请求时差问题，所以直接在musicInfo中拿
			// 			this.duration = this.$store.state.play.musicList[this.musicIndex].dt;
			// 			return;
			// 		}else{
			// 			let time = this.$store.state.play.musicList[this.musicIndex].dt.split(':')
			// 			let min = time[0]
			// 			let sec = time[1]
			// 			this.$store.state.play.musicList[this.musicIndex].dt = this.$utils.formatMiner(min,sec)
			// 			this.musicDetail = this.$store.state.play.musicList[this.musicIndex]
			// 			// 直接从audio标签中的duration属性拿时长会有请求时差问题，所以直接在musicInfo中拿
			// 			this.duration = this.$store.state.play.musicList[this.musicIndex].dt;
			// 			return;
			// 		}
			// 	}
			// }
		},
		filters: {
			rmlength(value) {
				if (value.length > 1) {
					return value.ar.map(item => item.name).join(' / ');
				} else if (value.ar.length == 1) {
					return value.ar[0].name;
				} else {
					return;
				}
			}
		},

	}
</script>

<style scoped="">
	.bottomControl {
		border-top: 1px solid #ddd;
		width: 100%;
		height: 55px;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		padding: 6px 10px;
		z-index: 1000;
		background-color: #fff;
	}

	.left {
		display: flex;
		align-items: center;
		width: 250px;
		z-index: 1000;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 5px;
		overflow: hidden;
		margin-right: 10px;
		cursor: pointer;
	}

	.avatar img {
		width: 100%;
	}

	.musicInfo {
		color: rgb(37, 37, 37);
		font-size: 14px;
		width: 200px;
	}

	.musicName {
		display: flex;
	}

	.musicName span {
		margin-bottom: 4px;
		width: 170px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.like {
		background-color: #ec4141 !important;
	}

	.likeSong {
		width: 20px;
		height: 20px;
		margin-left: 10px;
	}

	.likeSong img {
		width: 100%;
		height: 100%;

	}

	.singer {
		font-size: 12px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}

	.center {
		margin-top: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 1000;
	}

	.buttons {
		display: flex;
		align-items: center;
		height: 13px;
	}

	.buttons i {
		font-size: 20px;
		color: #313131;
	}

	.buttons_center i {
		font-size: 28px;
		color: #313131;
	}

	.right {
		display: flex;
		align-items: center;
		position: relative;
		width: 180px;
		z-index: 1000;
	}

	.volumeControl {
		display: flex;
		align-items: center;
		margin-right: 25px;
	}

	.progressSlider {
		width: 50px;
	}

	.buttons span {
		display: inline-block;
		width: 50px;
		box-sizing: border-box;
		text-align: center;
	}

	.el-drawer__wrapper /deep/ {
		z-index: 400 !important;
	}

	.drawerHeader {
		font-size: 12px;
		color: #aaa;
		display: flex;
		justify-content: space-between;
		padding: 15px 0 10px 20px;
	}

	.clearSongList {
		margin-right: 30px;
		color: #557daf;
	}

	.el-table {}

	.progressBar {
		display: flex;
		align-items: center;
	}

	/deep/ .el-slider__bar {
		background-color: #ec4141;
	}

	/deep/ .el-slider__button {
		width: 4px;
		height: 4px;
		border: 1px solid #ec4141;
		background-color: #ec4141;
		border-radius: 50%;
	}

	.currentTime,
	.totalTime {
		font-size: 12px;
		color: #aaa;
		margin: 0 5px;
		width: 30px;
		text-align: center;
		margin-right: 15px;
	}

	.progressBar {
		height: 10px;
		margin-top: 12px;
		overflow: hidden;
	}

	.el-popover /deep/ {
		min-width: none;
	}

</style>
