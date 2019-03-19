import ScheduleDay from './scheduleDay'

class BusinessSchedule {
  constructor ({ type, data }) {
    if (!type || !data) {
      this.type = 'week'
      this.data = []

      for (let i = 0; i < 7; i++) {
        this.data.push(new ScheduleDay({ start: '09:00', end: '18:00' }))
      }
      return
    }

    this.data = data
    this.type = type
  }
}

export default BusinessSchedule
