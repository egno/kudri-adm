import Api from '@/api/backend'
import store from '@/store'
import { makeAlert, responseGetId } from '@/api/utils'
import Name from '@/components/common/classes/name'

class Client {
  constructor (emp) {
    this.object = emp
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
    this.visit = (newVal && newVal.visit) || {}

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

  get sexList () {
    return [
      { code: 'M', display: 'Муж' },
      { code: 'F', display: 'Жен' },
      { code: 'C', display: 'Дети' }
    ]
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
   * @param {String} newVal
   */
  set fullName (newVal) {
    if (!newVal) return
    let name = new Name(newVal)
    this.j = { ...this.j, ...{ name: name } }
  }

  get fullName () {
    const n = new Name(this.j.name)
    return n.fullName
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
   * @param {any} newVal
   */
  set sex (newVal) {
    let val = newVal
    if (newVal || newVal === 0) {
      if (typeof newVal === 'number') {
        val = this.sexList[newVal].code
      }
      this.j = { ...this.j, ...{ sex: val } }
    } else {
      delete this.j.sex
    }
  }

  get sex () {
    return this.j && this.sexList.findIndex(x => x.code === this.j.sex)
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
