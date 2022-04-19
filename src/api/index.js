import { request } from './request.js'

// 获取音乐url
export function reqSongUrl(id){
	return request({
		url:'/song/url',
		method:'get',
		params:{
			id
		}
	})
}
// 首页发现
export function reqHomePage() {
	return request({
		url: '/homepage/block/page',
		method: 'get'
	})
}

// banner
export function reqBanner(){
	return request({
		url:'/banner',
		method:'get'
	})
}

// 首页的最新音乐的新歌速递
export function reqTopSong(params){
	return request({
		url:'/top/song',
		method:'get',
		params
	})
}

// 首页的最新音乐的新碟上架
export function reqTopAlbum(params){
	return request({
		url:'/top/album',
		method:'get',
		params
	})
}

// 热搜列表 （详细）
export function reqSearchHot(){
	return request({
		url:'/search/hot/detail',
		method:'get'
	})
}

// 搜索建议
export function reqSearchSuggest(params){
	return request({
		url:'/search/suggest',
		method:'get',
		params
	})
}

// 搜索
export function reqSearch(params){
	return request({
		url:'/cloudsearch',
		method:'get',
		params
	})
}

// 检测手机号码是否已注册
export function reqExistenceCheckPhone(phone){
	return request({
		url:'/cellphone/existence/check',
		method:'get',
		params:{
			phone
		}
	})
}

// 发送验证码
export function reqCaptcha(phone){
	return request({
		url:'/captcha/sent',
		method:'post',
		params:{
			phone
		}
	})
}

// 验证验证码
export function reqCaptchaVerify(params){
	return request({
		url:'/captcha/verify',
		method:'get',
		params
	})
}

// 手机登录
export function reqLoginCellphone(params){
	return request({
		url:'/login/cellphone',
		method:'post',
		params
	})
}

// 登录状态
export function reqLoginState(){
	return request({
		url:'/login/status',
		method:'get'
	})
}

// 退出登录
export function reqLogout(){
	return request({
		url:'/logout',
		method:'get'
	})
}

// 获取账号信息
export function reqUserAccount(){
	return request({
		url:'/user/account',
		method:'get'
	})
}

// 推荐歌单
export function reqPersonalized(limit){
	return request({
		url:'/personalized',
		method:'get',
		params:{
			limit
		}
	})
}

// 独家放送
export function reqPrivatecontent(){
	return request({
		url:'/personalized/privatecontent',
		method:'get'
	})
}

// 推荐新音乐
export function reqNewSong(limit){
	return request({
		url:'/personalized/newsong',
		method:'get',
		params:{
			limit
		}
	})
}

// 获取精品歌单
export function reqPlaylistHighquality(params){
	return request({
		url:'/top/playlist/highquality',
		method:'get',
		params
	})
}

// 精品歌单标签列表
export function reqPlaylistHighqualityTags(){
	return request({
		url:'/playlist/highquality/tags',
		method:'get',
	})
}

// 歌单
export function reqTopPlaylist(params){
	return request({
		url:'/top/playlist',
		method:'get',
		params
	})
}

// 歌手分类列表
export function reqArtistList(params){
	return request({
		url:'/artist/list',
		method:'get',
		params
	})
}

// 刷新登录状态
export function reqLoginRefresh(){
	return request({
		url:'/login/refresh',
		method:'get'
	})
}

// 获取用户详情
export function reqUserDetail(params){
	return request({
		url:'/user/detail',
		method:'get',
		params
	})
}

// 获取用户歌单
export function reqUserPlaylist(params){
	return request({
		url:'/user/playlist',
		method:'get',
		params
	})
}

// 获取歌单详情
export function reqPlaylistDetail(id){
	return request({
		url:'/playlist/detail',
		method:'get',
		params:{
			id
		}
	})
}

// 获取歌单所有歌曲
export function reqPlaylistAll(id){
	return request({
		url:'/playlist/track/all',
		method:'get',
		params:{
			id
		}
	})
}

// 获取歌单评论
export function reqPlayComment(params){
	return request({
		url:'/comment/new',
		method:'get',
		params
	})
}

// 给评论点赞
export function reqCommentLike(params){
	return request({
		url:'/comment/like',
		method:'get',
		params
	})
}


// 发送评论
export function reqSentComment(params){
	return request({
		url:'/comment',
		method:'get',
		params
	})
}

// 获取评论
export function reqCommentPlaylist(id){
	return request({
		url:'/comment/playlist',
		method:'get',
		params:{
			id
		}
	})
}

// 歌单收藏者
export function reqPlayListSubscribers(id){
	return request({
		url:'/playlist/subscribers',
		method:'get',
		params:{
			id
		}
	})
}

// 获取歌曲详情
export function reqSongDetail(ids){
	return request({
		url:'/song/detail',
		method:'get',
		params:{
			ids
		}
	})
}

// 喜欢音乐列表
export function reqLikelist(params){
	return request({
		url:'/likelist',
		method:'get',
		params
	})
}

// 喜欢音乐
export function reqLikeSong(id,like){
	return request({
		url:'/like',
		method:'get',
		params:{
			id,
			like
		}
	})
}

// 获取歌词
export function reqLyric(id){
	return request({
		url:'/lyric',
		method:'get',
		params:{
			id
		}
	})
}

// 获取歌手详情
export function reqArtistDetail(id){
	return request({
		url:'/artist/detail',
		method:'get',
		params:{
			id
		}
	})
}

// 歌手热门 50 首歌曲
export function reqArtistTopSong(id){
	return request({
		url:'/artist/top/song',
		method:'get',
		params:{
			id
		}
	})
}

// 收藏/取消收藏歌手
export function reqArtistSub(params){
	return request({
		url:'/artist/sub',
		method:'get',
		params
	})
}

// 收藏的歌手列表
export function reqArtistSublist(params){
	return request({
		url:'/artist/sublist',
		method:'get',
		params
	})
}

// 获取歌手专辑
export function reqArtistAlbum(params){
	return request({
		url:'/artist/album',
		method:'get',
		params
	})
}

// 获取专辑内容
export function reqAlbum(params){
	return request({
		url:'/album',
		method:'get',
		params
	})
}

// 收藏/取消收藏歌单
export function reqPlaySubscribe(params){
	return request({
		url:'/playlist/subscribe',
		method:'get',
		params
	})
}