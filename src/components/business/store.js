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
  ],
  dayVisits: []
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
    getters.businessServices && getters.businessServices.length,
  businessDayVisits: state => state.dayVisits
};

const mutations = {
  SET_BUSINESS_INFO(state, payload) {
    state.businessInfo = payload;
  },
  SET_DAY_VISITS(state, payload) {
    state.dayVisits = payload;
  }
};

const actions = {
  loadDayVisits({ commit }, payload) {
    if (!(payload && payload.month && payload.business)) return;
    const path = `salon_day_visits?and=(salon_id.eq.${
      payload.business
    },dt1.eq.${payload.month})`;
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_DAY_VISITS', res);
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)));
  },
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
