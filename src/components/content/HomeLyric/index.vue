<template>
	<div>
		<el-drawer :withHeader="false" :visible.sync="$store.state.play.showLyric" :direction="direction" :modal="false"
			size="100%">
			<div>
				<div class="top">
					<div class="left">
						<div class="discContainer">
							<div class="needle" :class="$store.state.play.isPlay ? 'needleRotate' : ''" ref="needle">
								<img src="~assets/images/home/needle.png" alt="" />
							</div>
							<div class="disc" :class="[$store.state.play.isPlay ? '' : 'pause',$store.state.play.isMusicLoad ? '' : 'discAnimation']" ref="disc">
								<img src="~assets/images/home/disc.png" alt="" />
								<img src="~assets/images/home/cloundMusic.png" alt="" class="musicAvatar" v-if="!musicInfo.al" />
								<img :src="musicInfo.al.picUrl" alt="" class="musicAvatar" v-else />
							</div>
						</div>
					</div>
					<div class="right">
						<div class="title" v-if="musicInfo&&musicInfo.al&&musicInfo.ar[0]">
							<div class="musicName">{{ musicInfo.name }}</div>
							<div class="album">{{ musicInfo.al.name }}</div>
							<div class="singer">{{ musicInfo.ar[0].name }}</div>
						</div>
						<div>
							<lyric-scroll :lyricScroll="isLyric"></lyric-scroll>
						</div>
					</div>
				</div>
			</div>
			<div class="commentbox">
				<comment :commentData="lyricComment"  :commentType="newsong" :playId="$store.state.play.musicId" :class="newsong?'big_comment':''"></comment>
			</div>
		</el-drawer>
	</div>
</template>

<script>
	import lyricScroll from './lyricScroll.vue'
	import comment from '../MainHome/Comment/comment.vue'
	export default {
		name: 'HomeLyric',
		props: ['isLyric','lyricComment'],
		components:{
			lyricScroll,
			comment
		},
		data() {
			return {
				direction: 'btt',
				musicInfo:{},
				newsong:"newsong"
			}
		},
		methods:{
			
		},
		watch:{
			"$store.state.play.musicId":{
				handler(newValue,oldValue){
					this.musicInfo = this.$parent.musicDetail
				},
				immediate:true
			}
		}
	}
</script>

<style scoped="">
	.el-drawer__wrapper /deep/ {
		z-index: 600 !important;
	}
	.top {
		display: flex;
		justify-content: center;
		height: 500px;
		overflow: hidden;
	}
	
	.left {
		width: 250px;
		margin: 0 30px 0 0px;
	}
	
	.discContainer {
		margin-top: 60px;
		width: 250px;
		position: relative;
	}
	
	.needle {
		position: relative;
		left: 50%;
		width: 88px;
		height: 72px;
		z-index: 10000;
		transition: all 1s;
		transform-origin: 5.3px 5.3px;
	}
	
	.needle img {
		width: 100%;
	}
	
	.needleRotate {
		transform-origin: 5.3px 5.3px;
		transform: rotate(22deg);
	}
	
	.disc {
		width: 250px;
		height: 250px;
		position: relative;
		top: -20px;
	}
	
	.disc img:nth-child(1) {
		width: 100%;
	}
	
	.disc .musicAvatar {
		position: absolute;
		top: 35px;
		left: 35px;
		width: 180px;
		z-index: -1;
	}
	
	/* 碟子设置旋转动画 */
	.discAnimation {
		/* infinite动画无限循环 */
		animation: disc 25s linear infinite;
		/* 动画延迟一秒 */
		animation-delay: 0.8s;
	}
	
	@keyframes disc {
		from {
			transform: rotate(0deg);
		}
	
		to {
			transform: rotate(360deg);
		}
	}
	
	.pause {
		animation-play-state: paused;
		-webkit-animation-play-state: paused;
	}
	
	.right {
		width: 500px;
	}
	
	.title {
		width: 100%;
		text-align: center;
		font-size: 12px;
		margin: 30px 0 15px;
		color: rgb(145, 145, 145);
	}
	
	.title div {
		margin: 7px 0;
	}
	
	.musicName {
		font-size: 23px;
		color: rgb(22, 22, 22);
	}
	
	.bottom {
		margin: 40px auto;
		width: 55vw;
		width: 44vw;
	}
	
	.page {
		width: 100%;
		text-align: center;
		padding-bottom: 20px;
	}
	
	.tip {
		font-size: 20px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	
	.changeBackground {
		position: absolute;
		bottom: 10px;
		right: 20px;
		cursor: pointer;
	}
	
	.bottom /deep/ .el-loading-spinner {
		top: 40px;
	}
	.commentbox{
		display: flex;
		margin-top: 30px;
		justify-content: center;
		margin-bottom: 60px;
	}
	.big_comment{
		width: 1200px !important;
	}
</style>
