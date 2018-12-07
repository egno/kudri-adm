import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    appTitle: "Kudri",
    restURL: "http://localhost:3000/",
    token: "",
    userID: "",
    loggedIn: true
  },
  getters: {
    appTitle: state => state.appTitle,
    userID: state => state.userID
  },
  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload;
    },
    SET_USERID(state, payload) {
      state.userID = payload;
    }
  },
  actions: {
    login({ commit, state }, payload) {
      const loginPath = "rpc/login";
      const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        data: payload,
        url: state.restURL + loginPath
      };
      axios(options).then(res => {
        if (res && res.data && res.data[0] && res.data[0]["token"]) {
          commit("SET_TOKEN", res.data[0]["token"]);
          commit("SET_USERID", payload["email"]);
        }
      });
    }
  }
});
