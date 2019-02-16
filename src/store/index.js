import Vue from 'vue';
import Vuex from 'vuex';
import common from '@/store/modules/common';
import alerts from '@/store/modules/alerts';

import user from '@/components/user/store';
import business from '@/components/business/store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    alerts,
    business,
    user
  }
});
