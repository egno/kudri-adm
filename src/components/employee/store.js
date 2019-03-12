import Api from '@/api/backend'
import { makeAlert } from '@/api/utils'

const state = {
  employee: [],
  employeeCategories: [],
  employeePositions: []
}

const getters = {
  employee: state => state.employee,
  employeeCategories: state => state.employeeCategories,
  employeePositions: state => state.employeePositions,
  employeeServices: state =>
    state.employee &&
    state.employee
      .map(x => x.j && x.j.services.map(s => ({ employee: x.id, service: s })))
      .flat()
}

const mutations = {
  ADD_CATEGORIE (state, payload) {
    if (!payload) return
    if (state.employeeCategories.some(x => x.name === payload)) return
    state.employeeCategories.unshift({ name: payload })
  },
  ADD_POSITION (state, payload) {
    if (!payload) return
    if (state.employeePositions.some(x => x.name === payload)) return
    state.employeePositions.unshift({ name: payload })
  },
  LOAD_EMPLOYEE (state, payload) {
    state.employee = payload || []
  },
  SET_CATEGORIES (state, payload) {
    state.employeeCategories = payload
  },
  SET_POSITIONS (state, payload) {
    state.employeePositions = payload
  }
}

const actions = {
  addCategorie ({ commit }, payload) {
    commit('ADD_CATEGORIE', payload)
  },
  addPosition ({ commit }, payload) {
    commit('ADD_POSITION', payload)
  },
  loadEmployee ({ commit }, payload) {
    commit('LOAD_EMPLOYEE', null)
    if (!payload) {
      return
    }
    const path = `employee?parent=eq.${payload}`
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('LOAD_EMPLOYEE', res)
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },
  loadEmployeeCategories ({ commit }) {
    const path = 'employee_categories?name=not.is.null'
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_CATEGORIES', res.map(x => x.name))
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },
  loadEmployeePositions ({ commit }) {
    const path = 'employee_positions?name=not.is.null'
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_POSITIONS', res.map(x => x.name))
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
