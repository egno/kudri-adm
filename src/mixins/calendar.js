import { mapGetters, mapActions } from 'vuex'
import { formatDate, getRESTTime, getWeeks, monthDisplay } from '@/components/calendar/utils'

export default {
  computed: {
    ...mapGetters(['actualDate']),
    dateMonthHeader () {
      const d = new Date(this.selectedDate)
      return monthDisplay(d)
    },
    showTimes () {
      if (!this.curSchedule) {
        return ['', '']
      }
      const workTimes = this.curSchedule
        .map(d => d.j.schedule || ['', ''])
        .reduce(
          (res, cur) => {
            if (cur[0] && (res[0] || cur[0]) >= cur[0]) {
              res[0] = cur[0]
            }
            if (res[1] < cur[1]) {
              res[1] = cur[1]
            }
            return res
          },
          ['', '']
        )
      if (!this.visits) {
        return workTimes
      }
      const visitTimes = this.visits
        .map(x => {
          return [getRESTTime(x.ts_begin), getRESTTime(x.ts_end)]
        })
        .reduce(
          (res, cur) => {
            if (cur[0] && (res[0] || cur[0]) >= cur[0]) {
              res[0] = cur[0]
            }
            if (res[1] < cur[1]) {
              res[1] = cur[1]
            }
            return res
          },
          ['', '']
        )
      return [
        workTimes[0] > (visitTimes[0] || workTimes[0])
          ? visitTimes[0]
          : workTimes[0],
        (workTimes[1] || visitTimes[1]) < visitTimes[1]
          ? visitTimes[1]
          : workTimes[1]
      ]
    },
    selectedDate () {
      return this.$route.params.date || this.actualDate
    },
  },
  methods: {
    ...mapActions(['setActualDate']),
    addMonth (i) {
      let dt = new Date(this.actualDate)
      dt.setMonth(dt.getMonth() + i)
      this.goDate(formatDate(dt))
    },
    dayVisits (dt, employee) {
      if (!this.visits || !this.visits.length) {
        return []
      }

      let filtered = this.visits.filter(v => (v.ts_begin.slice(0, 10) === dt) && (employee ? v.business_id === employee.id : v.business_id === this.businessId))

      return filtered
        .sort((a, b) => (a.ts_begin < b.ts_begin ? -1 : 1))
        .map(x => {
          let ts1 = new Date(x.ts_begin)
          let ts2 = new Date(x.ts_end)
          if (!x.client) {
            x.client = { services: [] }
          }
          x.client.duration = (ts2.getTime() - ts1.getTime()) / 60000
          return x
        })
    },
    isHoliday (dt) {
      if (!(this.calendar && this.calendar.filter(d => d.dt === dt).length))
        return
      return this.calendar.filter(d => d.dt === dt)[0].j.holiday
    },
    getDateSchedule (dt) {
      if (!this.curSchedule) return
      const d = this.curSchedule.filter(d => d.dt === dt)[0]
      return d && d.j && d.j.schedule
    },
    goDate (dt) {
      this.setActualDate(dt)
      this.$router.push({
        name: 'visitCalendar',
        params: { id: this.businessId, date: dt }
      })
    },
    setDates () {
      this.dates = getWeeks(this.workYear, this.workMonth)
      if (this.period === 'week') {
        this.dates = this.dates.filter(w =>
          w.some(d => d.dateKey === this.selectedDate)
        )
      }
    },
  }
}
