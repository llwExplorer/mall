import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'

import toast from 'components/common/toast'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

//封装toast组件，并安装
Vue.use(toast)


//$mount('#app')将vue实例手动挂载到#app元素上
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
