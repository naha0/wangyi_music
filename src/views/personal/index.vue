<template>
	<div>
		<div class="Personal">
			<div class="userInfo" v-if="userInfo.avatarUrl">
				<div class="left">
					<img :src="userInfo.avatarUrl + '?param=400y400'" alt="" class="avatar" />
				</div>
				<div class="right">
				    <div class="rightTop">
				      <div class="username">
				        <div>{{ userInfo.nickname }}</div>
				      </div>
				      <div class="tags">
				        <div class="level">{{ "Lv" + userInfo.level }}</div>
				        <div class="gender">
				          <!-- 0 保密 1男 2女 -->
				        </div>
				      </div>
				    </div>
				    <div class="rightBottom">
				      <!-- 动态 关注 粉丝 -->
				      <div class="dataNums">
				        <div class="numItem">
				          <div class="numItemTop">{{ userInfo.eventCount }}</div>
				          <div class="numItemBottom">动态</div>
				        </div>
				        <div
				          class="numItem"
				          @click="
				            $router.push({
				              name: 'follows',
				              params: { uid: $route.params.uid },
				            })
				          "
				        >
				          <div class="numItemTop">{{ userInfo.newFollows }}</div>
				          <div class="numItemBottom">关注</div>
				        </div>
				        <div
				          class="numItem"
				          @click="
				            $router.push({
				              name: 'followeds',
				              params: { uid: $route.params.uid },
				            })
				          "
				        >
				          <div class="numItemTop">{{ userInfo.followeds }}</div>
				          <div class="numItemBottom">粉丝</div>
				        </div>
				      </div>
				      <!-- 其它信息 -->
				      <div class="otherInfo">
				        <div class="otherInfoItem">
				          <div class="otherInfoKey">用户id：</div>
				          <div class="ptherInfoValue">{{ userInfo.userId }}</div>
				        </div>
				        <div class="otherInfoItem">
				          <div class="otherInfoKey">所在地区：</div>
				          <div class="ptherInfoValue">
				            {{ $utils.findRegion(userInfo.province,userInfo.city) }}
				          </div>
				        </div>
				        <div class="otherInfoItem">
				          <div class="otherInfoKey">个人介绍：</div>
				          <div class="ptherInfoValue">
				            {{ userInfo.signature == "" ? "暂无介绍" : userInfo.signature }}
				          </div>
				        </div>
				      </div>
				    </div>
				  </div>
				</div>
			</div>
			<!-- 歌单 -->
			<div class="musicList">
				<div class="musicListTitle" v-if="createdMusicList.length != 0">
					{{ userInfo.nickname }}创建的歌单({{ createdMusicList.length }})
				</div>
				<load-more :loadMoreData="createdMusicList" @clickLoadItem="clickLoadItem"></load-more>
				<div class="musicListTitle" v-if="collectedMusicList.length != 0">
					{{ userInfo.nickname }}收藏的歌单({{ collectedMusicList.length }})
				</div>
				<load-more :loadMoreData="collectedMusicList" @clickLoadItem="clickLoadItem"></load-more>
			</div>
		</div>
	</div>
	
</template>

<script>
	import loadMore from '@/components/common/loadMore/index.vue'
	export default {
		name: "personal",
		components:{
			loadMore
		},
		data() {
			return {
				// 用户信息
				userInfo: {},
				// 创建的歌单
				createdMusicList: [],
				// 收藏的歌单
				collectedMusicList: [],
				// 该用户是否为当前用户
				isCurrentUser: false,
				more:false,
				SongDetail:{}
			};
		},
		methods: {
			// 请求
			// 获取用户信息
			async getUserInfo() {
				console.log(this.$route.query);
				let res = await this.$api.reqUserDetail({uid:this.$route.query.uid})
				if (!res) {
					this.$message.error("获取用户信息失败!");
					return;
				}
				console.log(res);
				res.profile["level"] = res.level;
				this.userInfo = res.profile;
			},

			// 请求用户歌单
			async getUserMusicList() {
				let timestamp = Date.parse(new Date());
				// 先从localStorage里面读取用户信息  如果登录成功是有存的
				let res = await this.$api.reqUserPlaylist({
					uid: this.$route.query.uid,
					timestamp,
				});
				console.log(res);
				// 对数据进行处理分类
				res = res.playlist;
				console.log(res)
				let index = res.findIndex((item) => item.subscribed == true);
				console.log(index)
				res[0].name = `${this.userInfo.nickname}喜欢的音乐`;
				this.createdMusicList = res.slice(0, index);
				this.collectedMusicList = res.slice(index);
			},

			// 事件
			// 点击歌单的回调
			clickListCardItem(id) {
				this.$router.push({
					name: "musicListDetail",
					params: {
						id
					}
				});
			},
			async clickLoadItem(id){
				this.$router.push(`/playdetail/${id}`)
				let res = await this.$api.reqPlaylistDetail(id)
				let resPlaylist = res.playlist
				let ids = ''
				if(!this.$store.state.home.login.profile.userId){
					if(resPlaylist.tracks.length !== resPlaylist.trackIds.length){
						this.more = true
						resPlaylist.tracks.forEach(item=>{
							return ids += item.id + ','
						})
						ids = ids.substr(0,ids.length - 1)
						this.SongDetail= await this.$api.reqSongDetail(ids)
					}else{
						this.more = false
						resPlaylist.trackIds.forEach(item=>{
							return ids += item.id + ','
						})
						ids = ids.substr(0,ids.length - 1)
						this.SongDetail = await this.$api.reqSongDetail(ids)
					}
				}else{
					this.more = false
					resPlaylist.trackIds.forEach(item=>{
						return ids += item.id + ','
					})
					ids = ids.substr(0,ids.length - 1)
					this.SongDetail = await this.$api.reqSongDetail(ids)
				}
				this.$bus.$emit('playdetail',res)
				this.$bus.$emit('playlistId',id)
				this.$bus.$emit('playlistAll',this.SongDetail)
				this.$bus.$emit('playlistMore',this.more)
			}
		},
		created() {
			this.getUserInfo();
			this.getUserMusicList();
		},
	};
</script>

<style scoped>
	.Personal {
		overflow-y: scroll;
	}

	.userInfo {
		margin: 30px 10px;
		display: flex;
	}

	.avatar {
		margin-top: 5px;
		height: 200px;
		width: 200px;
		object-fit: cover;
		border-radius: 50%;
	}

	.right {
		margin-left: 20px;
		flex: 1;
	}

	.username {
		color: #373737;
		font-size: 22px;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
	}


	.tags {
		display: flex;
		margin: 10px 0;
	}

	.level {
		font-size: 12px;

		background-color: #f0f0f0;
		width: 100;
		padding: 2px 8px;
		border-radius: 10px;
		color: #373737;
	}

	.rightTop {
		width: 100%;
		border-bottom: 1px solid #ddd;
	}

	.dataNums {
		display: flex;
		margin: 10px 0 5px;
	}

	.numItem {
		border-left: 1px solid #eee;
		padding: 0 25px;
		text-align: center;
		cursor: pointer;
	}

	.numItem:nth-child(1) {
		border-left: none;
		padding-left: 3px;
	}

	.numItemTop {
		color: #373737;
		font-size: 18px;
	}

	.numItemBottom {
		font-size: 12px;
	}

	.otherInfo {
		font-size: 12px;
		user-select: text !important;
	}

	.otherInfoItem {
		display: flex;
		margin: 8px 0;
	}

	.otherInfoKey {
		font-size: 14px;
		font-weight: 600;
		color: #2e2e2e;
	}

	.otherInfoValue {
		width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.musicListTitle {
		color: #373737;
		font-weight: bold;
		font-size: 21px;
	}

	.musicList {
		max-width: 1100px;
		margin: 0 auto;
		padding-bottom: 30px;
	}
</style>
