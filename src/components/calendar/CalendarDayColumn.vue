<template>
  <v-flex xs3>
    <div class="header">
      {{ day.display }}
    </div>
    <div
      v-for="(time, i) in times"
      :key="i"
    >
      <div class="item">
        <div
          v-if="displayTime(i)"
          class="item-caption"
        >
          {{ time.display }}
        </div>
        <div
          v-for="(visit, iv) in visitsInTime(i)"
          :key="`visit-${iv}`"
          class="visit"
          :style="`height: ${calcVisitHeight(visits[0])}`"
        >
          <CalendarVisit
            color="blue"
            :time-start="formatTime(visit.ts_begin)"
            :time-end="formatTime(visit.ts_end)"
            :during="visit.during"
            :name="visit.client && visit.client.name"
            :phone="visit.client && visit.client.phone"
            :service="visit.client && visit.client.service"
          />
        </div>
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
      during: 10,
      displayStep: 2
    };
  },
  computed: {
    times() {
      let times = [...Array((this.hours * this.minutes) / this.during)].map(
        (x, i) => {
          const d = new Date(
            this.day.date.getTime() + 60000 * (i * this.during)
          );
          return {
            date: d,
            display: this.timeDisplay(d)
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
      let h = `${(visit.during / this.during) * 3}em`;
      return h;
    },
    displayTime(i) {
      return this.showTime && !(i % this.displayStep);
    },
    displayVisit(visit, i) {
      return (
        getRESTTime(visit.ts_begin) >= this.times[i].display &&
        getRESTTime(visit.ts_begin) < this.times[i + 1].display
      );
    },
    formatTime(ts) {
      return getRESTTime(ts);
    },
    onClickDate(dt) {
      this.$emit('onClickDate', dt);
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
}
.item {
  height: 3em;
  border: 1px solid #ddd;
  border-top: 0;
  border-left: 0;
  background: #f5f5f5;
}
.item:hover .item-caption {
  color: #555;
}
.header {
  border: 1px solid #ddd;
  border-top: 0;
  border-left: 0;
}
.visit {
  position: relative;
  display: block;
  overflow: scroll;
}
</style>
