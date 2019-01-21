import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCacheData from 'vue-cache-data';
import Api from '@/api/backend';
import { formatDate, getISOTimeZoneOffset } from '@/components/calendar/utils';
import { makeAlert } from '@/api/utils';

Vue.use(Vuex);
Vue.use(VueAxios, axios, VueCacheData);

// TODO вытащить localStorage в отдельный модуль

export default new Vuex.Store({
  state: {
    actions: [],
    actualDate: '',
    alertMaxCount: 1,
    alerts: [],
    apiTime: '',
    appTitle: '',
    business: '',
    calendar: [],
    schedule: [],
    defaultAppTitle: 'Kudri',
    navBarVisible: true,
    searchString: '',
    selectedVisit: undefined,
    serviceList: [],
    token: '',
    userInfo: {}
  },
  getters: {
    actions: state => state.actions,
    actualDate: state => state.actualDate,
    alerts: state => state.alerts,
    apiTime: state => state.apiTime,
    apiTimeZone: state => {
      if (!state.apiTime) {
        return;
      }
      return getISOTimeZoneOffset(state.apiTime);
    },
    appTitle: state => state.appTitle || state.defaultAppTitle,
    businessEmployee: state =>
      state.business &&
      state.calendar &&
      state.calendar[Object.keys(state.calendar)[0]] &&
      state.calendar[Object.keys(state.calendar)[0]].employee &&
      state.calendar[Object.keys(state.calendar)[0]].employee.map(
        x => x.business_id
      ),
    calendar: state => state.calendar,
    loggedIn: (state, getters) => {
      return getters.userID;
    },
    navBarVisible: state => state.navBarVisible,
    schedule: state => state.schedule,
    searchString: state => state.searchString,
    selectedVisit: state => state.selectedVisit,
    serviceCategories: state =>
      state.serviceList
        .map(x => x.j.groups)
        .reduce((acc, cur) => {
          acc.push(...cur);
          return acc;
        }, [])
        .filter((element, index, array) => array.indexOf(element) === index),
    serviceList: state => state.serviceList,
    token: state => {
      return state.token;
      // window.localStorage.accessToken;
    },
    userAvatar: state => {
      if (!state.userInfo) return;
      if (state.userInfo.avatar) return state.userInfo.avatar;
      if (!state.userInfo.data) return;
      return state.userInfo.data.avatar;
    },
    userID: (state, getters) => {
      const info = getters.userInfo;
      if (info) {
        return info['login'];
      }
    },
    userInfo: state => {
      return state.userInfo;
    },
    userLogin: (state, getters) => {
      const info = getters.userInfo;
      if (info) {
        return info['login'];
      }
    }
  },
  mutations: {
    ADD_ALERT(state, payload) {
      if (!payload) {
        return;
      }
      state.alerts.push(payload);
      if (state.alerts.length > state.alertMaxCount) {
        state.alerts.shift();
      }
    },
    DEL_ALERT(state, payload) {
      if (!payload) {
        state.alerts = [];
      }
    },
    LOAD_CALENDAR(state, payload) {
      // for (let day of payload) {
      //   let d = day.j;
      //   d.employee = day.employee;
      //   state.calendar[day.dt] = d;
      // }
      state.calendar = payload;
    },
    LOAD_SCHEDULE(state, payload) {
      state.schedule = payload;
    },
    LOAD_SERVICE_CATEGORIES(state, payload) {
      state.serviceCategories = payload;
    },
    LOAD_SERVICE_LIST(state, payload) {
      state.serviceList = payload;
    },
    NAVBAR(state, payload) {
      var status = payload == undefined ? !state.navBarVisible : payload;
      state.navBarVisible = status;
    },
    SELECT_VISIT(state, payload) {
      state.selectedVisit = payload;
    },
    SET_ACTIONS(state, payload) {
      state.actions = payload || [];
    },
    SET_ACTUAL_DATE(state, payload) {
      state.actualDate = payload;
    },
    SET_API_TIME(state, payload) {
      state.apiTime = payload;
    },
    SET_APP_TITLE(state, payload) {
      state.appTitle = payload;
    },
    SET_BUSINESS(state, payload) {
      state.business = payload;
    },
    SET_SEARCH_STRING(state, payload) {
      state.searchString = payload;
    },
    SET_TOKEN(state, payload) {
      state.token = payload;
      if (payload) {
        localStorage.setItem('accessToken', payload);
      } else {
        localStorage.removeItem('accessToken');
      }
    },
    SET_USERINFO(state, payload) {
      state.userInfo = payload;
      if (payload) {
        localStorage.setItem('userInfo', JSON.stringify(payload));
      } else {
        localStorage.removeItem('userInfo');
      }
    },
    SHOW_NAVBAR(state) {
      state.navBarVisible = true;
    }
  },
  actions: {
    delAlert({ commit }, payload) {
      commit('DEL_ALERT', payload);
    },
    selectVisit({ commit }, payload) {
      commit('SELECT_VISIT', payload);
    },
    setActions({ commit }, payload) {
      commit('SET_ACTIONS', payload);
    },
    setActualDate({ commit, dispatch, state }, payload) {
      if (payload instanceof Date) {
        payload = formatDate(payload);
      }
      if (!payload) {
        const dt = new Date();
        payload = formatDate(dt);
      }
      if (
        state.actualDate.slice(0, 7) !== payload.slice(0, 7) ||
        Object.keys(state.calendar).length === 0
      ) {
        const from = `${payload.slice(0, 7)}-01`;
        let d1 = new Date();
        d1.setDate(1);
        d1.setYear(payload.slice(0, 4));
        d1.setMonth(payload.slice(5, 7));
        dispatch('loadCalendar', {
          business: state.business,
          dates: [from, formatDate(d1)]
        });
      }
      commit('SET_ACTUAL_DATE', payload);
    },
    setAppTitle({ commit }, payload) {
      commit('SET_APP_TITLE', payload);
    },
    setBusiness({ commit }, payload) {
      commit('SET_BUSINESS', payload);
    },
    setSearchString({ commit }, payload) {
      commit('SET_SEARCH_STRING', payload);
    },
    alert({ commit }, payload) {
      commit('ADD_ALERT', payload);
    },
    loadApiTime({ commit }) {
      Api()
        .get('info')
        .then(res => res.data[0])
        .then(res => {
          commit('SET_API_TIME', res.current_timestamp);
        })
        .catch(err => commit('ADD_ALERT', makeAlert(err)));
    },
    loadCalendar({ commit }, payload) {
      if (!payload.business) {
        return;
      }
      const path = `business_calendar?select=dt,j,employee&and=(business_id.eq.${
        payload.business
      },dt.gte.${payload.dates[0]},dt.lte.${payload.dates[1]})`;
      Api()
        .get(path)
        .then(res => res.data)
        .then(res => {
          commit('LOAD_SCHEDULE', res);
        })
        .catch(err => commit('ADD_ALERT', makeAlert(err)));
      const c_path = `calendar?and=(dt.gte.${payload.dates[0]},dt.lte.${
        payload.dates[1]
      })`;
      Api()
        .get(c_path)
        .then(res => res.data)
        .then(res => {
          commit('LOAD_CALENDAR', res);
        })
        .catch(err => commit('ADD_ALERT', makeAlert(err)));
    },
    loadFromStorage({ commit, dispatch }) {
      commit('SET_TOKEN', localStorage.getItem('accessToken'));
      dispatch('loadUserInfo');
    },
    loadServiceList({ commit }) {
      const path = 'service';
      Api()
        .get(path)
        .then(res => res.data)
        .then(res => {
          commit('LOAD_SERVICE_LIST', res);
        })
        .catch(err => commit('ADD_ALERT', makeAlert(err)));
    },
    loadUserInfo({ commit }) {
      const infoPath = 'rpc/me';
      Api()
        .post(infoPath)
        .then(res => res.data)
        .then(res => {
          commit('SET_USERINFO', res);
        })
        .catch(err => commit('ADD_ALERT', makeAlert(err)));
    },
    login({ commit, dispatch }, payload) {
      const loginPath = 'rpc/login';
      localStorage.removeItem('accessToken');
      Api()
        .post(loginPath, payload)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => res.token)
        .then(token => {
          commit('SET_TOKEN', token);
          dispatch('loadUserInfo');
        })
        .catch(err => {
          commit('ADD_ALERT', makeAlert(err));
        });
    },
    logout({ commit }) {
      commit('SET_TOKEN', '');
      commit('SET_USERINFO', {});
    },
    navBar({ commit }, payload) {
      commit('NAVBAR', payload);
    }
  }
});
