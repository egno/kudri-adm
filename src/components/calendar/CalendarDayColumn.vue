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
          <v-layout row>
            <v-flex body-2>
              {{ dow }}
            </v-flex>
            <v-flex
              title
              pl-1
            >
              {{ day.display }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex caption>
          <v-layout column>
            <v-flex>{{ displaySchedule }}</v-flex>
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
          class="item-caption"
        >
          <div>{{ time.begin.display }}</div>
        </div>
        <div
          :class="['time-block', {working: isWorkingTime(i)}]"
          @click="onTimeBlockClick(time)"
        >
          <div>{{ dow }}, {{ day.display }}</div>
          <div>{{ time.begin.display }}</div>
        </div>
        <CalendarVisit
          v-for="(visit, iv) in visitsInTime(i)"
          :id="visit.id"
          :key="`visit-${iv}`"
          :container-height="calcVisitHeight(visit)"
          :container-offset="calcVisitOffset(visit)"
          :selected="selectVisit"
          :time-start="formatTime(visit.ts_begin)"
          :time-end="formatTime(visit.ts_end)"
          :duration="+visit.client.service.duration"
          :name="visit.client && visit.client.name"
          :phone="visit.client && visit.client.phone"
          :service="visit.client && visit.client.service"
          @onDelete="onVisitDelete(visit.id)"
          @onEdit="onVisitEdit(visit)"
        />
      </div>
    </div>
  </v-flex>
</template>


<script>
import CalendarVisit from '@/components/calendar/CalendarVisit.vue';
import {
  dowDisplay,
  formatTime,
  getRESTTime
} from '@/components/calendar/utils';
import { mapGetters } from 'vuex';

export default {
  components: { CalendarVisit },
  props: {
    day: {
      type: Object,
      default() {
        return {};
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
      default() {
        return [];
      }
    },
    showTime: { type: Boolean, default: true },
    visits: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      hours: 24,
      minutes: 60,
      duration: 30,
      displayStep: 2,
      rowHeightInEm: 3,
      selectVisit: false,
      timeEditBlock: false
    };
  },
  computed: {
    ...mapGetters(['apiTimeZone', 'calendar']),
    isDayOff() {
      return this.holiday;
    },
    displaySchedule() {
      if (!this.schedule || !this.schedule[0]) {
        return 'выходной';
      }
      if (this.schedule[0] === '00:00' && this.schedule[1] === '00:00') {
        return 'круглосуточно';
      }
      if (this.schedule.length === 2) {
        return `${this.schedule[0]}-${this.schedule[1]}`;
      }
      if (this.schedule.length === 4) {
        return `${this.schedule[0]}-${this.schedule[3]} (${this.schedule[1]}-${
          this.schedule[2]
        })`;
      }
      return '-';
    },
    dow() {
      return dowDisplay(this.day.date, 1);
    },
    lunchTime() {
      if (this.schedule.length > 3) {
        return [this.schedule[1], this.schedule[2]];
      }
      return [];
    },
    times() {
      let times = [...Array((this.hours * this.minutes) / this.duration)].map(
        (x, i) => {
          const d1 = new Date(
            this.day.date.getTime() + 60000 * (i * this.duration)
          );
          const d2 = new Date(
            this.day.date.getTime() + 60000 * ((i + 1) * this.duration)
          );
          return {
            begin: {
              date: d1,
              display: this.timeDisplay(d1)
            },
            end: {
              date: d2,
              display: this.timeDisplay(d2)
            }
          };
        }
      );
      return times;
    }
  },
  methods: {
    calcVisitHeight(visit) {
      if (!visit) {
        return;
      }
      let h =
        (visit.client.service.duration / this.duration) * this.rowHeightInEm;
      return `${h}em`;
    },
    calcVisitOffset(visit) {
      if (!visit) {
        return;
      }
      const start = new Date(visit.ts_begin);
      let h =
        (((this.minutes * start.getHours() + start.getMinutes()) %
          this.duration) /
          this.duration) *
        this.rowHeightInEm;
      return `${h}em`;
    },
    displayTimeBlock(i) {
      if (!(this.displayFrom || this.displayTo)) {
        return true;
      }
      return (
        this.displayFrom <= this.times[i].end.display &&
        this.displayTo >= this.times[i].begin.display
      );
    },
    displayTimeStamp(i) {
      return this.showTime && !(i % this.displayStep);
    },
    displayVisit(visit, i) {
      return (
        getRESTTime(visit.ts_begin) >= this.times[i].begin.display &&
        getRESTTime(visit.ts_begin) < this.times[i].end.display
      );
    },
    formatTime(ts) {
      return getRESTTime(ts);
    },
    isWorkingTime(i) {
      if (!this.schedule) {
        return false;
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
      );
    },
    onClickDate(dt) {
      this.$emit('onClickDate', dt);
    },
    onTimeBlockClick(time) {
      this.$emit('onTimeBlockClick', time.begin.date);
    },
    onDayEdit() {
      this.$emit('onDayEdit', this.day);
    },
    onVisitDelete(id) {
      this.$emit('onVisitDelete', id);
    },
    onVisitEdit(item) {
      this.$emit('onVisitEdit', item);
    },
    onWorkTimeEdit() {},
    timeDisplay(date) {
      return formatTime(date);
    },
    visitsInTime(i) {
      return this.visits.filter(x => this.displayVisit(x, i));
    }
  }
};
</script>

<style scoped>
.item-caption {
  font-size: 0.7em;
  color: #bbb;
  margin-left: -3em;
  margin-top: -1.5em;
  width: 3em;
  position: absolute;
  border-bottom: 1px solid #ccc;
}
.item {
  height: 3em;
  position: relative;
}
.item:hover .item-caption {
  color: #555;
}
.header {
  border: 1px solid #ccc;
  border-top: 0;
  border-left: 0;
  height: 4.5em;
}
.time-block {
  font-size: 0.75em;
  height: 100%;
  width: 100%;
  border: 1px solid #ccc;
  border-top: 0;
  border-left: 0;
  background: #d6d6d6;
  position: absolute;
  padding: 0.5em;
  color: rgba(100, 100, 100, 0);
  transition: all 0.5s ease;
}
.time-block:hover {
  box-shadow: inset 0 0 1em 0 rgba(0, 0, 0, 0.1);
  color: rgba(100, 100, 100, 0.5);
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
