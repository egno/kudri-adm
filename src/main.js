import Vue from 'vue'
import './plugins/vuetify'
import Meta from 'vue-meta'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'roboto-fontface/css/roboto-slab/roboto-slab-fontface.css'
import 'lato-font/css/lato-font.css'
import '@mdi/font/css/materialdesignicons.css'
//import 'vuetify/src/stylus/main.styl';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false
Vue.use(Meta)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
