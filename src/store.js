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
    userID: ""
  },
  getters: {
    actions: state => state.actions,
    alerts: state => state.messages,
    appTitle: state => state.appTitle,
    loggedIn: state => {
      return (state.token || window.localStorage.accessToken) > "";
    },
    navBarVisible: state => state.navBarVisible,
    userID: state => {
      return state.userID || window.localStorage.userID;
    }
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
      window.localStorage.accessToken = payload;
    },
    SET_ACTIONS(state, payload) {
      state.actions = payload;
    },
    SET_TOKEN(state, payload) {
      state.token = payload;
    },
    SET_USERID(state, payload) {
      state.userID = payload;
      window.localStorage.accessToken = payload;
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
    login({ commit }, payload) {
      const loginPath = "rpc/login";
      Api()
        .post(loginPath, payload)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => res.token)
        .then(token => {
          commit("SET_TOKEN", token);
          commit("SET_USERID", payload["email"]);
          commit("SAVE_TOKEN", token);
        })
        .catch(err => commit("ADD_ALERT", err.response.data));
    },
    logout({ commit }) {
      commit("SET_TOKEN", "");
      commit("SET_USERID", "");
      window.localStorage.accessToken;
    },
    navBar({ commit }, payload) {
      commit("NAVBAR", payload);
    }
  }
});
