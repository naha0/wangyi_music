import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import home from './home/index.js'
import play from './play/index.js'


const store = new Vuex.Store({
	modules:{
		home,
		play
	}
})

export default store