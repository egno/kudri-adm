import Api from '@/api/backend';
import { makeAlert } from '@/api/utils';

const state = {
  employeeCategories: [],
  employeePositions: []
};

const getters = {
  employeeCategories: state => state.employeeCategories,
  employeePositions: state => state.employeePositions
};

const mutations = {
  ADD_CATEGORIE(state, payload) {
    if (!payload) return;
    if (state.employeeCategories.some(x => x.name === payload)) return;
    state.employeeCategories.unshift({ name: payload });
  },
  ADD_POSITION(state, payload) {
    if (!payload) return;
    if (state.employeePositions.some(x => x.name === payload)) return;
    state.employeePositions.unshift({ name: payload });
  },
  SET_CATEGORIES(state, payload) {
    state.employeeCategories = payload;
  },
  SET_POSITIONS(state, payload) {
    state.employeePositions = payload;
  }
};

const actions = {
  addCategorie({ commit }, payload) {
    commit('ADD_CATEGORIE', payload);
  },
  addPosition({ commit }, payload) {
    commit('ADD_POSITION', payload);
  },
  loadEmployeeCategories({ commit }) {
    const path = 'employee_categories?name=not.is.null';
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_CATEGORIES', res.map(x => x.name));
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)));
  },
  loadEmployeePositions({ commit }) {
    const path = 'employee_positions?name=not.is.null';
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_POSITIONS', res.map(x => x.name));
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
