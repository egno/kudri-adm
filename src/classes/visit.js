import { displayRESTDate, displayRESTTime } from '@/components/calendar/utils'

class Visit {
  constructor (val) {
    this.object = val
  }

  // Main object

  /**
   * @param {{ id: String; access: Boolean; business_id: String; client: Object; ts_begin: String; ts_end: String}} newVal
   */
  set object (newVal) {
    this.id = (newVal && newVal.id) || null
    this.business_id = (newVal && newVal.business_id) || null
    this.client_id = (newVal && newVal.client_id) || null
    this.salon_id = (newVal && newVal.salon_id) || null
    this.ts_begin = (newVal && newVal.ts_begin) || null
    this.ts_end = (newVal && newVal.ts_end) || null
    this.status = (newVal && newVal.status) || null
    this.price = (newVal && newVal.price) || null
    this.client = (newVal && newVal.client) || {}
    this.master = (newVal && newVal.master) || {}

    // set calculated properties
  }

  get object () {
    return this
  }

  // Properties

  get date () {
    return this.ts_begin && displayRESTDate(this.ts_begin)
  }

  get statuses () {
    return [
      { display: 'Не пришел', code: 'unvisited', color: 'red' },
      { display: 'Отмена', code: 'canceled', color: 'grey' },
      { display: 'Завершен' },
      { display: 'В процессе' },
      { display: 'Запись', color: '#55f' }
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
    const t2 = new Date(Date.parse(this.ts_end))

    return this.statuses.filter(x => x.code === this.status)[0] || (now > t2
      ? this.statuses[2]
      : now > t1
      ? this.statuses[3]
      : this.statuses[4])
  }

  get displayStatus () {
    return this.currentStatus.display
  }
}

export default Visit
