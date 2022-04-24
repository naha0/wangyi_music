<template>
	<div class="big_comment">
		<div class="comment_header">
			<el-input type="textarea" v-model="byMyComment" maxlength="140" show-word-limit></el-input>
			<div class="comment_button">
				<el-button round @click="sentMyComment">评论</el-button>
			</div>
		</div>
		<div v-show="commentData.length!==0">
			<h1>{{commentData.commentsTitle}}</h1>
			<div class="commentItem" v-for="(item, index) in commentData.comments" :key="item.id">
				<div class="commentCreatorAvatar">
					<img :src="item.user.avatarUrl" alt="" />
				</div>
				<div class="commentMain">
					<div class="commentContent">
						<span class="commentUserNickName">{{ item.user.nickname }}:&nbsp;</span>
						<span>{{ item.content }}</span>
					</div>
					<div class="replied">
						<div class="repliedItem" v-for="(item1, index1) in item.beReplied" :key="index1">
							<span class="repliedUser">@{{ item1.user.nickname }}:&nbsp;</span>
							<span class="repliedContent">{{ item1.content }}</span>
						</div>
					</div>
					<div class="commentBottom">
						<div class="commentCreatedTime">
							{{ item.timeStr }}
						</div>
						<div class="commentButtons">
							<div :class="item.liked ? 'likeCurrentComment' : ''"
								@click="likeCurrentComment(item.liked,item.commentId)" :data-liked="item.liked"
								:data-commentid="item.commentId">
								<div v-if="item.liked==false"><img src="~/assets/images/home/upLike.svg" alt=""
										style="width: 20px;height: 20px;">{{ item.likedCount }}</div>
								<div v-else><img src="~/assets/images/home/upFillLike.svg" alt=""
										style="width: 20px;height: 20px;">{{ item.likedCount }}</div>
							</div>
						</div>
					</div>


				</div>
			</div>
		</div>
		<div v-show="commentData.length==0" class="no_comment">还没有评论，快来抢沙发~</div>
	</div>
</template>

<script>
	export default {
		name: 'comment',
		// playId是歌单id
		props: ['commentData', 'commentType', 'playId'],
		data() {
			return {
				byMyComment: '',
				isBooth: false
			}
		},
		methods: {
			async likeCurrentComment(isBooth, id) {
				if (!this.$store.state.home.login.profile.userId) {
					this.$message.error('请登录再试')
					return false
				}
				this.isBooth = !isBooth
				let type = ''
				switch (this.commentType) {
					case 'newsong':
						type = 0;
						break;
					case 'playlist':
						type = 2;
						break;
					case 'mv':
						type = 1;
						break;
					case 'video':
						type = 5;
						break;
				}
				let res = await this.$api.reqCommentLike({
					id: this.playId,
					cid: id,
					t: isBooth ? 0 : 1,
					type: type
				})
				this.$emit('getComment')
			},
			async sentMyComment() {
				if (!this.$store.state.home.login.profile.userId) {
					this.$message.error('请登录再试')
					return false
				}
				if (this.byMyComment == '') {
					this.$message.error('评论内容不能为空')
					return false
				}
				let type = ''
				switch (this.commentType) {
					case 'newsong':
						type = 0;
						break;
					case 'playlist':
						type = 2;
						break;
					case 'mv':
						type = 1;
						break;
						0
					case 'video':
						type = 5;
						break;
				}
				let res = await this.$api.reqSentComment({
					t: 1,
					id: this.playId,
					type: type,
					content: this.byMyComment
				}).catch((err) => {
					this.$message.error(err.response.data.msg);
				});
				console.log(res)
				if (!res) return false
				if (res.code == 200) {
					this.byMyComment = ""
					this.$emit('getComment')
					console.log(res)
					// this.$forceUpdate()
				} else {
					this.$message.error("评论失败,请稍后再试");
				}
			}
		}
	}
</script>

<style scoped>
	/deep/ .el-textarea__inner {
		height: 80px;
		font-size: 12px;
		resize: none;
	}
	.big_comment{
		width: 100%;
	}
	.comment_button {
		width: 100%;
		text-align: right;
		margin: 10px 0;
	}

	.commentItem {
		display: flex;
		margin: 5px 0;
		padding: 10px 0 20px;
		border-bottom: 1px solid #eee;
		font-size: 14px;
	}

	.commentCreatorAvatar {
		width: 35px;
		height: 35px;
		margin: 0px 10px 0 0;
	}

	.commentCreatorAvatar img {
		width: 100%;
		border-radius: 50%;
		cursor: pointer;
	}

	.commentMain {
		width: calc(100% - 50px);
	}

	.commentUserNickName {
		color: #5a8ab9;
		cursor: pointer;
	}

	.commentBottom {
		margin-top: 2px;
		color: rgb(172, 172, 172);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.commentButtons {
		display: flex;
		align-items: center;
	}

	.commentButtons div {
		margin-top: -3px;
		padding: 0 8px;
		transform: scale(0.85);
	}

	.commentButtons div:nth-child(1) {
		font-size: 14px;
	}

	.commentButtons img {
		vertical-align: bottom;
		margin-right: 2px;
	}

	.replied {
		background-color: #f4f4f4;
		margin: 7px 0;
		border-radius: 5px;
	}

	.repliedItem {
		padding: 7px 10px;
		line-height: 20px;
	}

	.repliedUser {
		color: #5a8ab9;
		cursor: pointer;
	}

	.page {
		width: 100%;
		text-align: center;
		padding-bottom: 20px;
	}

	.commentContent>span {
		line-height: 20px;
	}

	.likeCurrentComment,
	.likeCurrentComment img {
		color: #ec4141 !important;
	}

	.no_comment {
		color: #9f9f9f;
		text-align: center;
		margin-top: 10px;
	}
</style>
