<template>
	<div>
		<main-nav></main-nav>
		<swiper :bannerList="banner"></swiper>
		<div>
			<h1 class="hi-header">
				<router-link to="/home/playlist">推荐歌单<i class="el-icon-arrow-right"></i></router-link>
			</h1>
			<div class="songList">
				<div v-for="(item,index) in personalized" class="songList_item" :key="item.id" @click="enterplayDetail(item.id)">
					<img :src="item.picUrl">
					<span class="songList_text">
						{{ item.name }}
					</span>
				</div>
			</div>
		</div>

		<div>
			<h1 class="hi-header">
				<router-link to="/home/privatecontent">独家放送<i class="el-icon-arrow-right"></i></router-link>
			</h1>
			<div class="songList">
				<div v-for="(item,index) in privatecontent" class="privateContent_item" :key="item.id">
					<img :src="item.picUrl">
					<span class="songList_text">
						{{ item.name }}
					</span>
				</div>
			</div>
		</div>

		<div>
			<h1 class="hi-header">
				<router-link to="/home/newsong">最新音乐<i class="el-icon-arrow-right"></i></router-link>
			</h1>
			<div class="songList">
				<div v-for="(item,index) in newsong" class="newsong_item" :key="item.id">
					<img :src="item.picUrl">
					<div class="newsongList_text">
						{{ item.name }}
					</div>
					<div class="newsongList_text1">
						<div v-for="(item1,index1) in item.song.artists">
							{{item1.name}}
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import swiper from '@/components/common/swiper/index.vue'
	import MainNav from '@/components/content/MainNav/index.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'hi',
		components: {
			swiper,
			MainNav
		},
		data() {
			return {
				more:false,
				SongDetail:{}
			}
		},
		mounted() {
			this.$store.dispatch('getHomePage')
			this.$store.dispatch('getBanner')
			this.$store.dispatch('getPersonalized', 10)
			this.$store.dispatch('getPrivatecontent')
			this.$store.dispatch('getNewSong', 12)
		},
		computed: {
			...mapState({
				banner: state => state.home.banner,
				personalized: state => state.home.personalized,
				privatecontent: state => state.home.privatecontent,
				newsong: state => state.home.newsong
			})
		},
		methods:{
			async enterplayDetail(id){
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
		}

	}
</script>

<style scoped>
	.hi-header {
		font-size: 24px;
	}

	.hi-header a {
		text-decoration: none;
		color: #000;
	}

	.songList {
		display: flex;
		position: relative;
		width: 100%;
		flex-flow: wrap;
		margin-bottom: 50px;
	}

	.songList_item {
		width: 18.4%;
		overflow: hidden;
		margin: 10px 2% 20px 0;
	}
	.songList_item:nth-child(5n){
		margin-right: 0;
	}
	.songList_item img {
		width: 100%;
		border-radius: 10px;
		overflow: hidden;
	}

	.songList_text {
		margin-top: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.privateContent_item {
		overflow: hidden;
		width: 30%;
		margin: 10px 20px 0;
	}

	.privateContent_item img {
		width: 100%;
		height: 250px;
		border-radius: 10px;
	}

	.newsong_item {
		width: 30%;
		margin: 10px 20px 10px 30px;
		position: relative;
		overflow: hidden;
	}

	.newsong_item img {
		vertical-align: middle;
		width: 60px;
		border-radius: 10px;
	}

	.newsongList_text {
		position: absolute;
		left: 80px;
		top: 5px;
		font-size: 14px;
	}

	.newsongList_text1 {
		position: absolute;
		left: 80px;
		bottom: 5px;
		font-size: 14px;
		display: flex;
		justify-content: space-between;
	}

	.newsongList_text1 div {
		float: left;
		margin-right: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
