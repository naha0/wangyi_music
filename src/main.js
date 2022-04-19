import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 引入swiper
import "swiper/css/swiper.css"

// 导入全局样式表
import '@/assets/css/global.css'

// 引入api
import * as api from 'api/index.js'

// 引入仓库。
import store from 'store/index.js'

// 引入工具库
import utils from 'utils/utils.js'


import NavBar from '@/components/content/NavBar/index.vue'
import LeftMenu from '@/components/content/LeftMenu/index.vue'
import bottomPlay from '@/components/content/bottomPlay/index.vue'
import loadMore from '@/components/common/loadMore/index.vue'
Vue.component(NavBar.name,NavBar)
Vue.component(LeftMenu.name,LeftMenu)
Vue.component(loadMore.name,loadMore)
Vue.component(bottomPlay.name,bottomPlay)


Vue.use(ElementUI)

Vue.prototype.$utils = utils
Vue.config.productionTip = false

new Vue({
  router,
  store,
  // 全局事件总线$bus配置
  beforeCreate() {
  	Vue.prototype.$bus = this
  	Vue.prototype.$api = api
  },
  render: h => h(App)
}).$mount('#app')
