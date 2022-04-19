<template>
	<div v-if="userplayinfo.creator&&userplayinfo.tags">
		<div class="playdetail_header">
			<div class="header_img">
				<img :src="userplayinfo.coverImgUrl" alt="">
			</div>
			<div class="playdetail_right">
				<div class="right_one">
					<span class="header-gedan">
						歌单
					</span>
					<div>{{userplayinfo.name}}</div>
				</div>
				<div class="right_two" v-if="userplayinfo.creator">
					<img :src="userplayinfo.creator.avatarUrl" alt="" >
					<div class="right_name">
						{{userplayinfo.creator.nickname}}
					</div>
					<div class="right_time">{{$utils.dateFormat(userplayinfo.createTime,'YYYY-MM-DD')}}创建</div>
				</div>
				<div class="right_three">
					<el-button-group>
						<el-button icon="el-icon-video-play" round @click="clearAndplayAll" :closeOnClickModal="false">
							播放全部</el-button>
						<el-button round @click="playAll"><i class="el-icon-plus"></i></el-button>
					</el-button-group>
					<el-button icon="el-icon-folder-add" round @click="subClick">{{ isSub ? "已收藏" : "收藏" }}</el-button>
				</div>
				<div class="right-four">
					<div class="four-item" v-if="userplayinfo.tags">标签:
						<span v-for="(tag,index) in userplaytag">{{tag}}</span>
					</div>
					<div class="four-item four-bofang">
						<div>歌曲:
							<span>{{userplayinfo.trackCount}}</span>
						</div>
						<div>播放:
							<span>{{$utils.tenThousand(userplayinfo.playCount)}}</span>
						</div>
					</div>
					<div class="four-item">简介:
						<span>{{userplaydescription}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="playdetail_center">
			<el-tabs value="first">
				<el-tab-pane label="歌曲列表" name="first">
					<!-- 表格 -->
					<!-- 第三方组件的table在退出后不会销毁，而是继续保留，导致多个table同时存在 ref变得不唯一 
			          解决办法：避免使用refs..（拼接也不好使） -->
					<!-- @row-dblclick="clickRow" @cell-click="clickCell" -->
					<el-table :data="userplaylistAll" size="mini" style="width: 100%" highlight-current-row stripe
						@row-dblclick="clickRow">
						<el-table-column label="" width="50" type="index">
						</el-table-column>
						<el-table-column prop="name" label="音乐标题" width="600" :show-overflow-tooltip="true">
						</el-table-column>
						<el-table-column prop="ar[0].name" label="歌手" :show-overflow-tooltip="true">
						</el-table-column>
						<el-table-column prop="al.name" label="专辑" :show-overflow-tooltip="true">
						</el-table-column>
						<el-table-column prop="dt" label="时长">
							<template slot-scope="{row,$index}">
								{{$utils.formatSecondTime(row.dt / 1000)}}
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="评论" name="second">
					<div>
						<comment :commentData="playComment" :commentType="playCommentType" :playId="userplayId"
							@getComment="getplayComment" v-model="isPass"></comment>
					</div>
				</el-tab-pane>
				<el-tab-pane label="收藏者" name="third">
					<play-collect></play-collect>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import comment from '@/components/content/MainHome/Comment/comment.vue'
	import playCollect from '@/components/content/MainHome/playCollect.vue'
	export default {
		name: 'playDetail',
		components: {
			comment,
			playCollect
		},
		data() {
			return {
				userplayinfo: {},
				userplaylistAll: [],
				userplayId: '',
				playComment: {},
				playCommentType: 'playlist',
				isPass: null,
				isSub: false,
				isCreated: false
			}
		},
		created() {
			this.$nextTick(()=>{
				this.$bus.$on('playdetail', res => {
					this.userplayinfo = res.playlist
				})
				this.$bus.$on('playlistAll', reslist => {
					this.userplaylistAll = reslist.songs
				})
				this.$bus.$on('playlistId', id => {
					this.userplayId = id
					this.getplayComment(this.userplayId)
					this.getPlaySubscribers(this.userplayId)
				})
			})
		},
		methods: {
			async getplayComment() {
				var timestamp = Date.parse(new Date())
				let res = await this.$api.reqPlayComment({
					id: this.userplayId,
					type: 2,
					sortType: 3,
					timestamp
				})
				// console.log(res)
				if (res.data.comments !== []) {
					this.playComment = res.data
				} else {
					this.playComment = {}
				}
				this.$forceUpdate()
				this.$forceUpdate()
			},
			getPlaySubscribers(id) {
				this.$store.dispatch('getPlayListSubscribers', id)
			},
			playAll() {
				let musiclist = this.$store.state.play.musicList
				let playAllLists = [...musiclist, ...this.userplaylistAll]
				this.$store.commit("updateMusicList", {
					musicList: playAllLists,
					musicListId: this.userplayId,
				})
			},
			clearAndplayAll() {
				this.$confirm('"播放全部"将会替换当前的播放列表, 是否继续?', '替换播放列表', {
					confirmButtonText: '继续',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '替换成功!'
					});
					this.$store.commit("updateMusicId", this.userplaylistAll[0].id);
					this.$store.commit("updateMusicList", {
						musicList: this.userplaylistAll,
						musicListId: this.userplaylistAll.id,
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消替换'
					});
				});
			},
			clickRow(row) {
				// console.log(row)
				this.$store.commit('changePlayState', false)
				let musicList = this.$store.state.play.musicList
				let currentIndex = this.$store.state.play.currentIndex
				// 判断该歌曲是否在歌单中存在，避免歌单出现相同的歌曲
				let isExist = musicList.find(item => item.id == row.id)
				// console.log(isExist)
				if (isExist) {
					// 如果已经存在 则只提交歌曲id并return出去
					this.$store.commit("updateMusicId", row.id);
					return;
				}
				this.$store.commit('changePlayState', false)
				musicList.splice(currentIndex + 1, 0, row)
				this.$store.commit('updateMusicId', row.id)
				this.$store.commit("updateMusicList", {
					musicList,
					musicListId: this.$store.state.play.musicListId,
				});
			},
			// 判断用户是否收藏了该歌单
			getIsSub() {
				this.$nextTick(()=>{
					this.isSub = this.Subplaylist.some(
					(item) => item.id == this.$route.params.id
				);
				})
				
			},
			// 判断是否是用户创建的歌单
			getIsCreated() {
				this.$nextTick(()=>{
					this.isCreated = this.Myplaylist.some(
						(item) => item.id == this.$route.params.id
					);
				})
				
			},
			async subClick() {
				if (!this.$store.state.home.login.token) {
				    this.$message.error("登录后再进行操作");
				    return;
				  }
				if(this.isCreated==true){
					this.$message.warning('用户创建的歌单不可取消收藏！')
					return;
				}
				this.isSub = !this.isSub;
				console.log(this.$route.params.id)
				let timestamp = Date.parse(new Date());
				await this.$api.reqPlaySubscribe({
					id: this.$route.params.id,
					t: this.isSub ? 1 : 2,
					timestamp,
				})
				let res = await this.$api.reqUserPlaylist({
					uid:this.$store.state.home.login.profile.userId,
					timestamp
				})
				this.$store.commit('USERPLAYLIST',res.playlist)
				
			}
		},
		mounted() {
			if (this.$store.state.home.login.token) {
				// 先判断是否是用户创建的歌单
				this.getIsCreated();
				// 如果不是 再判断是否是收藏的歌单
				if (!this.isCreated) {
					this.getIsSub();
				}
			}
		},
		computed: {
			userplaytag() {
				if (this.userplayinfo.tags.length > 0) {
					let tag = this.userplayinfo.tags.map(item => {
						return item
					})
					let changetag = tag.join('/')
					return changetag
				} else {
					return '添加标签'
				}
				
			},
			userplaydescription() {
				if (this.userplayinfo.description) {
					return this.userplayinfo.description
				} else {
					return '添加简介'
				}
			},
			...mapGetters(['Myplaylist', 'Subplaylist'])
		}
	}
</script>

<style scoped>
	.playdetail_header {
		display: flex;
		height: 250px;
		margin-top: 20px;
	}

	.playdetail_right {
		width: calc(100%);
	}

	.header_img {
		margin-right: 20px;
	}

	.header_img img {
		width: 250px;
		height: 250px;
		border-radius: 5px;
	}

	.right_one,
	.right_two {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.header-gedan {
		font-size: 12px;
		font-weight: 700;
		color: #ec4141;
		border: 1px solid #ec4141;
		padding: 2px 3px;
		border-radius: 2px;
		margin-right: 5px;
		/* transform: scale(1.2); */
	}

	.right_one div {
		font-size: 26px;
		font-weight: 600;
		color: #373737;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 90%;
		padding-bottom: 2px;
	}

	.right_two img {
		height: 25px;
		width: 25px;
		margin-right: 8px;
		border-radius: 50%;
		vertical-align: middle;
	}

	.right_name {
		font-size: 14px;
		color: #126cc8;
	}

	.right_time {
		font-size: 14px;
		color: #676767;
		margin-left: 20px;
	}

	.el-button-group /deep/ {
		margin-right: 10px;
	}

	.el-button-group /deep/ .el-button {
		background-color: #ec4141;
		color: #fff;
		padding-right: 10px;
		padding-left: 10px;
	}

	.right-four {
		display: flex;
		flex-direction: column;
		margin-top: 10px;
	}

	.four-item {
		font-size: 14px;
		margin-top: 8px;
	}

	.four-item span {
		font-size: 14px;
		color: #676767;
	}

	.four-bofang {
		display: flex;
	}

	.four-bofang div {
		margin-right: 10px;
	}

	.playdetail_center {
		margin-top: 20px;
	}

	.playdetail-icon {
		width: 15px;
		height: 15px;
		vertical-align: middle;
		margin-right: 5px;
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
</style>
