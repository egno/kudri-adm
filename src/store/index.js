import Vue from 'vue';
import Vuex from 'vuex';
import common from '@/store/modules/common';
import alerts from '@/store/modules/alerts';

import user from '@/components/user/store';
import business from '@/components/business/store';
import employee from '@/components/employee/store';
import service from '@/components/service/store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    alerts,
    business,
    employee,
    service,
    user
  }
});
