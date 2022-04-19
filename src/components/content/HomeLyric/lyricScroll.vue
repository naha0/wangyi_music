<template>
	<div>
		<div class="lyric">
			<div class="big_text" ref="lyric">
				<div v-for="(lyric,key,index) in lyricScroll" :key="key"
					:class="index==lyricIndex?'currentText':'text'">
					<div>{{lyric}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'lyricScroll',
		props: ['lyricScroll'],
		data() {
			return {
				lyricIndex: ''
			}
		},
		watch: {
			"$store.state.play.currentTime": {
				handler(newValue, oldValue) {
					let i = 0
					// 循环歌词对象
					for (let key in this.lyricScroll) {
						// key表示歌词对象中的时间，如果key等于歌曲进度value，改变当前歌词进度		lyricIndex
						if (+key == newValue) {
							this.lyricIndex = i;
							console.log()
							// 当歌词进度大于5，即播放到了第5句歌词，开始滚动
							if (i > 3) {
								this.$refs.lyric.scrollTop = 40 * (i - 3);
							}
						}
						i++;
					}
				}
			}

		}
	}
</script>

<style scoped="">
	.lyric {
		position: relative;
	}

	.big_text {
		position: absolute;
		width: 100%;
		height: 300px;
		top: 30px;
		overflow-y: scroll;
	}

	.text {
		font-size: 14px;
		text-align: center;
		margin-bottom: 10px;
		color: #949494;
		height: 30px;
		line-height: 30px;
		transition: all 0.5s;
	}

	.currentText {
		font-size: 18px;
		font-weight: 600;
		text-align: center;
		margin-bottom: 10px;
		color: #000;
		height: 30px;
		line-height: 30px;
		transition: all 0.5s;
	}
</style>
