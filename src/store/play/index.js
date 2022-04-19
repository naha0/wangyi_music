import {reqSongUrl} from '@/api/index.js'
const state = {
	musicId:'',
	isPlay:false,
	// 播放列表
	musicList:[],
	// 当前播放歌单的id
	musicListId: '',
	isMusicLoad:false,
	// 当前播放音乐的索引
	currentIndex: -1,
	// 当前播放音乐的时间
	currentTime:0,
	// 用户喜欢的音乐列表
	likeList:[],
	// 用户是否喜欢这个音乐
	changeLike:false,
	// 控制歌词的显示
	showLyric:false,
	// 已收藏的歌手
	subArtistList:[]
}

const mutations ={
	updateMusicId(state,musicId){
		state.musicId = musicId
	},
	// 修改播放状态
	changePlayState(state,isPlay){
		state.isPlay = isPlay
	},
	// 更新歌单播放列表
	updateMusicList(state, payload) {
	    // 当歌单id发生变化时,重置当前播放音乐索引
	    if (payload.musicListId != state.musicListId) {
	        state.musicListId = payload.musicListId;
	        state.currentIndex = -1;
	    }
	    // 对歌单进行深拷贝再赋值 直接赋值是浅拷贝
	    // 歌单是固定的死数据，而vuex中的musicList是动态的
	    let musicList = payload.musicList.slice(0)
	    state.musicList = musicList;
	    // console.log('updateMusicList');
	},
	// 更新音乐的加载状态
	updateMusicLoadState(state, isLoad) {
	    state.isMusicLoad = isLoad;
	},
	// 当前播放音乐的索引
	updateCurrentIndex(state, index) {
	    // console.log('updateCurrentIndex');
	    state.currentIndex = index;
	    console.log(state.currentIndex);
	},
	// 当前播放时间
	updateCurrentTime(state,time){
		state.currentTime = time
	},
	// 用户喜欢的音乐列表
	likesList(state,likelist){
		state.likeList = likelist
	},
	changeSongLike(state,changeLike){
		state.changeLike = changeLike
	},
	// 控制歌词的显示
	getLyric(state){
		state.showLyric = !state.showLyric
	},
	updateSubArtistList(state, subArtistList){
		state.subArtistList = subArtistList;
	}
	
}

const actions = {
}

const getters ={
	
}

export default {
	state,
	mutations,
	actions,
	getters
}