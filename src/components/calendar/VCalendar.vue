<template>
  <VLayout>
    <VFlex>
      <VContainer>
        <VLayout
          v-if="period==='month'"
          align-space-between
          justify-space-between
          fill-height
          column
        >
          <VFlex
            v-for="(week,i) in dates"
            :key="i"
          >
            <VLayout
              justify-center
              row
              fill-height
            >
              <VFlex
                v-for="(day, di) in week"
                :key="di"
                xs2
              >
                <CalendarDayBtn
                  v-if="kind === 'mini'"
                  :counter="day.visits && day.visits.length"
                  :day="day"
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
          fill-height
          row
          pl-3
        >
          <CalendarDayColumn
            v-for="(day,i) in dates[0]"
            :key="i"
            :show-time="!i"
            :day="day"
            :visits="day.visits"
            :schedule="schedule[i]"
            :display-from="workTime[0]"
            :display-to="workTime[1]"
            @onClickDate="goDate($event)"
          />
        </VLayout>
      </VContainer>
    </VFlex>
  </VLayout>
</template>

<script>
import CalendarDayBtn from '@/components/calendar/CalendarDayBtn.vue';
import CalendarDayCard from '@/components/calendar/CalendarDayCard.vue';
import CalendarDayColumn from '@/components/calendar/CalendarDayColumn.vue';
import { formatDate, monthDates } from '@/components/calendar/utils';
import { mapActions, mapGetters } from 'vuex';
import Api from '@/api/backend';
import router from '@/router';

export default {
  components: { CalendarDayBtn, CalendarDayCard, CalendarDayColumn },
  props: {
    kind: { type: String, default: 'mini' },
    period: { type: String, default: 'month' }
  },
  data() {
    return {
      visits: [],
      dates: [[]],
      businessInfo: {}
    };
  },
  computed: {
    ...mapGetters(['actualDate']),
    business() {
      return this.$route.params.id;
    },
    schedule() {
      if (!(this.businessInfo && this.businessInfo.j)) {
        return Array(7);
      }
      return this.businessInfo.j.schedule;
    },
    workTime() {
      return this.schedule.reduce(
        (res, cur) => {
          if (cur[0] && (res[0] || cur[0]) >= cur[0]) {
            res[0] = cur[0];
          }
          if (res[1] < cur[1]) {
            res[1] = cur[1];
          }
          return res;
        },
        ['', '']
      );
    },
    workDate() {
      let now = new Date();
      return this.$route.params.date || formatDate(now);
    },
    workMonth() {
      return +this.workDate.slice(5, 7) - 1;
    },
    workYear() {
      return +this.workDate.slice(0, 4);
    }
  },
  watch: {
    workDate: 'fetchData'
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(['setActualDate']),
    fetchData() {
      Api()
        .get(`visit?salon_id=eq.${this.business}`)
        .then(res => res.data)
        .then(res => {
          this.visits = res;
          this.setDateVisits();
        });
      Api()
        .get(`business?id=eq.${this.business}`)
        .then(res => res.data)
        .then(res => {
          this.businessInfo = res[0];
        });
    },
    goDate(dt) {
      this.setActualDate(dt);
      router.push({
        name: 'businessVisit',
        params: { id: this.business, date: dt }
      });
    },
    setDates() {
      this.dates = monthDates(this.workYear, this.workMonth);
      if (this.period === 'week') {
        this.dates = this.dates.filter(w =>
          w.some(d => d.dateKey === this.workDate)
        );
      }
    },
    setDateVisits() {
      this.setDates();
      this.dates = this.dates.map(w => {
        w = w.map(x => {
          x.visits = this.dayVisits(x.dateKey);
          return x;
        });
        return w;
      });
    },
    dayVisits(dt) {
      if (!this.visits.length) {
        return [];
      }
      return this.visits
        .filter(v => v.ts_begin.slice(0, 10) === dt)
        .sort((a, b) => (a.ts_begin < b.ts_begin ? -1 : 1))
        .map(x => {
          let ts1 = new Date(x.ts_begin);
          let ts2 = new Date(x.ts_end);
          x.during = (ts2.getTime() - ts1.getTime()) / 60000;
          return x;
        });
    }
  }
};
</script>


