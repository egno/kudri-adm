import { mapGetters, mapActions } from 'vuex'
import { formatDate, getWeeks, monthDisplay } from '@/components/calendar/utils'

export default {
  computed: {
    ...mapGetters(['actualDate']),
    dateMonthHeader () {
      const d = new Date(this.selectedDate)
      return monthDisplay(d)
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

          x.j.duration = (ts2.getTime() - ts1.getTime()) / 60000
          return x
        })
    },
    isHoliday (dt) {
      if (!(this.calendar && this.calendar.filter(d => d.dt === dt).length))
        return
      return this.calendar.filter(d => d.dt === dt)[0].j.holiday
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
