<template>
  <v-flex
    :class="['day-column', { today: isToday }]"
  >
    <v-layout
      column
      class="day-column__header"
      @click="onDayEdit"
    >
      <div class="day-column__date">
        {{ day.display }}
      </div>
      <div :class="['day-column__day', { 'day-off': !schedule || !schedule[0] || !schedule[1] }]">
        {{ dowLong }}
      </div>
      <div v-if="schedule && schedule[0] && schedule[1]" class="day-column__schedule">
        {{ schedule[0] }} – {{ schedule[1] }}
      </div>
      <div v-else class="day-column__schedule">
        Выходной
      </div>
    </v-layout>
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
        :class="['slot', {working: isWorkingTime(i)}]"
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
  </v-flex>
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
    schedule: {
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
    isToday () {
      return areSameDates(this.today, this.day.date)
    },
    lunchTime () {
      if (this.schedule.length > 3) {
        return [this.schedule[1], this.schedule[2]]
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
      if (!this.schedule) {
        return false
      }
      return (
        this.schedule[0] <= this.times[i].begin.display &&
        (this.schedule[this.schedule.length - 1] === '00:00'
          ? '24:00'
          : this.schedule[this.schedule.length - 1]) >=
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
      if (time.begin.date.getTime() > Date.now() ) {
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
  flex: 1 0 14.28%;

  &__header {
    height: 82px;
    padding: 10px 24px;
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
    margin-top: 3px;
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
