<template>
  <VLayout column>
    <VFlex
      v-if="showHeader"
      px-2
      class="month-header"
    >
      <VLayout
        align-center
        justify-center
        row
        fill-height
      >
        <div
          class="cal-head display-3"
        >
          {{ dateMonthHeader }}
        </div>
        <div>
          <v-btn
            class="cal-next-prev"
            depressed
            flat
            small
            color="#ffffff"
            @click="addMonth(-1)"
          >
            <v-icon>
              navigate_before
            </v-icon>
          </v-btn>
        </div>
        <div>
          <v-btn
            class="cal-next-prev"
            color="#ffffff"
            depressed
            flat
            small
            @click="addMonth(1)"
          >
            <v-icon>
              navigate_next
            </v-icon>
          </v-btn>
        </div>
      </VLayout>
    </VFlex>
    <VFlex>
      <VContainer py-1>
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
                  :holiday="isHoliday(day.dateKey)"
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
            :holiday="isHoliday(day.dateKey)"
            :visits="dayVisits(day.dateKey, employee[0])"
            :schedule="getDateSchedule(day.dateKey)"
            :display-from="showTimes[0]"
            :display-to="showTimes[1]"
            @onClickDate="goDate($event)"
            @onTimeBlockClick="onTimeBlockClick($event)"
            @onVisitEdit="onVisitEdit($event)"
            @onVisitDelete="onVisitDelete($event)"
            @onDayEdit="onDayEdit($event)"
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
        :employee="currentEmployee"
        :item="currentVisit"
        :page="editVisitPage"
        @onSave="onVisitSave(-1, $event)"
        @onDelete="onDelete(-1)"
      />
    </VDialog>
    <VDialog
      v-if="kind !== 'mini'"
      v-model="timeEdit"
      max-width="50em"
    >
      <DayScheduleEdit
        :day="currentDay.date"
        :schedule="getDateSchedule(currentDay.dateKey)"
        @onEdit="onDayScheduleEdit"
      />
    </VDialog>
  </VLayout>
</template>

<script>
import CalendarDayBtn from '@/components/calendar/CalendarDayBtn.vue';
import CalendarDayCard from '@/components/calendar/CalendarDayCard.vue';
import CalendarDayColumn from '@/components/calendar/CalendarDayColumn.vue';
import VisitEdit from '@/components/calendar/VisitEdit.vue';
import DayScheduleEdit from '@/components/calendar/DayScheduleEdit.vue';
import {
  formatDate,
  getRESTTime,
  monthDates,
  monthDisplay
} from '@/components/calendar/utils';
import { visitInit } from '@/components/calendar/utils';
import { mapActions, mapGetters } from 'vuex';
import Api from '@/api/backend';
import router from '@/router';
import { makeAlert } from '@/api/utils';

export default {
  components: {
    CalendarDayBtn,
    CalendarDayCard,
    CalendarDayColumn,
    DayScheduleEdit,
    VisitEdit
  },
  props: {
    businessInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    employee: {
      type: Array,
      default() {
        return [];
      }
    },
    newVisit: { type: Boolean, default: false },
    kind: { type: String, default: 'mini' },
    period: { type: String, default: 'month' },
    showHeader: { type: Boolean, default: true }
  },
  data() {
    return {
      currentDay: {"dt":"2019-02-01","j":{"holiday": false}},
      currentVisit: visitInit(),
      dates: [{"dt":"2019-02-01","j":{"holiday": false}},
          {"dt":"2019-02-02","j":{"holiday": true}},
          {"dt":"2019-02-03","j":{"holiday": true}},
          {"dt":"2019-02-04","j":{"holiday": false}},
          {"dt":"2019-02-05","j":{"holiday": false}},
          {"dt":"2019-02-06","j":{"holiday": false}},
          {"dt":"2019-02-07","j":{"holiday": false}},
          {"dt":"2019-02-08","j":{"holiday": false}},
          {"dt":"2019-02-09","j":{"holiday": true}},
          {"dt":"2019-02-10","j":{"holiday": true}},
          {"dt":"2019-02-11","j":{"holiday": false}},
          {"dt":"2019-02-12","j":{"holiday": false}},
          {"dt":"2019-02-13","j":{"holiday": false}},
          {"dt":"2019-02-14","j":{"holiday": false}},
          {"dt":"2019-02-15","j":{"holiday": false}},
          {"dt":"2019-02-16","j":{"holiday": true}},
          {"dt":"2019-02-17","j":{"holiday": true}},
          {"dt":"2019-02-18","j":{"holiday": false}},
          {"dt":"2019-02-19","j":{"holiday": false}},
          {"dt":"2019-02-20","j":{"holiday": false}},
          {"dt":"2019-02-21","j":{"holiday": false}},
          {"dt":"2019-02-22","j":{"holiday": false}},
          {"dt":"2019-02-23","j":{"holiday": true}},
          {"dt":"2019-02-24","j":{"holiday": true}},
          {"dt":"2019-02-25","j":{"holiday": false}},
          {"dt":"2019-02-26","j":{"holiday": false}},
          {"dt":"2019-02-27","j":{"holiday": false}},
          {"dt":"2019-02-28","j":{"holiday": false}},
          {"dt":"2019-03-01","j":{"holiday": false}}],
      days: [],
      edit: false,
      editVisitPage: undefined,
      timeEdit: false,
      visits: []
    };
  },
  computed: {
    ...mapGetters(['actualDate', 'calendar', 'schedule']),
    business() {
      return this.businessInfo.id || this.$route.params.id;
    },
    dateMonthHeader() {
      const d = new Date(this.workDate);
      return monthDisplay(d);
    },
    currentEmployee() {
      return this.employee[0] || this.business;
    },
    curSchedule() {
      if (!(this.schedule && this.minDate && this.maxDate)) {
        return Array(7);
      }
      return this.schedule.filter(
        d => d.dt >= this.minDate.dateKey && d.dt <= this.maxDate.dateKey
      );
    },
    maxDate() {
      if (!this.dates) return;
      return this.dates[this.dates.length - 1][6];
    },
    minDate() {
      if (!this.dates) return;
      return this.dates[0][0];
    },
    showTimes() {
      if (!this.curSchedule) {
        return ['', ''];
      }
      const workTimes = this.curSchedule
        .map(d => d.j.schedule || ['', ''])
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
        workTimes[0] > (visitTimes[0] || workTimes[0])
          ? visitTimes[0]
          : workTimes[0],
        (workTimes[1] || visitTimes[1]) < visitTimes[1]
          ? visitTimes[1]
          : workTimes[1]
      ];
    },
    workDate() {
      return this.$route.params.date || this.actualDate;
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
    this.setDates(); //это для мока
  },
  methods: {
    ...mapActions(['alert', 'loadCalendar', 'setActualDate']),
    addMonth(i) {
      let dt = new Date(this.actualDate);
      dt.setMonth(dt.getMonth() + i);
      this.goDate(formatDate(dt));
    },
    getDateSchedule(dt) {
      if (!this.curSchedule) return;
      const d = this.curSchedule.filter(d => d.dt === dt)[0];
      return d && d.j && d.j.schedule;
    },
    fetchData() {
      if (this.workDate) {
        this.setActualDate(this.workDate);
      }
      const path = `visit?salon_id=eq.${this.business}`;
      Api()
        .get(path)
        .then(res => res.data)
        .then(res => {
          this.visits = res;
          this.setDateVisits();
        });
    },
    dayVisits(dt, employee) {
      if (!this.visits.length) {
        return [];
      }
      return this.visits
        .filter(
          v =>
            v.ts_begin.slice(0, 10) === dt &&
            (employee
              ? v.business_id === employee
              : v.business_id === this.business)
        )
        .sort((a, b) => (a.ts_begin < b.ts_begin ? -1 : 1))
        .map(x => {
          let ts1 = new Date(x.ts_begin);
          let ts2 = new Date(x.ts_end);
          if (!x.client) {
            x.client = { service: {} };
          }
          x.client.service.duration = (ts2.getTime() - ts1.getTime()) / 60000;
          return x;
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
    isHoliday(dt) {
      if (!(this.calendar && this.calendar.filter(d => d.dt === dt).length))
        return;
      return this.calendar.filter(d => d.dt === dt)[0].j.holiday;
    },
    onCloseEdit() {
      if (!this.edit) {
        this.$emit('closeEdit');
        this.currentVisit = visitInit();
      }
    },
    onDayEdit(day) {
      this.currentDay = day;
      this.timeEdit = true;
    },
    onDayScheduleEdit(payload) {
      if (!this.currentDay) {
        return;
      }
      if (!this.business) {
        return;
      }
      let dt = this.currentDay.dateKey;
      let data = {
        j: { schedule: payload }
      };
      Api()
        .patch(
          `business_calendar?and=(business_id.eq.${this.business},dt.eq.${dt})`,
          data
        )
        .then(() => {
          this.timeEdit = false;
          this.currentDay = {};
          this.loadCalendar({
            business: this.business,
            dates: [dt, dt]
          });
        });
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
    onVisitSave(i, payload) {
      this.editVisitPage = undefined;
      this.sendData(payload)
        .then(() => {
          this.edit = false;
        })
        .catch(err => {
          this.alert(makeAlert(err));
          if (
            err.response &&
            err.response.data &&
            err.response.data.code === '23P01'
          ) {
            this.editVisitPage = 1;
          }
        });
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
        return Api()
          .patch(`visit?id=eq.${data.id}`, data)
          .then(() => this.fetchData());
      } else {
        return Api()
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
          x.visits = this.dayVisits(x.dateKey, this.business);
          return x;
        });
        return w;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
  .month-header {
    background: linear-gradient(270deg, #C9A15D -9.86%, #BA9462 103.49%);
    height: 40px;

  }
  .cal-head {
    margin-right: 10px;
    font-size: 18px;
    text-transform: capitalize;
    color: #fff
  }
  .cal-next-prev {
    margin: 0;
    width: 16px;
    max-width: 16px;
    min-width: 16px;
  }
</style>
