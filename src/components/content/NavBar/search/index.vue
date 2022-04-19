<template>
	<div>
		<div class="search-head">
			<div v-if="key==1?true:false">找到{{getSearchList.songCount}}首单曲</div>
		<div v-if="key==100?true:false">找到{{getSearchList.artistCount}}位歌手</div>
		</div>
		
		<div class="main-header">
			<el-menu :default-active="defaultActive" mode="horizontal" @select="handleSelect" text-color="#000"
				active-text-color="#dd4c53">
				<el-menu-item index="1">单曲</el-menu-item>
				<el-menu-item index="100">歌手</el-menu-item>
			</el-menu>
		</div>
		<el-table :data="getSearchList.songs" @row-dblclick="clickRow"  style="width: 100%" v-if="key==1?true:false">
			<el-table-column type="index">
			</el-table-column>
			<el-table-column prop="name" label="音乐标题" width="600px" :show-overflow-tooltip="true">
				<template slot-scope="{row,$index}">
					<span>{{row.name}}</span>
					<span :class="row.fee==1?'vip':''">{{ row.fee | isVip}}</span>
				</template>
			</el-table-column>
			<el-table-column label="歌手" :show-overflow-tooltip="true">
				<template slot-scope="{row,$index}">
					<span v-for="(item,index) in row.ar">{{item.name}} </span>
				</template>
			</el-table-column>
			<el-table-column label="专辑" :show-overflow-tooltip="true">
				<template slot-scope="{row,$index}">
					{{row.al.name}}
				</template>
			</el-table-column>
			<el-table-column label="时长">
				<template slot-scope="{row,$index}">
					{{$utils.formatSecondTime(row.dt / 1000)}}
				</template>
			</el-table-column>
		</el-table>

		<el-table :data="getSearchList.artists" style="width: 100%" v-if="key==100?true:false" @row-click="rowClick">
			<el-table-column width="150px">
				<template slot-scope="{row,$index}">
					<img :src="row.picUrl" alt="" class="artists-pic">
				</template>
			</el-table-column>
			<el-table-column prop="name">
			</el-table-column>
			<el-table-column>
				<template slot-scope="{row,$index}">
				<img :src="row.identityIconUrl" alt="" class="artists-icon" v-show="row.identityIconUrl">
			</template>
			</el-table-column>
		</el-table>
		
		<el-pagination
		      @current-change="handleCurrentChange"
		      :current-page="page"
		      :page-size="100"
		      layout="total,prev, pager, next"
		      :total="changeTotal"
			  style="text-align: center;">
		    </el-pagination>
	</div>

</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'search',
		data() {
			return {
				defaultActive: '1',
				key: 1,
				isShow: true,
				text: '单曲',
				num: '',
				total:0,
				page:1,
			}
		},
		methods: {
			handleSelect(key, keyPath) {
				this.key = key
				this.$store.dispatch('getSearch', {
					keywords: this.$route.query.keywords,
					type: this.key,
					limit:100,
				})
			},
			handleCurrentChange(pages=1) {
				this.page = pages
				this.$store.dispatch('getSearch',{
					keywords: this.$route.query.keywords,
					type: this.key,
					limit:100,
					offset:this.page
				})
			},
			async getMusicInfo(id){
				let res = await this.$api.reqSongDetail(id)
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
				res.songs[0].dt = this.$utils.handleMusicTime(res.songs[0].dt)
				return res.songs[0]
				
			},
			clickRow(row){
				// console.log(row)
				// console.log(row.id)
				this.getMusicInfo(row.id)
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
				this.$store.commit('changePlayState',false)
				this.$store.commit('updateMusicId',row.id)
				let row1 = []
				row1.push(row)
				this.$store.commit('updateMusicList',{
					musicList: row1.concat(this.$store.state.play.musicList)
				})
			},
			rowClick(row){
				console.log(row)
				this.$router.push({path:'/home/aritistmessage',query:{id:row.id}})
			}
		},
		filters:{
			isVip(value){
				if(value == 1){
					return value = "vip"
				}else{
					return ""
				}
			}
		},
		computed: {
			...mapState({
				getSearchList: (state) => state.home.search,
			}),
			changeTotal(){
				if(this.key == 1){
					return this.getSearchList.songCount
				}else{
					return this.getSearchList.artistCount
				}
			}
		},
	}
</script>

<style scoped="">
	/deep/ .el-menu {
		border-bottom: 0;
	}
	.search-head{
		margin-top: 30px;
		font-weight: 700;
	}
	.search-icon {
		width: 15px;
		height: 15px;
		vertical-align: middle;
		margin-right: 5px;
	}

	.artists-pic {
		width: 100px;
		height: 100px;
		border-radius: 10px;
	}
	.artists-icon{
		width: 30px;
		height: 30px;
		float: right;
		right: 30px;
	}
	.vip{
		border: 1px solid #fe672e;
		padding: 0 3px;
		color: #fe672e;
		border-radius: 3px;
		margin-left: 7px;
		font-size: 8px;
		font-weight: 500;
	}
	.el-pagination /deep/{
		margin-bottom: 60px;
	}
</style>
