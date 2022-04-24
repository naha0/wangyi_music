import {
	reqHomePage,
	reqBanner,
	reqNewSong,
	reqTopSong,
	reqTopAlbum,
	reqSearchHot,
	reqSearchSuggest,
	reqSearch,
	reqLoginCellphone,
	reqPersonalized,
	reqPrivatecontent,
	reqPlaylistHighquality,
	reqLoginState,
	reqUserDetail,
	reqUserPlaylist,
	reqPlayListSubscribers,
	reqUserAccount
} from '@/api/index.js'

import Cookie from 'js-cookie'

const state = {
	homePage: {},
	banner: [],
	newsong: [],
	topsong: [],
	topalbum: {},
	searchhot: [],
	searchsuggest: {},
	search: {},
	login: {
		token: '',
		code: '',
		profile: {
			avatarUrl: '',
			nickname: '',
			userId: ''
		}
	},
	personalized: [],
	privatecontent: [],
	userplaylist: [],
	userdetail:{},
	subscribers:[]
}

const mutations = {
	HOMEPAGE(state, homePage) {
		state.homePage = homePage
	},
	BANNER(state, banner) {
		state.banner = banner
	},
	NEWSONG(state, newsong) {
		state.newsong = newsong
	},
	TOPSONG(state, topsong) {
		state.topsong = topsong
	},
	TOPALBUM(state, gettopalbum) {
		state.topalbum = gettopalbum
	},
	SEARCHHOT(state, searchhot) {
		state.searchhot = searchhot
	},
	SEARCHSUGGEST(state, searchsuggest) {
		state.searchsuggest = searchsuggest
	},
	SEARCH(state, search) {
		state.search = search
	},
	PERSONALIZED(state, personalized) {
		state.personalized = personalized
	},
	PRIVATECONTENT(state, privatecontent) {
		state.privatecontent = privatecontent
	},
	USERPLAYLIST(state, userplaylist) {
		state.userplaylist = userplaylist
	},
	logout(state, login) {
		state.login.token = window.sessionStorage.removeItem('token')
		state.login.profile.nickname = window.sessionStorage.removeItem('nickname')
		state.login.profile.avatarUrl = window.sessionStorage.removeItem('avatarUrl')
		state.login.profile.userId = window.sessionStorage.removeItem('userId')
		state.login.code = window.sessionStorage.removeItem('code')
	},
	LOGIN(state, login) {
		state.login.token = login.token
		state.login.profile.avatarUrl = login.profile.avatarUrl
		state.login.profile.nickname = login.profile.nickname
		state.login.profile.userId = login.profile.userId
		state.login.code = login.code
	},
	USERDETAIL(state,userdetail){
		state.userdetail = userdetail
	},
	PLAYLISTSUBSCRIBERS(state,subscribers){
		state.subscribers = subscribers || []
	}
}

const actions = {
	async getHomePage({
		commit
	}) {
		const res = await reqHomePage()
		// console.log(res)
		if (res.code == 200) {
			commit('HOMEPAGE', res.data)
		}
	},
	async getBanner({
		commit
	}) {
		const res = await reqBanner()
		// console.log(res)
		if (res.code == 200) {
			commit('BANNER', res.banners)
		}
	},
	async getNewSong({
		commit
	}, params = {}) {
		const res = await reqNewSong(params)
		// console.log(res)
		if (res.code == 200) {
			commit('NEWSONG', res.result)
		}
	},
	async getTopSong({
		commit
	}, params = {}) {
		const res = await reqTopSong(params)
		// console.log(res)
		if (res.code == 200) {
			commit('TOPSONG', res.data)
		}
	},
	async getTopAlbum({
		commit
	}, params = {}) {
		const res = await reqTopAlbum(params)
		// console.log(res)
		if (res.code == 200) {
			// console.log(res);
			const gettopalbum = {}
			gettopalbum.weekData = res.weekData
			gettopalbum.monthData = res.monthData
			commit('TOPALBUM', gettopalbum)
		}
	},
	async getSearchHot({
		commit
	}) {
		const res = await reqSearchHot()
		// console.log(res.data);
		if (res.code == 200) {
			commit('SEARCHHOT', res.data)
		}
	},
	async getSearchSuggest({
		commit
	}, params = {}) {
		const res = await reqSearchSuggest(params)
		// console.log(res)
		if (res.code == 200) {
			commit('SEARCHSUGGEST', res.result)
		}
	},
	async getSearch({
		commit
	}, params = {}) {
		const res = await reqSearch(params)
		console.log(res)
		if (res.code == 200) {
			commit('SEARCH', res.result)
		}
	},
	// async getLogin({commit}, params = {}) {
	// 	const res = await reqLoginCellphone(params)
	// 	if (res.code !== 200) {
	// 		alert('登录失败')
	// 		return false
	// 	}
	// 	console.log(res)
	// 	commit('LOGIN', res)
	// },
	getLogin({commit}, params = {}) {
		return new Promise((resolve,reject)=>{
			reqLoginCellphone(params).then(response=>{
				console.log(response)
				const {code} = response
				console.log(code)
				if(code !== 200){
					reject('登录失败')
				} 
				commit('LOGIN', response)
				resolve(response)
			}).catch(err=>{
				reject(err)
			})
		})
	},
	getQrLogin({commit}, params = {}) {
		return new Promise((resolve,reject)=>{
			reqUserAccount(params).then(response=>{
				console.log(response)
				const {code} = response
				console.log(code)
				if(code !== 200){
					reject('登录失败')
				} 
				commit('LOGIN', response)
				resolve(response)
			}).catch(err=>{
				reject(err)
			})
		})
	},
	async getLoginState({
		commit
	}) {
		const res = await reqLoginState()
		// console.log(res)
		if (res.code !== 200) {
			return false
		}
	},
	async getPersonalized({
		commit
	}, params = {}) {
		const res = await reqPersonalized(params)
		// console.log(res)
		if (res.code == 200) {
			commit('PERSONALIZED', res.result)
		}
	},
	async getPrivatecontent({
		commit
	}) {
		const res = await reqPrivatecontent()
		if (res.code == 200) {
			commit('PRIVATECONTENT', res.result)
		}
		// console.log(res)
	},
	async getUserDetail({
		commit
	}, params = {}) {
		const res = await reqUserDetail(params)
		// if (res.code == 200) {
			commit('USERDETAIL', res)
		// }
		// console.log(res)
	},
	async getUserPlaylist({
		commit
	}, params = {}) {
		const res = await reqUserPlaylist(params)
		commit('USERPLAYLIST', res.playlist)
	},
	async getPlayListSubscribers({commit},params={}){
		const res = await reqPlayListSubscribers(params)
		console.log(res)
		if (res.code == 200) {
			commit('PLAYLISTSUBSCRIBERS', res.subscribers)
		}
	}
}

const getters = {
	gettopsong(state) {
		let topsongitem = state.topsong.map(item => {
			return {
				album: item.album,
				album_artists: item.album.artists[0],
				bMusic: item.bMusic
			}
		})
		return topsongitem || []
	},
	gettopalbum(state) {
		if (state.topalbum.monthData) {
			let gettopalbum = {}
			let topalbumMitem = state.topalbum.monthData.map(item => {
				return {
					name: item.name,
					picUrl: item.picUrl,
					artist_name: item.artist.name
				}
			})
			if (state.topalbum.weekData) {
					let topalbumWitem = state.topalbum.weekData.map(item => {
					return {
						name: item.name,
						picUrl: item.picUrl,
						artist_name: item.artist.name
					}
				})
				gettopalbum.WeekData = topalbumWitem
			}
			gettopalbum.MonthData = topalbumMitem
			return gettopalbum || {}
		} else {
			return {}
		}
	},
	Myplaylist(state){
		if(state.userplaylist){
			let playlistItem = state.userplaylist.map(item => {
				return {
					id:item.id,
					name:item.name,
					userId:item.userId
				}
			})
			let myplaylist = playlistItem.filter(item => {
				return state.login.profile.userId == item.userId
			})
			return myplaylist || []
		}else{
			return []
		}
	},
	Subplaylist(state){
		if(state.userplaylist){
			let playlistItem = state.userplaylist.map(item => {
				return {
					id:item.id,
					name:item.name,
					userId:item.userId
				}
			})
			let subplaylist = playlistItem.filter(item => {
				return state.login.profile.userId !== item.userId
			})
			return subplaylist || []
		}else{
			return []
		}
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
