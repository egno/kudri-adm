import Api from '@/api/backend'
import store from '@/store'
import { makeAlert, responseGetId } from '@/api/utils'

class Employee {
  constructor (emp) {
    this.object = emp
  }

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set object (newVal) {
    this.id = (newVal && newVal.id) || null
    this.access = (newVal && newVal.access) || true
    this.parent = (newVal && newVal.parent) || null
    this.j = (newVal && newVal.j) || {}
    if (!this.j.services) {
      this.j.services = []
    }
    if (!this.j.schedule) {
      this.j.schedule = {}
    }
  }

  get object () {
    return this
  }

  set image (newVal) {
    this.j = {...{image: newVal}, ...this.j}
  }

  set services (newVal) {
    this.j = { ...{ services: newVal }, ...this.j }
  }

  load (id) {
    if (!id || id === 'new') return
    Api()
      .get(`employee?id=eq.${id}`)
      .then(res => res.data[0])
      .then(res => {
        this.object = res
      })
  }

  save () {
    if (!this.id) {
      return Api()
        .post(`employee?`, this.object)
        .then(res => responseGetId(res))
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
        })
    } else {
      return Api()
        .patch(`employee?id=eq.${this.id}`, this.object)
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
        })
    }
  }
}

export default Employee
