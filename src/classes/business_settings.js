import ApiObject from '@/classes/api_object'
import Api from '@/api/backend'
import store from '@/store'
import { makeAlert, responseGetId } from '@/api/utils'

/*
Example 

settings = {
  notifications: {
    events: {
      promotion: { enabled: false },
      time_visit: { enabled: false },
      cancel_visit: { phone: '799999998', enabled: false },
      account_state: { enabled: false },
      confirm_phone: { enabled: false },
      new_visit_client: { enabled: false },
      new_visit_manager: { phone: '79658239468', enabled: false }
    },
    provider: {
      key: 'bo7PrOZBvFwgeNDmOBcUjrJfDNYEDTgkMt62j4AdF7Utbt6tig7xecfVo7Kn',
      name: 'SMS gorod'
    }
  }
};
*/

class Event extends ApiObject {
  set jsonObject (newVal) {
    this._title = newVal && newVal.title
    this.enabled = (newVal && newVal.enabled) || false
    if (newVal && newVal.description) {
      this.description = newVal.description
    }
    if (newVal && (newVal.phone || newVal.phone === null)) {
      this.phone = newVal && newVal.phone
    }
    if (newVal && (newVal.template || newVal.template === null)) {
      this.template = newVal && newVal.template
    }
  }
  get jsonObject () {
    let res = super.jsonObject
    if (this._phone) {
      res.phone = this._phone
    }
    return res
  }

  set title (newVal) {
    this._title = newVal
  }
  get title () {
    return this._title
  }

  set phone (newVal) {
    this._phone = newVal ? newVal : null
  }
  get phone () {
    return this._phone
  }
}

class Events extends ApiObject {
  set jsonObject (newVal) {
    this.balance_level = new Event({
      ...{ title: 'SMS-уведомление по остатку на счете' },
      ...(newVal && newVal.balance_level)
    })
    this.new_visit_client = new Event({
      ...{
        title: 'Уведомлять клиента о новой онлайн-записи',
        description: 'Шаблон рассылки: <br/> Вы записаны на визит к&nbsp;&lt;Должность&nbsp;мастера&gt; &lt;Имя&nbsp;и&nbsp;Фамилия Мастера&gt; на&nbsp;&lt;время&nbsp;записи&gt; в&nbsp;&lt;Название&nbsp;филиала&gt;'
      },
      ...(newVal && newVal.new_visit_client)
    })
    this.new_visit_manager = new Event({
      ...{
        title: 'Уведомлять менеджера филиала о новой онлайн-записи',
        description: 'Шаблон рассылки: <br/> Новая онлайн запись к&nbsp;&lt;Мастер&gt; на&nbsp;&lt;Время&nbsp;записи&gt; в&nbsp;&lt;Название&nbsp;филиала&gt;',
        phone: null
      },
      ...(newVal && newVal.new_visit_manager)
    })
    this.cancel_visit = new Event({
      ...(newVal && newVal.cancel_visit),
      ...{ title: 'Уведомлять сотрудника об отмене онлайн-записи', phone: null }
    })
    this.time_visit = new Event({
      ...{ title: 'Напоминать клиенту о предстоящем визите' },
      ...(newVal && newVal.time_visit)
    })
  }
  get jsonObject () {
    return super.jsonObject
  }
}

class Provider extends ApiObject {
  set jsonObject (newVal) {
    this.key = newVal && newVal.key
    this.name = newVal && newVal.name
    this.login = newVal && newVal.login
    this.password = newVal && newVal.password
  }
  get jsonObject () {
    return super.jsonObject
  }
}

class Notifications extends ApiObject {
  set jsonObject (newVal) {
    this.events = new Events(newVal && newVal.events)
    this.provider = new Provider(newVal && newVal.provider)
  }
  get jsonObject () {
    return super.jsonObject
  }
}

class Settings extends ApiObject {
  set jsonObject (newVal) {
    this.notifications = new Notifications(newVal && newVal.notifications)
  }
  get jsonObject () {
    return super.jsonObject
  }
}

class BusinessSettings extends ApiObject {
  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set jsonObject (newVal) {
    this.id = (newVal && newVal.id) || null
    this.settings = new Settings(newVal && newVal.settings)
  }

  get jsonObject () {
    return super.jsonObject
  }

  // Properties
  set notifications (newVal) {
    this.settings.notifications = newVal
  }

  get notifications () {
    return this.settings.notifications
  }

  // API methods

  load (id) {
    if (!id || id === 'new') return
    return Api()
      .get(`business_settings?id=eq.${id}`)
      .then(res => res.data[0])
      .then(res => {
        this.jsonObject = res
      })
  }

  save () {
    if (!this.id) {
      return Api()
        .post(`business_settings?`, this.jsonObject)
        .then(res => responseGetId(res))
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
          return false
        })
    } else {
      return Api()
        .patch(`business_settings?id=eq.${this.id}`, this.jsonObject)
        .then(() => {
          store.dispatch('alert', makeAlert('Сохранено успешно'))
        })
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
          return false
        })
    }
  }
}

export default BusinessSettings
