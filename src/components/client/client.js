import Api from '@/api/backend'
import store from '@/store'
import { makeAlert, responseGetId } from '@/api/utils'
import Name from '@/components/common/classes/name'

class Client {
  constructor (emp) {
    this.object = emp
    console.log(this.object)
  }

  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set object (newVal) {
    this.id = (newVal && newVal.id) || null
    this.business_id = (newVal && newVal.business_id) || null
    this.user_id = (newVal && newVal.user_id) || null
    this.j = (newVal && newVal.j) || {}

    // set calculated properties
    this.birth_date = newVal && newVal.j && newVal.j.birth_date
    this.discount = newVal && newVal.j && newVal.j.discount
    this.name = newVal && newVal.j && newVal.j.name
    this.email = newVal && newVal.j && newVal.j.email
    this.phone = newVal && newVal.j && newVal.j.phone
    this.sex = newVal && newVal.j && newVal.j.sex
    this.notes = newVal && newVal.j && newVal.j.notes
  }

  get object () {
    return this
  }

  // Properties

  /**
   * @param {String} newVal
   */
  set birth_date (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ birth_date: newVal } }
    } else {
      delete this.j.birth_date
    }
  }

  get birth_date () {
    return this.j && this.j.birth_date
  }

  /**
   * @param {String} newVal
   */
  set discount (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ discount: newVal } }
    } else {
      delete this.j.discount
    }
  }

  get discount () {
    return this.j && this.j.discount
  }

  /**
   * @param {String} newVal
   */
  set email (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ email: newVal } }
    } else {
      delete this.j.email
    }
  }

  get email () {
    return this.j && this.j.email
  }

  /**
   * @param {any} newVal
   */
  set name (newVal) {
    if (!newVal) return
    let name = new Name(newVal)
    this.j = { ...this.j, ...{ name: name } }
  }

  get name () {
    return new Name(this.j.name)
  }

  /**
   * @param {String} newVal
   */
  set phone (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ phone: newVal } }
    } else {
      delete this.j.phone
    }
  }

  get phone () {
    return this.j && this.j.phone
  }

  /**
   * @param {String} newVal
   */
  set sex (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ sex: newVal } }
    } else {
      delete this.j.sex
    }
  }

  get sex () {
    return this.j && this.j.sex
  }

  /**
   * @param {String} newVal
   */
  set notes (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ notes: newVal } }
    } else {
      delete this.j.notes
    }
  }

  get notes () {
    return this.j && this.j.notes
  }

  // API methods

  load (id) {
    if (!id || id === 'new') return
    Api()
      .get(`client?id=eq.${id}`)
      .then(res => res.data[0])
      .then(res => {
        this.object = res
      })
  }

  save () {
    if (!this.business_id) return
    if (!this.id) {
      return Api()
        .post(`client?`, this.object)
        .then(res => responseGetId(res))
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
        })
    } else {
      return Api()
        .patch(`client?id=eq.${this.id}`, this.object)
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
        })
    }
  }
}

export default Client
