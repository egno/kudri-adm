import Vue from 'vue'
import './plugins/vuetify'
import Meta from 'vue-meta'
import App from './App.vue'
import router from './router'
import store from './store'
import VueYandexMetrika from 'vue-yandex-metrika'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'roboto-fontface/css/roboto-slab/roboto-slab-fontface.css'
import 'lato-font/css/lato-font.css'
import '@mdi/font/css/materialdesignicons.css'
//import 'vuetify/src/stylus/main.styl';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vueSmoothScroll from 'vue2-smooth-scroll'

import { businessCards } from './utils'

Vue.config.productionTip = false
Vue.use(Meta)

Vue.use(VueYandexMetrika, {
  id: process.env.VUE_APP_YANDEX_ID,
  router: router,
  env: process.env.NODE_ENV,
  debug: true,
  ignoreRoutes: businessCards,
  options: { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true }
})

Vue.use(vueSmoothScroll)
Vue.filter('phoneFormat', function (value) {
  if (!value) return ''
  if (value.length === 10) {
    return value.replace(
      /(\d{1,3})(\d{1,3})(\d{1,2})(\d{1,2})$/g,
      '+7 ($1) $2-$3-$4'
    )
  } else {
    return value.replace(
      /(\d?)(\d{1,3})(\d{1,3})(\d{1,2})(\d{1,2})$/g,
      '+$1 ($2) $3-$4-$5'
    )
  }

})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
