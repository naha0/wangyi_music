import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import home from './home/index.js'
import play from './play/index.js'

// // state 仓库存储数据的地方，也就是状态
// const state = {
// 	count:1
// }
// // mutations 修改state的唯一手段
// const mutations = {
// 	add(state,count){
// 		state.count++
// 	},
// 	sub(state,count){
// 		state.count--
// 	}
// }
// // 处理action,可以书写自己的业务逻辑，也可以处理异步
// const action = {
// 	// 这里可以书写业务逻辑，但是不能修改state
// }
// // getters 理解为计算属性，用户简化仓库数据，让组件获取仓库的数据更加方便
// const getters = {}




const store = new Vuex.Store({
	modules:{
		home,
		play
	}
})

export default store