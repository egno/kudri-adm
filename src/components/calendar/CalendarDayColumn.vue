<template>
  <div
    :class="['day-column', { today: isToday }]"
  >
    <v-menu v-model="showMenu" offset-y :disabled="day.dateKey <= todayString">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <div :class="{ 'day-column__header': true, active: showMenu }">
            <div class="day-column__date">
              {{ day.display }}
            </div>
            <div :class="['day-column__day', { 'day-off': isDayOff }]">
              {{ dowLong }}
            </div>
            <div v-if="!isDayOff" class="day-column__schedule">
              {{ employeeSchedule[0] }} – {{ employeeSchedule[1] }}
            </div>
            <div v-else class="day-column__schedule">
              Выходной
            </div>      
          </div>
        </div>
      </template>
      <div class="day-column__dropdown" @click="onDayEdit">
        <div>
          {{ isDayOff? 'Сделать рабочим' : 'Сделать выходным' }}
        </div>        
      </div>
    </v-menu>
    
    <div
      v-for="(time, i) in times"
      :key="i"
      :class="{ 'day-column__item': true, 'in-view': i === slotInView }"
    >
      <div class="day-column__time">
        <div
          v-if="displayTimeStamp(i)"
          class="time-mark"
        >
          {{ time.begin.display }}
        </div>
      </div>
      
      <div v-if="time.visit" class="slot">
        <VisitCard
          :now="now"
          :selected="selectVisit"
          :visit="time.visit"
          :services="time.visit.services" 
          @onDelete="onVisitDelete(time.visit.id)"
          @onEdit="onVisitEdit(time.visit)"
        />
      </div>
      <div
        v-else
        :class="['slot', { working: isWorkingTime(i) }]"
        @click="onSlotClick(time, i)"
      >
        <div class="slot__time">
          {{ time.begin.display }}
        </div>
        <div v-show="time === selectedTime" class="slot__container">
          <div class="slot__add-visit" @click="$emit('onSlotClick', time.begin.date)">
            +
          </div>
          <div class="slot__add-break">
            Break
          </div>
        </div>
      </div>
    </div>
    <div v-if="offsetTop > 0" class="day-column__now" :style="{ top: offsetTop + 'px'}" />
  </div>
</template>


<script>
import VisitCard from '@/components/calendar/VisitCard.vue'
import {
  areSameDates,
  dowDisplay,
  formatDate,
  formatTime
} from '@/components/calendar/utils'
import { mapGetters } from 'vuex'
import { setInterval, clearInterval } from 'timers'

export default {
  components: { VisitCard },
  props: {
    day: {
      type: Object,
      default () {
        return {}
      }
    },
    displayFrom: {
      type: String,
      default: ''
    },
    displayTo: {
      type: String,
      default: ''
    },
    employeeSchedule: {
      type: Array,
      default () {
        return []
      }
    },
    holiday: {
      type: Boolean,
      default: false
    },
    now: {
      type: Date,
      default () {
        return new Date()
      }
    },
    showTime: { type: Boolean, default: true },
    visits: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    const minutesOffset = this.getMinutesOffset()
    const slotDuration = 15

    return {
      headerHeight: 82, /* height of column header in pixels */
      hours: 24,
      minutes: 60,
      offsetTop: 0,
      slotDuration,
      slotHeight: 56, /* slot height in pixels */
      displayStep: 4,
      showMenu: false,
      selectVisit: false,
      timeEditBlock: false,
      selectedTime: undefined,
      slotInView: Math.floor(minutesOffset / slotDuration) + 1,
      timerId: 0,
      today: new Date(),
      dayHeaderOptions: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }
    }
  },
  computed: {
    ...mapGetters(['apiTimeZone', 'calendar']),
    dowLong () {
      return dowDisplay(this.day.date)
    },
    minuteHeight () { /* height in pixels */
      return this.slotHeight / this.slotDuration 
    },
    isDayOff () {
      if (!this.employeeSchedule || !this.employeeSchedule[0] || !this.employeeSchedule[1]) {
        return true
      }

      return this.holiday
    },
    isToday () {
      return areSameDates(this.today, this.day.date)
    },
    // lunchTime () {
    //   if (this.employeeSchedule.length > 3) {
    //     return [this.employeeSchedule[1], this.employeeSchedule[2]]
    //   }
    //   return []
    // },
    times () {
      const isVisible = time => {
        if (!(this.displayFrom || this.displayTo)) return true

        return time.begin.display <= this.displayTo && time.end.display >= this.displayFrom
      }

      let times = [...Array((this.hours * this.minutes) / this.slotDuration)].map(
        (x, i) => {
          const dateTime = this.day.date.getTime()
          const d1 = new Date(dateTime + 60000 * (i * this.slotDuration))
          const d2 = new Date(dateTime + 60000 * ((i + 1) * this.slotDuration))
          const displayTime1 = this.timeDisplay(d1)
          const displayTime2 = this.timeDisplay(d2)

          return {
            begin: {
              date: d1,
              display: displayTime1
            },
            end: {
              date: d2,
              display: displayTime2
            },
            visit: this.visits.find(v => v.time === displayTime1)
          }
        }
      )

      return times.filter(isVisible)
    },
    todayString () {
      return formatDate(this.today)
    }
  },
  created () {
    this.setTopOffset()
    this.timerId = setInterval(this.setTopOffset, 60 * 1000)
  },
  mounted () {
    if (this.offsetTop > 0) {
      const elem = document.querySelector('.in-view')
      const top = elem && (this.documentOffsetTop(elem) - (window.innerHeight / 2)) || 0

      window.scrollTo({ top, behavior: 'smooth' })
    }
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  },
  methods: {
    displayTimeStamp (i) {
      return this.showTime && !((i - 1)% this.displayStep)
    },
    getMinutesOffset () {
      const startTime = this.parseTime(this.displayFrom)
      const currentTime = Date.now()
      const offset = currentTime - startTime

      return offset / 60000 
    },
    setTopOffset () {
      if (!areSameDates(new Date(), this.day.date)) {
        this.offsetTop = -10
        return
      }

      const minutes = this.getMinutesOffset() 
      if (minutes / this.slotDuration > this.times.length) {
        this.offsetTop = 0
        return
      }
 
      /* we show one slot before the first (displayFrom) slot, for the first time mark to be visible,
        so we have to add slot's height here */
      this.offsetTop = minutes * this.minuteHeight + this.headerHeight + this.slotHeight
    },
    isWorkingTime (i) {
      if (!this.employeeSchedule) {
        return false
      }
      const dayEnd = this.employeeSchedule[this.employeeSchedule.length - 1]

      return this.isDayOff
        ? false
        : (this.employeeSchedule[0] <= this.times[i].begin.display &&
        (dayEnd === '00:00' ? '24:00' : dayEnd) >= this.times[i].end.display
        // && !(
        //   this.lunchTime.length &&
        //   (this.lunchTime[0] <= this.times[i].begin.display &&
        //     this.lunchTime[1] >= this.times[i].end.display)
        // )
      )
    },
    documentOffsetTop (elem) {
      return elem.offsetTop + (elem.offsetParent ? this.documentOffsetTop(elem.parentElement) : 0)
    },
    onClickDate (dt) {
      this.$emit('onClickDate', dt)
    },
    onSlotClick (time, i) {
      if (!this.isDayOff && (time.begin.date.getTime() > Date.now()) && this.isWorkingTime(i)) {
        this.selectedTime = time
      }
    },
    onDayEdit () {
      if (!this.isDayOff && this.visits.length) {
        this.$emit('makeDayOffTry')
        return
      }

      this.$emit('onDayEdit', { day: this.day, isDayOff: this.isDayOff })
    },
    onVisitDelete (id) {
      this.$emit('onVisitDelete', id)
    },
    onVisitEdit (item) {
      this.$emit('onVisitEdit', item)
    },
    timeDisplay (date) {
      return formatTime(date)
    },
    parseTime (timeString) {
      return Date.parse(`${this.day.dateKey}T${timeString}:00`) 
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/styles/common';
@mixin active-header {
    background-color: rgba(137, 149, 175, 0.35);
    border-radius: 4px;
    .day-column__date,
    .day-column__day {
      font-weight: bold;
    }
}
.time-mark {
  position: absolute;
  right: 100%;
  top: -1px;
  font-size: 12px;
  color: #8995AF;
  padding: 7px 8px 0 0;
  border-top: 1px solid rgba(137, 149, 175, .20);
}
.slot { 
  height: 100%; 
  border-right: 1px solid rgba(137, 149, 175, .10);
  border-bottom: 1px solid rgba(137, 149, 175, .10);
  font-size: 0.75em;

  &.working {
    background: #fff; 
  }

  &__time {
    position: absolute;
    z-index: 1;
    top: 0; left: 0;
    display: none;
    padding: 20px 14px 0;
    color: transparent;
    font-size: 12px;
  }

  &__container {
    position: relative;
    z-index: 2;
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    justify-content: space-between;
    padding: 2px 0;
    & > div {
      width: 50%;
      margin: 0 2px;
      height: 100%;
      border-radius: 4px;
      color: transparent;
      &:hover {
        background-color: rgba(137, 149, 175, 0.1);
      }
    }
  }
  &__add-visit {
    background: url('../../assets/plus.svg') center/14px no-repeat;
    cursor: pointer;
  }
  &__add-break {
    position: relative;
    background: url('../../assets/images/svg/cup.svg') center no-repeat;

    &:before {
      content: '';
      position: absolute;
      left: -2px;
      top: 0;
      height: 100%;
      width: 1px;
      background: rgba(137, 149, 175, 0.1);
    }
  }
}

.day-column {
  position: relative;
  min-width: 136px;
  @media only screen and (min-width : $desktop) {
    width: 14.28%;
    padding-top: 82px;
  }
  &.today {
    .day-column__header {
      border-left: 2px solid #5699FF;
    }
    .day-column__date,
    .day-column__day {
      color: #5699FF;
      font-weight: bold;
    }
  }
  &.selected .day-column__header {
    @media only screen and (min-width : $desktop) {
      @include active-header
    }
  }
  &.selected.today .day-column__header {
    @media only screen and (min-width : $desktop) {
      background-color: #fff;
      border-radius: 0;
    }
  }

  &__item {
    height: 56px;
    &:nth-child(odd) {
      .slot {
        border-bottom: 1px solid rgba(137, 149, 175, .20);
      }
    }
  }
  &__time {
    position: relative;
  }

  &__now {
    position: absolute;
    z-index: 4;
    right: 0;
    left: 0;
    border-top: 2px solid #EF4D37;
    pointer-events: none;
    &::before {
      position: absolute;
      top: -5px;
      left: -4px;
      width: 8px;
      height: 8px;
      background-color: #EF4D37;
      content: '';
      border-radius: 50%;
    }
  }
  &__header {
    position: absolute;
    top: 0;
    left: 0; right: 0;
    height: 82px;
    padding: 12px 24px;
    border-right: 1px solid rgba(137, 149, 175, 0.1);
    border-left: 2px solid transparent;
    background-color: #fff;
    border-bottom: 1px solid rgba(137, 149, 175, 0.2);
    cursor: pointer;
    &.active {
      @media only screen and (min-width : $desktop) {
        @include active-header;
        background-color: rgba(137, 149, 175, 0.2);
      }
    }
  }
  &__dropdown {
    padding: 20px 0;
    font-size: 13px;
    color: #2D333B;
    background-color: #fff;
    box-shadow: 0px 2px 8px rgba(137, 149, 175, 0.1);
    cursor: pointer;
    &>div {
      text-align: center;
    }
  }
  &__date {
    font-size: 18px;
    font-family: Roboto Slab;
  }
  &__day {
    text-transform: capitalize;
  }
  &__schedule {
    margin-top: 4px;
    font-size: 12px;
    color: #8995AF;
  }
  .day-off {
    color: #8995AF;
  }
  
}
</style>
