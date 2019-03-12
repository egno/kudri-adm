import Api from '@/api/backend'
import store from '@/store'
import { makeAlert, responseGetId } from '@/api/utils'
import { imagePath } from '@/components/gallery/utils'

class Employee {
  constructor (emp) {
    this.object = emp
  }

  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set object (newVal) {
    this.id = (newVal && newVal.id) || null
    this.access = (newVal && newVal.access) || true
    this.parent = (newVal && newVal.parent) || null
    this.j = (newVal && newVal.j) || {}
    if (!this.j.services) {
      this.services = []
    }
    if (!this.j.schedule) {
      this.j.schedule = {}
    }
  }

  get object () {
    return this
  }

  // Properties

  /**
   * @param {String} newVal
   */
  set image (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ image: newVal } }
    } else {
      delete this.j.image
    }
  }

  get image () {
    return this.j && this.j.image
  }

  get imagePath () {
    return this.image && imagePath(this.image, this.parent)
  }

  /**
   * @param {Array} newVal
   */
  set services (newVal) {
    this.j = { ...this.j, ...{ services: newVal || [] } }
  }

  // API methods

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
