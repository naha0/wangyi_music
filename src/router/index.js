import Vue from 'vue'
import VueRouter from 'vue-router'
const login = () => import('@/views/login.vue')
const home = () => import('@/views/home/index.vue')
const hi = () => import('@/views/home/hi.vue')
const newsong = () => import('@/views/home/newsong.vue')
const search = () => import('@/components/content/NavBar/search/index.vue')
const playlist = () => import('@/views/home/playlist.vue')
const privatecontent = () => import('@/components/content/MainHome/privateContent.vue')
const artist = () => import('@/views/home/artist/index.vue')
const aritistmessage = () => import('@/views/home/artist/children/artistMessage.vue')
const playdetail = () => import('@/views/playDetail/index.vue')
const personal = () => import('@/views/personal/index.vue')

Vue.use(VueRouter)

// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

const routes = [{
		path: '/',
		redirect: '/home',
	}, {
		path: '/home',
		component: home,
		children: [{
			path: '',
			redirect: 'hi'
		}, {
			path: 'hi',
			component: hi
		}, {
			path: 'newsong',
			component: newsong
		}, {
			path: 'playlist',
			component: playlist
		}, {
			path: 'privatecontent',
			component: privatecontent
		}, {
			path:'artist',
			component:artist,
		},{
			path:'aritistmessage',
			component:aritistmessage
		}]
	}, {
		path: '/search',
		name: 'search',
		component: search
	},{
		path:'/playdetail/:id',
		name:'playdetail',
		component:playdetail
	},{
		path:'/personal',
		name:'personal',
		component:personal
	}

]

const router = new VueRouter({
	routes,
	mode: 'history'
})

export default router
