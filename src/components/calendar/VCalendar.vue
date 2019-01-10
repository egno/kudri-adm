<template>
  <VLayout>
    <VFlex>
      <VContainer>
        <VLayout
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
      </VContainer>
    </VFlex>
  </VLayout>
</template>

<script>
import CalendarDayBtn from '@/components/calendar/CalendarDayBtn.vue';
import CalendarDayCard from '@/components/calendar/CalendarDayCard.vue';
import { formatDate, periodDates } from '@/components/calendar/utils';
import { mapActions, mapGetters } from 'vuex';
import Api from '@/api/backend';
import router from '@/router';

export default {
  components: { CalendarDayBtn, CalendarDayCard },
  props: {
    kind: { type: String, default: 'mini' },
    period: { type: String, default: 'month' }
  },
  data() {
    return {
      visits: [],
      dates: [[]]
    };
  },
  computed: {
    ...mapGetters(['actualDate']),
    business() {
      return this.$route.params.id;
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
    },
    goDate(dt) {
      this.setActualDate(dt);
      router.push({
        name: 'businessVisit',
        params: { id: this.business, date: dt }
      });
    },
    setDates() {
      this.dates = periodDates(this.workYear, this.workMonth);
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
        .sort((a, b) => (a.ts_begin < b.ts_begin ? -1 : 1));
    }
  }
};
</script>


