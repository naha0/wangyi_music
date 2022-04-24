<template>
	<el-menu class="el-menu-vertical-demo" :default-active="activeHightlight" ref="menus" router
		active-text-color="#ec4141" background-color="#ffffff">
		<el-menu-item index="/home/hi">
			发现音乐
		</el-menu-item>
		<el-menu-item-group title="创建的歌单">
			<el-menu-item :index="'/playdetail/'+item.id" v-for="(item,index) in Myplaylist" :key="item.id">
				<div @click="getplaydetail(item.id)" class="leftmenu_item">
					<img src="~assets/images/home/songList.svg" alt="" style="width: 20px;height: 20px;">
				{{item.name}}</div>
			</el-menu-item>
		</el-menu-item-group>
		<el-menu-item-group title="收藏的歌单">
			<el-menu-item :index="'/playdetail/'+item.id" v-for="(item,index) in Subplaylist" :key="item.id">
				<div @click="getplaydetail(item.id)" class="leftmenu_item">
					<img src="~assets/images/home/songList.svg" alt="" style="width: 20px;height: 20px;">
				{{item.name}}</div>
			</el-menu-item>
		</el-menu-item-group>
	</el-menu>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'LeftMenu',
		data() {
			return {
				opends: ['1'],
				defaultActive: '',
				userId: '',
				more:false,
				SongDetail:{}
			}
		},
		created() {
			this.defaultActive = 'hi'
		},
		computed: {
			activeHightlight() {
				const path = this.$route.path
				if (path.startsWith('/home')) {
					return '/home'
				}
				return path
			},
			...mapGetters(['Myplaylist','Subplaylist'])
		},
		methods: {
			getUser() {
				this.$store.dispatch('getUserPlaylist', {
					uid: this.$store.state.home.login.profile.userId
				})
			},
			async getplaydetail(id){
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
				console.log(res)
				this.$bus.$emit('playdetail',res)
				this.$bus.$emit('playlistId',id)
				this.$bus.$emit('playlistAll',this.SongDetail)
				this.$bus.$emit('playlistMore',this.more)
			}
		},
		watch:{
			'$store.state.home.login.profile.userId':{
				handler(newValue,oldValue){
					this.getUser()
				},
				immediate: true,　
				deep:true
			}
		}
	}
</script>

<style scoped="">
	.el-icon-arrow-down {
		display: none;
	}

	.el-menu {
		height: 100%;
	}
	/deep/ .el-menu-item{
		font-size: 15px;
	}
	.leftmenu_item{
		overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
	}
</style>
