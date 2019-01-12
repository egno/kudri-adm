<template>
  <v-flex xs3>
    <div class="header">
      {{ day.display }}
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
          {{ time.begin.display }}
        </div>
        <div
          :class="['time-block', {working: isWorkingTime(i)}]"
          @click="onTimeBlockClick(time)"
        />
        <CalendarVisit
          v-for="(visit, iv) in visitsInTime(i)"
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
import { formatTime, getRESTTime } from '@/components/calendar/utils';

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
      selectVisit: false
    };
  },
  computed: {
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
      if (!(this.schedule && this.schedule.length === 2)) {
        return false;
      }
      return (
        this.schedule[0] <= this.times[i].begin.display &&
        this.schedule[1] >= this.times[i].end.display
      );
    },
    onClickDate(dt) {
      this.$emit('onClickDate', dt);
    },
    onTimeBlockClick(time) {
      this.$emit('onTimeBlockClick', time.begin.date);
    },
    onVisitDelete(id) {
      this.$emit('onVisitDelete', id);
    },
    onVisitEdit(item) {
      this.$emit('onVisitEdit', item);
    },
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
  border-bottom: 1px solid #eee;
}
.item {
  height: 3em;
}
.item:hover .item-caption {
  color: #555;
}
.header {
  border: 1px solid #ddd;
  border-top: 0;
  border-left: 0;
}
.time-block {
  height: 100%;
  width: 100%;
  border: 1px solid #eee;
  border-top: 0;
  border-left: 0;
  background: #f7f7f7;
  position: relative;
}
.working {
  background: #fefefe;
}
</style>
