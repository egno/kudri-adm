import Vue from 'vue'
import Vuex from 'vuex'
import common from '@/store/modules/common'
import layout from '@/store/modules/layout'
import alerts from '@/store/modules/alerts'
import employee from '@/store/modules/employee'
import service from '@/store/modules/services'

import user from '@/components/user/store'
import business from '@/components/business/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    layout,
    alerts,
    business,
    employee,
    service,
    user
  }
})
