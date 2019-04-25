import { displayRESTDate, displayRESTTime } from '@/components/calendar/utils'

class Visit {
  constructor (val) {
    this.jsonObject = val
  }

  // Main object

  /**
   * @param {{ id: String; access: Boolean; business_id: String; j: Object; ts_begin: String; ts_end: String}} newVal
   */
  set jsonObject (newVal) {
    this.id = (newVal && newVal.id) || null
    this.business_id = (newVal && newVal.business_id) || null
    this.client_id = (newVal && newVal.client_id) || null
    this.salon_id = (newVal && newVal.salon_id) || null
    this.ts_begin = (newVal && newVal.ts_begin) || null
    this.ts_end = (newVal && newVal.ts_end) || null
    this.status = (newVal && newVal.status) || null
    this.j = (newVal && newVal.j) || {
      client: {},
      services: []
    }
    this.master = (newVal && newVal.master) || {}

    // set calculated properties
  }

  get jsonObject () {
    return this
  }

  // Properties

  get date () {
    return this.ts_begin && displayRESTDate(this.ts_begin)
  }

  get statuses () {
    return [
      { display: 'Не пришел', code: 'unvisited', color: '#ef4d37' },
      { display: 'Отмена', code: 'canceled', color: 'grey' },
      { display: 'Завершен', done: true },
      { display: 'В процессе' },
      { display: 'Запись', color: '#5699ff' }
    ]
  }

  get time () {
    return this.ts_begin && displayRESTTime(this.ts_begin)
  }

  get timeEnd () {
    return this.ts_end && displayRESTTime(this.ts_end)
  }

  get timeInterval () {
    return (
      this.ts_begin &&
      this.ts_end &&
      `${displayRESTTime(this.ts_begin)} - ${displayRESTTime(this.ts_end)}`
    )
  }

  get currentStatus () {
    const now = new Date()
    const t1 = new Date(Date.parse(this.ts_begin))
    const t2 = this.ts_end? new Date(Date.parse(this.ts_end)) : 0

    return (
      this.statuses.find(x => x.code === this.status) ||
      (now < t1
        ? this.statuses[4]
        : t2
        ? this.statuses[2]
        : this.statuses[3])
    )
  }

  get displayStatus () {
    return this.currentStatus.display
  }
}

export default Visit
