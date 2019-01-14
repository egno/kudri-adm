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
            :display-from="showTimes[0]"
            :display-to="showTimes[1]"
            @onClickDate="goDate($event)"
            @onTimeBlockClick="onTimeBlockClick($event)"
            @onVisitEdit="onVisitEdit($event)"
            @onVisitDelete="onVisitDelete($event)"
          />
        </VLayout>
      </VContainer>
    </VFlex>
    <VDialog
      v-if="kind !== 'mini'"
      v-model="edit"
      max-width="50em"
    >
      <VisitEdit
        :id="currentVisit.id"
        :business-info="businessInfo"
        :item="currentVisit"
        @onSave="onNewVisitSave(-1, $event)"
        @onDelete="onDelete(-1)"
      />
    </VDialog>
  </VLayout>
</template>

<script>
import CalendarDayBtn from '@/components/calendar/CalendarDayBtn.vue';
import CalendarDayCard from '@/components/calendar/CalendarDayCard.vue';
import CalendarDayColumn from '@/components/calendar/CalendarDayColumn.vue';
import VisitEdit from '@/components/calendar/VisitEdit.vue';
import {
  formatDate,
  getRESTTime,
  monthDates
} from '@/components/calendar/utils';
import { visitInit } from '@/components/calendar/utils';
import { mapActions, mapGetters } from 'vuex';
import Api from '@/api/backend';
import router from '@/router';

export default {
  components: { CalendarDayBtn, CalendarDayCard, CalendarDayColumn, VisitEdit },
  props: {
    businessInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    newVisit: { type: Boolean, default: false },
    kind: { type: String, default: 'mini' },
    period: { type: String, default: 'month' }
  },
  data() {
    return {
      currentVisit: visitInit(),
      dates: [[]],
      days: [],
      edit: false,
      visits: []
    };
  },
  computed: {
    ...mapGetters(['actualDate', 'calendar']),
    business() {
      return this.businessInfo.id || this.$route.params.id;
    },
    schedule() {
      if (!(this.businessInfo && this.businessInfo.j)) {
        return Array(7);
      }
      return this.businessInfo.j.schedule;
    },
    showTimes() {
      if (!this.schedule) {
        return ['', ''];
      }
      const workTimes = this.schedule.reduce(
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
      if (!this.visits) {
        return workTimes;
      }
      const visitTimes = this.visits
        .map(x => {
          return [getRESTTime(x.ts_begin), getRESTTime(x.ts_end)];
        })
        .reduce(
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
      return [
        workTimes[0] > visitTimes[0] ? visitTimes[0] : workTimes[0],
        workTimes[1] < visitTimes[1] ? visitTimes[1] : workTimes[1]
      ];
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
    workDate: 'fetchData',
    newVisit: 'onNewVisit',
    edit: 'onCloseEdit'
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(['loadCalendar', 'setActualDate']),
    fetchData() {
      if (!this.calendar.length) {
        this.loadCalendar(['2019-01-01', '2019-02-01']);
      }
      Api()
        .get(`visit?salon_id=eq.${this.business}`)
        .then(res => res.data)
        .then(res => {
          this.visits = res;
          this.setDateVisits();
        });
    },
    deleteVisit(id) {
      Api()
        .delete(`visit?id=eq.${id}`)
        .then(() => {
          this.fetchData();
        });
    },
    goDate(dt) {
      this.setActualDate(dt);
      router.push({
        name: 'businessVisit',
        params: { id: this.business, date: dt }
      });
    },
    onCloseEdit() {
      if (!this.edit) {
        this.$emit('closeEdit');
        this.currentVisit = visitInit();
      }
    },
    onDelete() {
      this.edit = false;
      this.sendData();
    },
    onNewVisit() {
      if (this.newVisit) {
        this.currentVisit = visitInit();
        this.edit = true;
      }
    },
    onNewVisitSave(i, payload) {
      this.sendData(payload);
      this.edit = false;
    },
    onTimeBlockClick(date) {
      this.currentVisit = visitInit();
      this.currentVisit.ts_begin = date.toISOString();
      this.edit = true;
    },
    onVisitDelete(item) {
      this.deleteVisit(item);
    },
    onVisitEdit(item) {
      this.currentVisit = item;
      this.edit = true;
    },
    sendData(data) {
      if (data.id) {
        Api()
          .patch(`visit?id=eq.${data.id}`, data)
          .then(() => this.fetchData());
      } else {
        Api()
          .post('visit', data)
          .then(() => this.fetchData());
      }
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
          x.client.service.duration = (ts2.getTime() - ts1.getTime()) / 60000;
          return x;
        });
    }
  }
};
</script>


