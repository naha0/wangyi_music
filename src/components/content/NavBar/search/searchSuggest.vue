<template>
	<div class="search-key">
		<div class="search-header">搜"<span style="color:#5095d4;">{{keyword}}</span>"相关的结果</div>
		<div>
			<div>
				<div class="suggest-nav">
					<img src="~assets/images/home/music.svg" alt=""
						style="width: 15px;height: 15px;vertical-align: middle;">
					<span class="suggestheader-text">单曲</span>
				</div>
				<div v-for="(item,index) in searchsuggest.songs" class="suggest-item" @click="getMusicInfo(item)">
					{{item.name}}
					<div v-if="item.alias[0]" style="margin-left: 5px;">({{item.alias[0]}})</div>-
					<div v-for="(item1,index) in item.artists" style="margin-left: 5px;">{{item1.name}}</div>
				</div>
			</div>
			<div>
				<div class="suggest-nav">
					<img src="~assets/images/home/songer.svg" alt=""
						style="width: 15px;height: 15px;vertical-align: middle;">
					<span class="suggestheader-text">歌手</span>
				</div>
				<div v-for="(item,index) in searchsuggest.artists" class="suggest-item">
					{{item.name}}
				</div>

			</div>
			<div>
				<div class="suggest-nav">
					<img src="~assets/images/home/videoAlbum.svg" alt=""
						style="width: 15px;height: 15px;vertical-align: middle;">
					<span class="suggestheader-text">专辑</span>
				</div>
				<div v-for="(item,index) in searchsuggest.albums" class="suggest-item">
					{{item.name}}
					<div style="margin:0px 5px;">-</div>{{item.artist.name}}
				</div>

			</div>
			<div>
				<div class="suggest-nav">
					<img src="~assets/images/home/songList.svg" alt=""
						style="width: 15px;height: 15px;vertical-align: middle;">
					<span class="suggestheader-text">歌单</span>
				</div>
				<div v-for="(item,index) in searchsuggest.playlists" class="suggest-item">
					{{item.name}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'searchSuggest',
		props: ["keyword"],
		computed: {
			...mapState({
				searchsuggest: (state) => state.home.searchsuggest
			})
		},
		methods:{
			async getMusicInfo(item){
				// console.log(item)
				let res = await this.$api.reqSongDetail(item.id)
				// console.log(res)
				switch(res.songs[0].fee){
					case 0: break;
					case 1:this.$message.info("当前为VIP歌曲,可收听部分");
							break;
					case 4:this.$message.info("当前需要购买专辑");
							break;
					case 8:this.$message.info("会员用户可收听高音质");
							break;
				}
				this.$parent.searchsuggestShow = false
				this.$store.commit('updateMusicId',item.id)
				this.$store.commit('changePlayState',false)
				let row1 = []
				row1.push(res.songs[0])
				// console.log(row1)
				this.$store.commit('updateMusicList',{
					musicList: row1.concat(this.$store.state.play.musicList)
				})
				
			}
		}
	}
</script>

<style scoped="">
	.search-key {
		position: absolute;
		top: 45px;
		left: -30px;
		z-index: 99;
		height: 400px;
		width: 335px;
		background-color: #fff;
		border-radius: 5px;
		padding: 15px 0px;
		box-shadow: 0 0 3px 0px #eeeeec;
		overflow: auto;
	}

	.search-header {
		font-size: 14px;
		color: #878787;
		margin-left: 10px;
		margin-bottom: 5px;
	}

	.suggest-nav {
		background-color: #f5f5f7;
		padding-left: 15px;
		height: 25px;
		line-height: 25px;
		font-size: 14px;
	}

	.suggestheader-text {
		margin-left: 5px;
	}

	.suggest-item {
		display: flex;
		height: 30px;
		line-height: 30px;
		padding-left: 35px;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.suggest-item:hover {
		background-color: #f2f2f2;
	}
</style>
