import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '../assets/stylus/main.styl'
import ru from 'vuetify/es5/locale/ru'

Vue.use(Vuetify, {
  options: {
    customProperties: true
  },
  iconfont: 'mdi',
  lang: {
    locales: { ru },
    current: 'ru'
  },
  theme: {
    primary: '#5699FF',
    secondary: '#343e55',
    gold: '#b69768',
    accent: '#ef4d37'
  }
})
