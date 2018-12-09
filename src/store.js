import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import Api from "@/api/backend";

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    alertMaxCount: 3,
    alerts: [],
    appTitle: "Kudri",
    restURL: "http://localhost:3000/",
    token: "",
    userID: ""
  },
  getters: {
    alerts: state => state.messages,
    appTitle: state => state.appTitle,
    loggedIn: state => {
      return state.token > "";
    },
    userID: state => state.userID
  },
  mutations: {
    ADD_ALERT(state, payload) {
      state.alerts.push(payload);
      if (state.alerts.length > state.alertMaxCount) {
        state.alerts.shift();
      }
    },
    SET_TOKEN(state, payload) {
      state.token = payload;
    },
    SET_USERID(state, payload) {
      state.userID = payload;
    }
  },
  actions: {
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
        })
        .catch(err => commit("ADD_ALERT", err.response.data));
    },
    logout({ commit }) {
      commit("SET_TOKEN", "");
      commit("SET_USERID", "");
    },
    alert({ commit }, payload) {
      commit("ADD_ALERT", payload);
    }
  }
});
