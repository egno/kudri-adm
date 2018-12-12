import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import VueCacheData from "vue-cache-data";
import Api from "@/api/backend";

Vue.use(Vuex);
Vue.use(VueAxios, axios, VueCacheData);

export default new Vuex.Store({
  state: {
    actions: [],
    alertMaxCount: 3,
    alerts: [],
    appTitle: "Kudri",
    navBarVisible: true,
    restURL: "http://localhost:3000/",
    token: "",
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
    navMenu: state => state.navMenu,
    token: state => state.token,
    userID: (state, getters) => {
      const info = getters.userInfo;
      if (info["me"]) {
        return info["me"]["email"];
      }
    },
    // TODO вытащить storage в отдельный модуль
    userInfo: state =>
      Object.assign(
        state.userInfo,
        JSON.parse(window.localStorage.userInfo || "{}")
      )
  },
  mutations: {
    ADD_ALERT(state, payload) {
      state.alerts.push(payload);
      if (state.alerts.length > state.alertMaxCount) {
        state.alerts.shift();
      }
    },
    NAVBAR(state, payload) {
      var status = payload == undefined ? !state.navBarVisible : payload;
      state.navBarVisible = status;
    },
    SAVE_TOKEN(state, payload) {
      // TODO вытащить storage в отдельный модуль
      window.localStorage.accessToken = payload;
    },
    SET_ACTIONS(state, payload) {
      state.actions = payload;
    },
    SET_TOKEN(state, payload) {
      state.token = payload;
    },
    SET_USERINFO(state, payload) {
      state.userInfo = payload;
    },
    SHOW_NAVBAR(state) {
      state.navBarVisible = true;
    }
  },
  actions: {
    actions({ commit }, payload) {
      commit("SET_ACTIONS", payload);
    },
    alert({ commit }, payload) {
      commit("ADD_ALERT", payload);
    },
    loadUserInfo({ commit }) {
      const infoPath = "rpc/me";
      Api()
        .post(infoPath)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          commit("SET_USERINFO", res);
          // TODO вытащить storage в отдельный модуль
          window.localStorage.userInfo = JSON.stringify(res);
        })
        .catch(err => commit("ADD_ALERT", err.response.data));
    },
    login({ commit }, payload) {
      const loginPath = "rpc/login";
      Api()
        .post(loginPath, payload)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => res.token)
        .then(token => {
          commit("SET_TOKEN", token);
          commit("SAVE_TOKEN", token);
        })
        .catch(err => commit("ADD_ALERT", err.response.data));
    },
    logout({ commit }) {
      commit("SET_TOKEN", "");
      commit("SET_USERINFO", {});
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("userInfo");
    },
    navBar({ commit }, payload) {
      commit("NAVBAR", payload);
    }
  }
});
