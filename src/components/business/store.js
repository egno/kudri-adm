import Api from '@/api/backend'
import { makeAlert } from '@/api/utils'

const state = {
  businessInfo: {},
  businessIndividualCategories: ['Частный мастер'],
  businessCategories: [
    'Клиника косметологии',
    'Салон красоты',
    'SPA  салон',
    'Фитнес клуб',
    'Тату салон',
    'Студия красоты',
    'Массажный салон',
    'Барбершоп'
  ],
  dayVisits: [],
  businessServices: [],
}

const getters = {
  businessId: state => state.businessInfo && state.businessInfo.id,
  businessCategories: state => [
    ...state.businessCategories,
    ...state.businessIndividualCategories
  ],
  businessCategory: state =>
    state.businessInfo && state.businessInfo.j && state.businessInfo.j.category,
  businessClientCount: state =>
    state.businessInfo && state.businessInfo.j && state.businessInfo.j.clients,
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
  businessName: (state, getters) =>
    getters.businessInfo && getters.businessInfo.name,
  businessInn: (state) =>
    state.businessInfo && state.businessInfo.j && state.businessInfo.j.inn,
  businessServiceCount: (state, getters) =>
    getters.businessServices && getters.businessServices.length,
  businessServiceCategories: (state) => {
    return [...new Set(state.businessServices.map(service => service.j && service.j.group).filter(name => !!name))]
  },
  businessDayVisits: state => state.dayVisits,
  businessFilialCount: state =>
    state.businessInfo && state.businessInfo.j && state.businessInfo.j.filials,
  businessIsIndividual: (state, getters) =>
    state.businessIndividualCategories.includes(getters.businessCategory),
  businessIsSalon: (state, getters) =>
    state.businessCategories.includes(getters.businessCategory),
  businessIsFilial: state => state.businessInfo && !!state.businessInfo.parent
}

const mutations = {
  ADD_CLIENTS_COUNTER (state, payload) {
    let counter =
      state.businessInfo &&
      state.businessInfo.j &&
      state.businessInfo.j.clients
    counter = counter + +payload
    state.businessInfo.j.clients = counter
  },
  SET_BUSINESS_INFO (state, payload) {
    state.businessInfo = payload
  },
  SET_DAY_VISITS (state, payload) {
    state.dayVisits = payload
  },
  SET_BUSINESS_SERVICES (state, payload) {
    state.businessServices = payload
  }
}

const actions = {
  loadDayVisits ({ commit }, payload) {
    if (!(payload && payload.month && payload.business)) return
    const path = `salon_day_visits?and=(salon_id.eq.${
      payload.business
    },dt1.eq.${payload.month})`
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_DAY_VISITS', res)
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },
  addClientsCounter ({ commit }, payload) {
    commit('ADD_CLIENTS_COUNTER', payload)
  },
  setBusiness ({ commit, dispatch }, businessId) {
    if (!(businessId && businessId.length == 36)) {
      commit('SET_BUSINESS_INFO', {})
      return
    }
    const path = `business?id=eq.${businessId}`
    Api()
      .get(path)
      .then(res => res.data[0])
      .then(res => {
        commit('SET_BUSINESS_INFO', res)
        dispatch('loadEmployee', businessId)
        dispatch('loadBusinessServices', businessId)
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },
  loadBusinessServices ({ commit }, branchId) {
    if (!branchId) {
      return
    }

    const path = `business_service?business_id=eq.${branchId}`

    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_BUSINESS_SERVICES', res)
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
