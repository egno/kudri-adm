<template>
  <VLayout column>
    <VFlex
      v-if="showHeader"
      px-2
    >
      <VLayout
        align-space-around
        justify-space-between
        row
        fill-height
      >
        <VFlex
          grow
          headline
          align-self-end
        >
          {{ dateMonthHeader }}
        </VFlex>
        <v-spacer />
        <VFlex>
          <v-btn
            fab
            depressed
            small
            @click="addMonth(-1)"
          >
            <v-icon dark>
              navigate_before
            </v-icon>
          </v-btn>
        </VFlex>
        <VFlex>
          <v-btn
            fab
            depressed
            small
            @click="addMonth(1)"
          >
            <v-icon dark>
              navigate_next
            </v-icon>
          </v-btn>
        </VFlex>
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
    newVisit: { type: Boolean, default: false },
    kind: { type: String, default: 'mini' },
    period: { type: String, default: 'month' },
    showHeader: { type: Boolean, default: true }
  },
  data() {
    return {
      currentDay: {},
      currentVisit: visitInit(),
      dates: [[]],
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
    curSchedule() {
      if (!this.schedule) {
        return Array(7);
      }
      return this.schedule.filter(
        d => d.dt >= this.minDate.dateKey && d.dt <= this.maxDate.dateKey
      );
    },
    maxDate() {
      return this.dates[this.dates.length - 1][6];
    },
    minDate() {
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
        workTimes[0] > visitTimes[0] ? visitTimes[0] : workTimes[0],
        workTimes[1] < visitTimes[1] ? visitTimes[1] : workTimes[1]
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
  },
  methods: {
    ...mapActions(['loadCalendar', 'setActualDate']),
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


