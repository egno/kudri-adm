import ApiObject from '@/classes/api_object'
import Api from '@/api/backend'
import store from '@/store'
import { makeAlert } from '@/api/utils'

class User extends ApiObject {

  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set jsonObject (newVal) {
    this.company_id = (newVal && newVal.company_id) || null
    this.id = (newVal && newVal.user_id) || null
    this.user_id = (newVal && newVal.user_id) || null
    this.j = (newVal && newVal.j) || {}
    this.phone = (newVal && newVal.phone) || null
    this.business = (newVal && newVal.business) || []

    // set calculated properties
    this.name = newVal && newVal.j && newVal.j.name || ''
    this.surname = newVal && newVal.j && newVal.j.surname || ''
    this.notes = newVal && newVal.j && newVal.j.notes
  }

  get jsonObject () {
    return {
      user_id: this.id,
      company_id: this.company_id,
      j: this.j,
      business: this.business,
      phone: this.phone
    }
  }

  // Properties

  /**
   * @param {any} newVal
   */
  set fullName (newVal) {
    let parts = newVal.split(' ')
    this.j.name = parts[0]
    parts.splice(0, 1)
    this.j.surname = parts.join(' ')
  }

  get fullName () {
    return [this.name, this.surname].join(' ')
  }

  get role () {
    return this.id && ((this.business.some(x => x.id === this.company_id)) ? 'Администратор компании' : 'Менеджер филиала')
  }

  get filialCount () {
    return this.business.length
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
    if (!id || id === 'new') return Promise.resolve()
    return Api()
      .get(`user?user_id=eq.${id}`)
      .then(res => res.data[0])
      .then(res => {
        this.jsonObject = res
      })
  }

  save () {
    if (!this.company_id) return Promise.resolve()
    return Api()
      .post(`user?`, this.jsonObject)
      .catch(err => {
        store.dispatch('alert', makeAlert(err))
        return false
      })

  }
}

export default User
