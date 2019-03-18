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
  set object (newVal) {
    this.title = newVal && newVal.title
    this.enabled = (newVal && newVal.enabled) || false
    if (newVal && newVal.phone !== 'undefined') {
      this.phone = newVal && newVal.phone
    }
  }
}

class Events extends ApiObject {
  set object (newVal) {
    this.promotion = new Event({
      ...{ title: 'Реклама' },
      ...(newVal && newVal.promotion)
    })
    this.time_visit = new Event({
      ...{ title: 'Напоминание о предстоящем визите' },
      ...(newVal && newVal.time_visit)
    })
    this.cancel_visit = new Event({
      ...{ title: 'Об отмене онлайн-записи', phone: null },
      ...(newVal && newVal.cancel_visit)
    })
    this.account_state = new Event({
      ...{
        title: 'О том, что на счете заканчиваются денежные средства',
        phone: null
      },
      ...(newVal && newVal.account_state)
    })
    this.confirm_phone = new Event({
      ...{ title: 'Запрос Клиенту на подтверждение номера телефона' },
      ...(newVal && newVal.confirm_phone)
    })
    this.new_visit_client = new Event({
      ...{ title: 'Клиенту о новой онлайн-записи' },
      ...(newVal && newVal.new_visit_client)
    })
    this.new_visit_manager = new Event({
      ...{ title: 'Заказчику о новой онлайн-записи', phone: null },
      ...(newVal && newVal.new_visit_manager)
    })
  }
}

class Provider extends ApiObject {
  set object (newVal) {
    this.key = newVal && newVal.key
    this.name = newVal && newVal.name
  }
}

class Notifications extends ApiObject {
  set object (newVal) {
    this.events = new Events(newVal && newVal.id)
    this.provider = new Provider(newVal && newVal.settings)
  }
}

class BusinessSettings extends ApiObject {
  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set object (newVal) {
    this.id = (newVal && newVal.id) || null
    this.settings = (newVal && newVal.settings) || {}

    this._notifications = new Notifications(
      this.settings && this.settings.notifications
    )
  }

  // Properties
  set notifications (newVal) {
    this._notifications = new Notifications(newVal)
    this.settings.notifications = this._notifications.object
  }

  get notifications () {
    return this._notifications
  }

  // API methods

  load (id) {
    if (!id || id === 'new') return
    return Api()
      .get(`business_settings?id=eq.${id}`)
      .then(res => res.data[0])
      .then(res => {
        this.object = res
      })
  }

  save () {
    if (!this.id) {
      return Api()
        .post(`business_settings?`, this.object)
        .then(res => responseGetId(res))
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
          return false
        })
    } else {
      return Api()
        .patch(`business_settings?id=eq.${this.id}`, this.object)
        .catch(err => {
          store.dispatch('alert', makeAlert(err))
          return false
        })
    }
  }
}

export default BusinessSettings
