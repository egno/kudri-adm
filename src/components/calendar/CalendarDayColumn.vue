<template>
  <div
    :class="['day-column', { today: isToday }]"
  >
    <div
      column
      class="day-column__header"
      @click="onDayEdit"
    >
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
    <div
      v-for="(time, i) in times"
      :key="i"
      class="item"
    >
      <div
        v-if="displayTimeStamp(i)"
        class="time-mark"
      >
        <div>{{ time.begin.display }}</div>
      </div>
      <template v-if="time.visit">
        <VisitCard
          :selected="selectVisit"
          :visit="time.visit"
          :services="time.visit.services" 
          @onDelete="onVisitDelete(time.visit.id)"
          @onEdit="onVisitEdit(time.visit)"
        />
      </template>
      <div
        v-else
        :class="['slot', { working: isWorkingTime(i) }]"
        @click="onSlotClick(time)"
      >
        <div class="slot__time">
          {{ time.begin.display }}
        </div>
        <div v-show="time === selectedTime" class="slot__wrapper">
          <div @click="$emit('onSlotClick', time.begin.date)">
            +
          </div>
          <div>Cup</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import VisitCard from '@/components/calendar/VisitCard.vue'
import {
  areSameDates,
  dowDisplay,
  formatTime
} from '@/components/calendar/utils'
import { mapGetters } from 'vuex'

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
    showTime: { type: Boolean, default: true },
    visits: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      hours: 24,
      minutes: 60,
      duration: 15,
      displayStep: 4,
      rowHeightInEm: 3,
      selectVisit: false,
      timeEditBlock: false,
      selectedTime: undefined,
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
    isDayOff () {
      if (!this.employeeSchedule || !this.employeeSchedule[0] || !this.employeeSchedule[1]) {
        return true
      }

      // todo add getting irregular/extra holidays (POST /business_calendar)
      return false
    },
    isToday () {
      return areSameDates(this.today, this.day.date)
    },
    lunchTime () {
      if (this.employeeSchedule.length > 3) {
        return [this.employeeSchedule[1], this.employeeSchedule[2]]
      }
      return []
    },
    times () {
      const isVisible = time => {
        if (!(this.displayFrom || this.displayTo)) return true

        return time.begin.display <= this.displayTo && time.end.display >= this.displayFrom
      }

      let times = [...Array((this.hours * this.minutes) / this.duration)].map(
        (x, i) => {
          const dateTime = this.day.date.getTime()
          const d1 = new Date(dateTime + 60000 * (i * this.duration))
          const d2 = new Date(dateTime + 60000 * ((i + 1) * this.duration))
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
    }
  },
  methods: {
    displayTimeStamp (i) {
      return this.showTime && !((i - 1)% this.displayStep)
    },
    isWorkingTime (i) {
      if (!this.employeeSchedule) {
        return false
      }
      return (
        this.employeeSchedule[0] <= this.times[i].begin.display &&
        (this.employeeSchedule[this.employeeSchedule.length - 1] === '00:00'
          ? '24:00'
          : this.employeeSchedule[this.employeeSchedule.length - 1]) >=
          this.times[i].end.display &&
        !(
          this.lunchTime.length &&
          (this.lunchTime[0] <= this.times[i].begin.display &&
            this.lunchTime[1] >= this.times[i].end.display)
        )
      )
    },
    onClickDate (dt) {
      this.$emit('onClickDate', dt)
    },
    onSlotClick (time) {
      if (!this.isDayOff && (time.begin.date.getTime() > Date.now())) {
        this.selectedTime = time
      }
    },
    onDayEdit () {
      this.$emit('onDayEdit', this.day)
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
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/common';

.item {
  position: relative;
  height: 56px;
  &:nth-child(even) {
    .slot {
      border-bottom: 1px solid rgba(137, 149, 175, .20);
    }
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
  position: absolute;
  height: 100%;
  width: 100%;
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

  &__wrapper {
    position: relative;
    z-index: 2;
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    & > div {
      width: 50%;
      height: 100%;
    }
  }

  &:hover &__time {
    display: block;
    color: rgba(137, 149, 175, .35)
  }
}
.time-edit {
  display: block;
  position: absolute;
  z-index: 2;
}
.working {
  background: #fefefe;
}
.day-off .working {
  background: #fffefe;
}
.day-off .header {
  color: rgb(192, 0, 0);
}
.day-column {
  position: relative;
  min-width: 136px;
  @media only screen and (min-width : $desktop) {
    padding-top: 82px;
  }

  &__header {
    position: absolute;
    top: 0;
    left: 0; right: 0;
    height: 82px;
    padding: 12px 24px;
    border-right: 1px solid rgba(137, 149, 175, 0.1);
    background-color: #fff;
    box-shadow: 8px 2px 8px rgba(137, 149, 175, 0.1);
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
  &.today {
    .day-column__date,
    .day-column__day {
      color: #5699FF;
      font-weight: bold;
    }
  }
}
</style>
