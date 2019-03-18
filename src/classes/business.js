import ApiObject from '@/classes/api_object'
import Api from '@/api/backend'
import store from '@/store'
import { makeAlert, responseGetId } from '@/api/utils'

class Business extends ApiObject {
  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set object (newVal) {
    this.id = (newVal && newVal.id) || null
    this.access = (newVal && newVal.access) || true
    this.parent = (newVal && newVal.parent) || null
    this.type = (newVal && newVal.type) || null
    this.j = (newVal && newVal.j) || {}
  }

  get object () {
    const exported = ['id', 'access', 'parent', 'type', 'j']
    return Object.keys(this)
      .filter(key => exported.some(x => x === key))
      .reduce((obj, key) => {
        obj[key] = this[key]
        return obj
      }, {})
  }

  // Properties
  set avatar (newVal) {
    if (newVal) {
      this.j.avatar = newVal
    } else {
      delete this.j.avatar
    }
  }

  get avatar () {
    return this.j && this.j.avatar
  }

  set category (newVal) {
    if (newVal) {
      this.j.category = newVal
    } else {
      delete this.j.category
    }
  }

  get category () {
    return this.j && this.j.category
  }

  set inn (newVal) {
    if (newVal) {
      this.j.inn = newVal
    } else {
      delete this.j.inn
    }
  }

  get inn () {
    return this.j && this.j.inn
  }

  set name (newVal) {
    if (newVal) {
      this.j.name = newVal
    } else {
      delete this.j.name
    }
  }

  get name () {
    return this.j && this.j.name
  }

  set office (newVal) {
    if (newVal) {
      this.j.office = newVal
    } else {
      delete this.j.office
    }
  }

  get office () {
    return this.j && this.j.office
  }

  set rating (newVal) {
    if (newVal) {
      this.j.rating = newVal
    } else {
      delete this.j.rating
    }
  }

  get rating () {
    return this.j && this.j.rating
  }

  // counters

  set clients (newVal) {
    if (newVal) {
      this.j.clients = newVal
    } else {
      delete this.j.clients
    }
  }

  get clients () {
    return this.j && this.j.clients
  }

  set employees (newVal) {
    if (newVal) {
      this.j.employees = newVal
    } else {
      delete this.j.employees
    }
  }

  get employees () {
    return this.j && this.j.employees
  }

  set filials (newVal) {
    if (newVal) {
      this.j.filials = newVal
    } else {
      delete this.j.filials
    }
  }

  get filials () {
    return this.j && this.j.filials
  }

  set gallery (newVal) {
    if (newVal) {
      this.j.gallery = newVal
    } else {
      delete this.j.gallery
    }
  }

  get gallery () {
    return this.j && this.j.gallery
  }

  // objects

  set address (newVal) {
    if (newVal) {
      this.j.address = newVal
    } else {
      delete this.j.address
    }
  }

  get address () {
    return this.j && this.j.address
  }

  set links (newVal) {
    if (newVal) {
      this.j.links = newVal
    } else {
      delete this.j.links
    }
  }

  get links () {
    return this.j && this.j.links
  }

  set manager (newVal) {
    if (newVal) {
      this.j.manager = newVal
    } else {
      delete this.j.manager
    }
  }

  get manager () {
    return this.j && this.j.manager
  }

  set phones (newVal) {
    if (newVal) {
      this.j.phones = newVal
    } else {
      delete this.j.phones
    }
  }

  get phones () {
    return this.j && this.j.phones
  }

  set schedule (newVal) {
    if (newVal) {
      this.j.schedule = newVal
    } else {
      delete this.j.schedule
    }
  }

  get schedule () {
    return this.j && this.j.schedule
  }

  set services (newVal) {
    if (newVal) {
      this.j.services = newVal
    } else {
      delete this.j.services
    }
  }

  get services () {
    return this.j && this.j.services
  }

  // API methods

  load (id) {
    if (!id || id === 'new') return
    return Api()
      .get(`business?id=eq.${id}`)
      .then(res => res.data[0])
      .then(res => {
        this.object = res
      })
  }

  save () {
    if (!this.id) {
      return Api()
        .post(`business?`, this.object)
        .then(res => responseGetId(res))
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
          return false
        })
    } else {
      return Api()
        .patch(`business?id=eq.${this.id}`, this.object)
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
          return false
        })
    }
  }
}

export default Business
