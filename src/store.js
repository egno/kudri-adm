import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCacheData from 'vue-cache-data';
import Api from '@/api/backend';

Vue.use(Vuex);
Vue.use(VueAxios, axios, VueCacheData);

// TODO вытащить localStorage в отдельный модуль

export default new Vuex.Store({
  state: {
    actions: [],
    alertMaxCount: 3,
    alerts: [],
    appTitle: 'Kudri',
    navBarVisible: true,
    searchString: '',
    serviceList: [],
    token: '',
    userInfo: {}
  },
  getters: {
    actions: state => state.actions,
    alerts: state => state.messages,
    appTitle: state => state.appTitle,
    loggedIn: (state, getters) => {
      return getters.userID;
    },
    navBarVisible: state => state.navBarVisible,
    searchString: state => state.searchString,
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
      state.alerts.push(payload);
      if (state.alerts.length > state.alertMaxCount) {
        state.alerts.shift();
      }
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
    SET_ACTIONS(state, payload) {
      state.actions = payload || [];
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
    setActions({ commit }, payload) {
      commit('SET_ACTIONS', payload);
    },
    setSearchString({ commit }, payload) {
      commit('SET_SEARCH_STRING', payload);
    },
    alert({ commit }, payload) {
      commit('ADD_ALERT', payload);
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
        .catch(err => commit('ADD_ALERT', err.response.data));
    },
    loadUserInfo({ commit }) {
      const infoPath = 'rpc/me';
      Api()
        .post(infoPath)
        .then(res => res.data)
        .then(res => {
          commit('SET_USERINFO', res);
        })
        .catch(err => commit('ADD_ALERT', err.response.data));
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
        .catch(err => commit('ADD_ALERT', err.response.data));
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
