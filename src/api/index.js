import { request } from './request.js'

// 获取音乐url
export function reqSongUrl(id){
	return request({
		url:'/api/song/url',
		method:'get',
		params:{
			id
		}
	})
}
// 首页发现
export function reqHomePage() {
	return request({
		url:'/api/homepage/block/page',
		method: 'get'
	})
}

// banner
export function reqBanner(){
	return request({
		url:'/api/banner',
		method:'get'
	})
}

// 首页的最新音乐的新歌速递
export function reqTopSong(params){
	return request({
		url:'/api/top/song',
		method:'get',
		params
	})
}

// 首页的最新音乐的新碟上架
export function reqTopAlbum(params){
	return request({
		url:'/api/top/album',
		method:'get',
		params
	})
}

// 热搜列表 （详细）
export function reqSearchHot(){
	return request({
		url:'/api/search/hot/detail',
		method:'get'
	})
}

// 搜索建议
export function reqSearchSuggest(params){
	return request({
		url:'/api/search/suggest',
		method:'get',
		params
	})
}

// 搜索
export function reqSearch(params){
	return request({
		url:'/api/cloudsearch',
		method:'get',
		params
	})
}

// 检测手机号码是否已注册
export function reqExistenceCheckPhone(phone){
	return request({
		url:'/api/cellphone/existence/check',
		method:'get',
		params:{
			phone
		}
	})
}

// 发送验证码
export function reqCaptcha(phone){
	return request({
		url:'/api/captcha/sent',
		method:'post',
		params:{
			phone
		}
	})
}

// 验证验证码
export function reqCaptchaVerify(params){
	return request({
		url:'/api/captcha/verify',
		method:'get',
		params
	})
}

// 手机登录
export function reqLoginCellphone(params){
	return request({
		url:'/api/login/cellphone',
		method:'post',
		params
	})
}

// 二维码登录
export function reqLoginKey(){
	return request({
		url:'/api/login/qr/key',
		method:'get',
	})
}

// 二维码生成接口
export function reqQrCreate(params){
	return request({
		url:'/api/login/qr/create',
		method:'get',
		params
	})
}

// 二维码检测扫码状态接口
export function reqQrCheck(params){
	return request({
		url:'/api/login/qr/check',
		method:'get',
		params
	})
}

// 获取用户信息
export function reqUserAccount(params){
	return request({
		url:'/api/user/account',
		method:'get',
		params
	})
}

// 登录状态
export function reqLoginState(){
	return request({
		url:'/api/login/status',
		method:'get'
	})
}

// 退出登录
export function reqLogout(){
	return request({
		url:'/api/logout',
		method:'get'
	})
}

// 推荐歌单
export function reqPersonalized(limit){
	return request({
		url:'/api/personalized',
		method:'get',
		params:{
			limit
		}
	})
}

// 独家放送
export function reqPrivatecontent(){
	return request({
		url:'/api/personalized/privatecontent',
		method:'get'
	})
}

// 推荐新音乐
export function reqNewSong(limit){
	return request({
		url:'/api/personalized/newsong',
		method:'get',
		params:{
			limit
		}
	})
}

// 获取精品歌单
export function reqPlaylistHighquality(params){
	return request({
		url:'/api/top/playlist/highquality',
		method:'get',
		params
	})
}

// 精品歌单标签列表
export function reqPlaylistHighqualityTags(){
	return request({
		url:'/api/playlist/highquality/tags',
		method:'get',
	})
}

// 歌单
export function reqTopPlaylist(params){
	return request({
		url:'/api/top/playlist',
		method:'get',
		params
	})
}

// 歌手分类列表
export function reqArtistList(params){
	return request({
		url:'/api/artist/list',
		method:'get',
		params
	})
}

// 刷新登录状态
export function reqLoginRefresh(){
	return request({
		url:'/api/login/refresh',
		method:'get'
	})
}

// 获取用户详情
export function reqUserDetail(params){
	return request({
		url:'/api/user/detail',
		method:'get',
		params
	})
}

// 获取用户歌单
export function reqUserPlaylist(params){
	return request({
		url:'/api/user/playlist',
		method:'get',
		params
	})
}

// 获取歌单详情
export function reqPlaylistDetail(id){
	return request({
		url:'/api/playlist/detail',
		method:'get',
		params:{
			id
		}
	})
}

// 获取歌单所有歌曲
// 接口有问题返回404
// export function reqPlaylistAll(id){
// 	return request({
// 		url:'/api/playlist/track/all',
// 		method:'get',
// 		params:{
// 			id
// 		}
// 	})
// }

// 获取歌单评论
export function reqPlayComment(params){
	return request({
		url:'/api/comment/new',
		method:'get',
		params
	})
}

// 给评论点赞
export function reqCommentLike(params){
	return request({
		url:'/api/comment/like',
		method:'get',
		params
	})
}


// 发送评论
export function reqSentComment(params){
	return request({
		url:'/api/comment',
		method:'get',
		params
	})
}

// 获取评论
export function reqCommentPlaylist(id){
	return request({
		url:'/api/comment/playlist',
		method:'get',
		params:{
			id
		}
	})
}

// 歌单收藏者
export function reqPlayListSubscribers(id){
	return request({
		url:'/api/playlist/subscribers',
		method:'get',
		params:{
			id
		}
	})
}

// 获取歌曲详情
export function reqSongDetail(ids){
	return request({
		url:'/api/song/detail',
		method:'get',
		params:{
			ids
		}
	})
}

// 喜欢音乐列表
export function reqLikelist(params){
	return request({
		url:'/api/likelist',
		method:'get',
		params
	})
}

// 喜欢音乐
export function reqLikeSong(id,like){
	return request({
		url:'/api/like',
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
		url:'/api/lyric',
		method:'get',
		params:{
			id
		}
	})
}

// 获取歌手详情
export function reqArtistDetail(id){
	return request({
		url:'/api/artist/detail',
		method:'get',
		params:{
			id
		}
	})
}

// 歌手热门 50 首歌曲
export function reqArtistTopSong(id){
	return request({
		url:'/api/artist/top/song',
		method:'get',
		params:{
			id
		}
	})
}

// 收藏/取消收藏歌手
export function reqArtistSub(params){
	return request({
		url:'/api/artist/sub',
		method:'get',
		params
	})
}

// 收藏的歌手列表
export function reqArtistSublist(params){
	return request({
		url:'/api/artist/sublist',
		method:'get',
		params
	})
}

// 获取歌手专辑
export function reqArtistAlbum(params){
	return request({
		url:'/api/artist/album',
		method:'get',
		params
	})
}

// 获取专辑内容
export function reqAlbum(params){
	return request({
		url:'/api/album',
		method:'get',
		params
	})
}

// 收藏/取消收藏歌单
export function reqPlaySubscribe(params){
	return request({
		url:'/api/playlist/subscribe',
		method:'get',
		params
	})
}