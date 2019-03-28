import Api from '@/api/backend'
import { makeAlert } from '@/api/utils'

const state = {
  serviceGroups: [],
}

const getters = {
  serviceGroups: state => state.serviceGroups
}

const mutations = {
  SET_SERVICE_GROUPS (state, payload) {
    state.serviceGroups = payload
  }
}

const actions = {
  loadServiceGroups ({ commit }) {
    const path = 'service_groups?name=not.is.null'
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_SERVICE_GROUPS', res.map(x => x.name))
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
