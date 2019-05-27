import { mapGetters, mapActions } from 'vuex'
import { formatDate, getWeeks, monthDisplay } from '@/components/calendar/utils'

export default {
  data () {
    return {
      dates: []
    }
  },
  computed: {
    ...mapGetters(['actualDate', 'businessId']),
    dateMonthHeader () {
      const d = new Date(this.selectedDate)
      return monthDisplay(d)
    },
    selectedDate () {
      return this.$route.params.date || this.actualDate
    },
    workMonth () {
      return +this.selectedDate.slice(5, 7) - 1
    },
    workYear () {
      return +this.selectedDate.slice(0, 4)
    }
  },
  mounted () {
    this.setDates()
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
      const dow = this.selectedWeek.findIndex(d => d.dateKey === dt)
      const irregularDay = this.isIrregularDay(dt)

      if (this.irregularDays.length && (this.irregularDays[0].employeeId !== this.selectedEmployee.id)) {
        return false
      }

      return irregularDay
        ? !irregularDay.schedule.length
        : !this.selectedEmployee.j.schedule.data[dow].length || !this.selectedEmployee.j.schedule.data[dow][1]
    },
    isIrregularDay (dt) {
      return this.irregularDays.find(d => d.date === dt && d.employeeId === this.selectedEmployee.id)
    },
    goDate (dt) {
      // this.setActualDate(dt)
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
