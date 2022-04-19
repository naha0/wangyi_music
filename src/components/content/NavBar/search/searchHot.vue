<template>
	<div class="search-hot">
		<el-scrollbar>
			<span>热搜榜</span>
			<table>
				<tr v-for="(item,index) in searchHot" :key="index" @mousedown="searchHotSong(index)">
					<td>
						<div class="hot-box">
							<span class="hot-num" :class="index+1<=3?'iscolor':''" >{{index+1}}</span>
							<div class="hot">
								<div class="hot-name">{{item.searchWord}}</div>
								<div class="hot-score">{{item.score}}</div>
								<div class="hot-url">
									<img :src="item.iconUrl" alt />
								</div>
							</div>
							<div class="hot-bottom" v-if="item.content">{{item.content}}</div>
						</div>
			
					</td>
				</tr>
			</table>
		</el-scrollbar>
		
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'searchHot',
		mounted() {
			this.$store.dispatch('getSearchHot')
		},
		computed: {
			...mapState({
				searchHot: (state) => state.home.searchhot,
			}),
		},
		methods:{
			searchHotSong(index){
				this.$store.dispatch('getSearch',{
					keywords:this.searchHot[index].searchWord,
					limit:100
				})
				this.$router.push({name:'search',query:{keywords:this.searchHot[index].searchWord}})
				this.$parent.searchhotShow = false
			}
		}
	}
</script>

<style scoped>
	.search-hot {
		position: absolute;
		top: 45px;
		left: -30px;
		z-index: 99;
		height: 400px;
		background-color: #fff;
		border-radius: 5px;
		padding: 15px 20px;
		box-shadow: 0 0 3px 0px #eeeeec;
		overflow: auto;
	}

	table {
		width: 295px;
		height: 300px;
	}

	tr td:nth-child(1) {
		width: 40px;
		font-size: 17px;
	}

	tr {
		height: 44px;
	}

	tr:hover {
		background: #f5f5f7;
	}

	.hot-box {
		display: grid;
		grid-template-columns: 20% 80%;
		grid-template-row: 100% 100%;
	}

	.hot {
		display: flex;
	}

	.hot-num {
		grid-column-start: 1;
		grid-column-end: 2;
		grid-row-start: 1;
		grid-row-end: 3;
		text-align: center;
		color: #cacaca;
	}

	.iscolor {
		color: red;
	}
	.hot-name {
		font-size: 14px;
		font-weight: 700;
		margin-right: 10px;
	}

	.hot-score {
		color: #d6d6d6;
		font-size: 12px;
	}

	.hot img {
		margin-left: 10px;
		height: 16px;
	}

	.hot-bottom {
		font-size: 13px;
		color: #979797;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>