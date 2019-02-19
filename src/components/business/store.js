import Api from '@/api/backend';
import { makeAlert } from '@/api/utils';

const state = {
  businessInfo: {},
  businessCategories: [
    'Салон красоты',
    'Частный мастер',
    'Spa салон',
    'Массажный салон',
    'Тату салон',
    'Маникюрная студия',
    'Косметологический кабинет'
  ]
};

const getters = {
  business: state => state.businessInfo && state.businessInfo.id,
  businessCategories: state => state.businessCategories,
  businessInfo: state => ({
    ...state.businessInfo,
    ...{
      category:
        state.businessInfo &&
        state.businessInfo.j &&
        state.businessInfo.j.category
    },
    ...{
      name:
        state.businessInfo && state.businessInfo.j && state.businessInfo.j.name
    }
  }),
  businessServices: state =>
    state.businessInfo && state.businessInfo.j && state.businessInfo.j.services,
  businessServiceCount: (state, getters) =>
    getters.businessServices && getters.businessServices.length
};

const mutations = {
  SET_BUSINESS_INFO(state, payload) {
    state.businessInfo = payload;
  }
};

const actions = {
  setBusiness({ commit, dispatch }, payload) {
    console.log(payload);
    if (!(payload && payload.length == 36)) {
      commit('SET_BUSINESS_INFO', {});
      return;
    }
    const path = `business?id=eq.${payload}`;
    Api()
      .get(path)
      .then(res => res.data[0])
      .then(res => {
        commit('SET_BUSINESS_INFO', res);
        dispatch('loadEmployee', payload);
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)));
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
