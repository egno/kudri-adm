import Vue from 'vue';
import Vuex from 'vuex';
import common from '@/store/modules/common';
import alerts from '@/store/modules/alerts';

import user from '@/components/user/store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    alerts,
    user
  }
});
