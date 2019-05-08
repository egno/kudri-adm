<template>
  <v-flex
    pt-1
    xs3
    :class="[{'day-off': isDayOff}]"
  >
    <div
      class="header"
      @click="onDayEdit"
    >
      <v-layout
        align-start
        column
        pa-1
      >
        <v-flex>
          <v-layout column>
            <v-flex
              title
              pl-1
            >
              {{ day.display }}
            </v-flex>
            <v-flex body-2>
              {{ dow }}
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
    <div
      v-for="(time, i) in times"
      :key="i"
    >
      <div
        v-if="displayTimeBlock(i)"
        class="item"
      >
        <div
          v-if="displayTimeStamp(i)"
          class="time-mark"
        >
          <div>{{ time.begin.display }}</div>
        </div>
        <div v-if="time.visit">
          <VisitCard
            :selected="selectVisit"
            :visit="time.visit"
            :services="time.visit.client && time.visit.client.services"
            @onDelete="onVisitDelete(time.visit.id)"
            @onEdit="onVisitEdit(time.visit)"
          />
        </div>
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
    </div>
  </v-flex>
</template>


<script>
import VisitCard from '@/components/calendar/VisitCard.vue'
import {
  dowDisplay,
  formatTime,
  getRESTTime
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
    holiday: { type: Boolean },
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
      displayStep: 2,
      rowHeightInEm: 3,
      selectVisit: false,
      timeEditBlock: false,
      selectedTime: undefined
    }
  },
  computed: {
    ...mapGetters(['apiTimeZone', 'calendar']),
    isDayOff () {
      return this.holiday
    },
    displaySchedule () {
      if (!this.schedule || !this.schedule[0]) {
        return 'выходной'
      }
      if (this.schedule[0] === '00:00' && this.schedule[1] === '00:00') {
        return 'круглосуточно'
      }
      if (this.schedule.length === 2) {
        return `${this.schedule[0]}-${this.schedule[1]}`
      }
      if (this.schedule.length === 4) {
        return `${this.schedule[0]}-${this.schedule[3]} (${this.schedule[1]}-${
          this.schedule[2]
        })`
      }
      return '-'
    },
    dow () {
      return dowDisplay(this.day.date, 1)
    },
    lunchTime () {
      if (this.schedule.length > 3) {
        return [this.schedule[1], this.schedule[2]]
      }
      return []
    },
    times () {
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
      return times
    }
  },
  methods: {
    calcVisitHeight (visit) {
      if (!visit) {
        return
      }
      let h = (visit.client.duration / this.duration) * this.rowHeightInEm
      return `${h}em`
    },
    calcVisitOffset (visit) {
      if (!visit) {
        return
      }
      const start = new Date(visit.ts_begin)
      let h =
        (((this.minutes * start.getHours() + start.getMinutes()) %
          this.duration) /
          this.duration) *
        this.rowHeightInEm
      return `${h}em`
    },
    displayTimeBlock (i) {
      if (!(this.displayFrom || this.displayTo)) {
        return true
      }
      return (
        this.displayFrom <= this.times[i].end.display &&
        this.displayTo >= this.times[i].begin.display
      )
    },
    displayTimeStamp (i) {
      return this.showTime && !(i % this.displayStep)
    },
    formatTime (ts) {
      return getRESTTime(ts)
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
      this.selectedTime = time
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
.header {
  border: 1px solid #ccc;
  border-top: 0;
  border-left: 0;
  height: 4.5em;
}
.item {
  position: relative;
  height: 56px;
}
.time-mark {
  position: absolute;
  right: 100%;
  top: 0;
  font-size: 12px;
  color: #8995AF;
  margin-right: 8px;
}
.slot {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 1px solid rgba(137, 149, 175, .20);
  font-size: 0.75em;
  border-top: 0;
  border-left: 0;
  background: #fff;

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
</style>
