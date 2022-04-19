<template>
	<div>
		<div class="playsubscribers" v-show="playsubscribers.length!==0">
			<div v-for="(item,index) in playsubscribers" :key="index" class="playsubscribers_item" @click="getUserPlay(item.userId)">
				<img :src="item.avatarUrl" alt="" class="playsubscribers_avatarUrl">
				<div class="playsubscribers_text">
					<div>{{item.nickname}}</div>
					<div class="playsubscribers_signature">{{item.signature}}</div>
				</div>
			</div>
		</div>
		<div v-show="playsubscribers.length==0" class="no_playsubscribers">暂无收藏者</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'playCollect',
		data() {
			return {

			}
		},
		computed: {
			...mapState({
				playsubscribers: state => state.home.subscribers
			})
		},
		methods:{
			getUserPlay(userId){
				this.$router.push({name:'personal',query:{uid:userId}})
			}
		}
	}
</script>

<style scoped>
	.playsubscribers {
		display: grid;
		grid-template-columns: 33% 33% 33%;
	}

	.playsubscribers_item {
		display: flex;
		margin: 20px 10px;
		border-radius: 10px;
		cursor: pointer;

	}

	.playsubscribers_avatarUrl {
		height: 100px;
		width: 100px;
		-o-object-fit: cover;
		object-fit: cover;
		border-radius: 50%;
		border: 1px solid #eee;
		margin-right: 10px;
	}

	.playsubscribers_text {
		width: calc(100% - 100px);
		margin: auto;
	}

	.playsubscribers_signature {
		font-weight: lighter;
		font-size: 14px;
		transform: scale(0.9) translateX(-5%);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 5px 0;
	}

	.no_playsubscribers {
		color: #9f9f9f;
		text-align: center;
		margin-top: 10px;
	}
</style>
