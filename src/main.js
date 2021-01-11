import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@style/app.less'

Vue.config.productionTip = false
console.log(router)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
