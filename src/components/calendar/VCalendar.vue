<template>
  <VLayout
    column
    class="calendar-wrapper"
  >
    <VFlex
      v-if="showHeader"
      class="month-header"
      :class="{ _expanded: expanded }"
      @click="expanded = !expanded"
      @mouseenter="tooltip = true"
      @mouseleave="tooltip = false"
    >
      <VLayout
        align-center
        justify-space-between
        row
        class="cal-month"
      >
        <div class="cal-head display-3">
          {{ dateMonthHeader }}
        </div>

        <div v-if="expanded">
          <v-btn
            class="cal-next-prev"
            depressed
            flat
            small
            color="#ffffff"
            @click.stop="addMonth(-1)"
          >
            <v-icon>navigate_before</v-icon>
          </v-btn>
          <v-btn
            class="cal-next-prev"
            color="#ffffff"
            depressed
            flat
            small
            @click.stop="addMonth(1)"
          >
            <v-icon>navigate_next</v-icon>
          </v-btn>
        </div>
        <v-tooltip
          v-if="!expanded"
          v-model="tooltip"
          attach=".month-header"
          top
          @input.stop=""
        >
          <span>Показать календарь</span>
        </v-tooltip>
      </VLayout>
    </VFlex>
    <VFlex v-if="dates">
      <VContainer class="calendar-container" :class="{ _expanded: expanded }">
        <VLayout
          v-show="period==='month'"
          align-space-between
          justify-center
          fill-height
          column
        >
          <VFlex>
            <VLayout
              justify-center
              row
              class="week-wrapper dow"
            >
              <VFlex
                v-for="(d, i) in dow"
                :key="i"
                xs2
                justify-center
                row
                class="text-xs-center"
              >
                <span
                  class="dow"
                  :class="{ weekend: i > 4 }"
                >
                  {{ d }}
                </span>
              </VFlex>
            </VLayout>
          </VFlex>
          <VFlex
            v-for="(week,i) in dates"
            :key="i"
          >
            <VLayout
              justify-center
              row
              class="week-wrapper"
            >
              <VFlex
                v-for="(day, di) in week"
                :key="di"
                xs2
              >
                <CalendarDayBtn
                  v-if="kind === 'mini'"
                  :counter="getBusinessDayVisits(day.dateKey)"
                  :day="day"
                  :holiday="isHoliday(day.dateKey)"
                  :weekend="(di > 4)"
                  @onClickDate="goDate($event)"
                />
                <CalendarDayCard
                  v-else
                  :day="day"
                  :visits="day.visits"
                  @onClickDate="goDate($event)"
                />
              </VFlex>
            </VLayout>
          </VFlex>
        </VLayout>
        <VLayout
          v-if="period==='week'"
          row
          pl-3
        >
          <CalendarDayColumn
            v-for="(day,i) in dates[0]"
            :key="i"
            :show-time="!i"
            :day="day"
            :holiday="isHoliday(day.dateKey)"
            :visits="dayVisits(day.dateKey, employee)"
            :schedule="getDateSchedule(day.dateKey)"
            :display-from="showTimes[0]"
            :display-to="showTimes[1]"
            @onClickDate="goDate($event)"
            @onSlotClick="onSlotClick"
            @onVisitEdit="onVisitEdit($event)"
            @onVisitDelete="onVisitDelete($event)"
            @onDayEdit="onDayEdit($event)"
          />
        </VLayout>
      </VContainer>
    </VFlex>

    <VDialog
      v-if="kind !== 'mini'"
      v-model="timeEdit"
      max-width="50em"
    >
      <DayScheduleEdit
        :day="currentDay.date"
        :schedule="getDateSchedule(currentDay.dateKey)"
        @onEdit="onDayScheduleEdit"
      />
    </VDialog>
  </VLayout>
</template>

<script>
import CalendarDayBtn from '@/components/calendar/CalendarDayBtn.vue'
import CalendarDayCard from '@/components/calendar/CalendarDayCard.vue'
import CalendarDayColumn from '@/components/calendar/CalendarDayColumn.vue'
import DayScheduleEdit from '@/components/calendar/DayScheduleEdit.vue'
import { visitInit } from '@/components/calendar/utils'
import { mapActions, mapGetters } from 'vuex'
import Api from '@/api/backend'
//import { makeAlert } from '@/api/utils'
import calendarMixin from '@/mixins/calendar'
import { formatDate } from '@/components/calendar/utils'

export default {
  components: {
    CalendarDayBtn,
    CalendarDayCard,
    CalendarDayColumn,
    DayScheduleEdit
  },
  mixins: [ calendarMixin ],
  props: {
    employee: {
      type: Object,
      default () {
        return {}
      }
    },
    newVisit: { type: Boolean, default: false },
    kind: { type: String, default: 'mini' },
    period: { type: String, default: 'month' },
    showHeader: { type: Boolean, default: true }
  },
  data () {
    const today = new Date()

    return {
      currentDay: {
        date: today,
        dateKey: formatDate(today)
      },
      currentVisit: visitInit(),
      dates: undefined,
      days: [],
      edit: false,
      expanded: true,
      timeEdit: false,
      visits: [],
      dow: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
      tooltip: false
    }
  },
  computed: {
    ...mapGetters([
      'businessInfo',
      'businessId',
      'calendar',
      'businessDayVisits',
      'schedule'
    ]),
    currentEmployee () {
      return this.employee || this.businessId
    },
    curSchedule () {
      if (!(this.schedule && this.minDate && this.maxDate)) {
        return Array(7)
      }
      return this.schedule.filter(
        d => d.dt >= this.minDate.dateKey && d.dt <= this.maxDate.dateKey
      )
    },
    maxDate () {
      if (!this.dates) return
      return this.dates[this.dates.length - 1][6]
    },
    minDate () {
      if (!this.dates) return
      return this.dates[0][0]
    },


  },
  watch: {
    newVisit: 'onNewVisit',
    edit: 'onCloseEdit'
  },
  mounted () {
    this.setDates() //это для мока
  },
  methods: {
    ...mapActions(['loadCalendar']),
    getBusinessDayVisits (dt) {
      const cnt =
        this.businessDayVisits &&
        this.businessDayVisits.filter(x => x.dt === dt)[0] &&
        this.businessDayVisits.filter(x => x.dt === dt)[0].count
      return cnt
    },
    onCloseEdit () {
      if (!this.edit) {
        this.$emit('closeEdit')
        this.currentVisit = visitInit()
      }
    },
    onDayEdit (day) {
      this.currentDay = day
      this.timeEdit = true
    },
    onDayScheduleEdit (payload) {
      if (!this.currentDay) {
        return
      }
      if (!this.businessId) {
        return
      }
      let dt = this.currentDay.dateKey
      let data = {
        j: { schedule: payload }
      }
      Api()
        .patch(
          `business_calendar?and=(business_id.eq.${this.businessId},dt.eq.${dt})`,
          data
        )
        .then(() => {
          this.timeEdit = false
          this.currentDay = {}
          this.loadCalendar({
            business: this.businessId,
            dates: [dt, dt]
          })
        })
    },
    onNewVisit () {
      if (this.newVisit) {
        this.currentVisit = visitInit()
        this.edit = true
      }
    },
    onSlotClick () {
      /*this.currentVisit = visitInit()
      this.currentVisit.ts_begin = date.toISOString()
      this.edit = true*/
    },
    onVisitDelete (item) {
      this.deleteVisit(item)
    },
    onVisitEdit (item) {
      this.currentVisit = item
      this.edit = true
    },
    setDateVisits () {
      this.setDates()
      this.dates = this.dates.map(w => {
        w = w.map(x => {
          x.visits = this.dayVisits(x.dateKey, this.businessId)
          return x
        })
        return w
      })
    }
  }
}
</script>
<style lang="scss" >
.dow {
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 12px;
  text-align: center;
  color: #fff;
  text-transform: capitalize;
  &.weekend {
    color: #8995af;
  }
}
.month-header {
  max-height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 38px 0 39px;
  background: url('../../assets/images/svg/calendar.svg') 199px center no-repeat, linear-gradient(270deg, #c9a15d -9.86%, #ba9462 103.49%);
  height: 40px;
  cursor: pointer;

  &._expanded {
    background: linear-gradient(270deg, #c9a15d -9.86%, #ba9462 103.49%);
  }
  .v-tooltip__content {
    position: absolute;
    top: 110% !important;
    right: 8px !important;
  }
}
.week-wrapper {
  width: 160px;
  margin: 2px auto;
  &.dow {
    margin-top: 14px;
    margin-bottom: 6px;
  }
}
.calendar-wrapper {
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(137, 149, 175, 0.2);
  margin-bottom: 24px;
}
.calendar-container {
  padding: 4px 40px 4px 36px;
}
.cal-month {
  width: 160px;
  margin: 0 auto;
}
.cal-head {
  font-size: 18px;
  text-transform: capitalize;
  color: #fff;
}
.cal-next-prev {
  position: relative;
  margin: 0;
  padding: 0;
  width: 16px;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  &:hover {
    background-color: rgba(255,255,255,0.3);
  }
  i {
    font-size: 16px;
  }

  .v-ripple__container {
    display: none !important;
  }
}
</style>
