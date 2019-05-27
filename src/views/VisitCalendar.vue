<template>
  <div class="visit-log">
    <v-progress-linear
      :active="isLoading"
      height="2"
      indeterminate
      color="#5699FF"
    />
    <div v-show="!isLoading">      
      <div v-show="!showEmployeeSelection">
        <div class="header">
          <div class="header__info ">
            <ul class="visit-log__info-list">
              <li class="visit-log__info-item">
                В процессе/Завершен
              </li>
              <li class="visit-log__info-item _missed">
                Не пришел
              </li>
              <li class="visit-log__info-item _cancelled">
                Отмена
              </li>
              <li class="visit-log__info-item _day-off">
                Выходной
              </li>
              <li class="visit-log__info-item _break">
                Перерыв
              </li>
            </ul>
          </div>
          <div class="header__button">
            <MainButton
              v-if="selectedEmployee"
              :class="{ button_disabled: false }"
              class="button_attractive"
              @click="createVisit()"
            >
              Создать запись
            </MainButton>
          </div>
        </div>
        <div class="calendar-controls">
          <VLayout
            align-center
            justify-space-between
            row
            class="calendar-controls__container"
          >
            <div class="calendar-controls__left">
              <v-btn
                class="calendar-controls__button"
                depressed
                flat
                small
                @click.stop="addMonth(-1)"
              >
                <v-icon>navigate_before</v-icon>
              </v-btn>
              <v-btn
                class="desktop calendar-controls__button"
                depressed
                flat
                small
                @click.stop="addMonth(1)"
              >
                <v-icon>navigate_next</v-icon>
              </v-btn>
              <div class="calendar-controls__heading">
                {{ dateMonthHeader }}
              </div>
            </div>
            <div class="calendar-controls__right">
              <div class="calendar-controls__toggle desktop">
                <input id="day-mode" v-model="displayMode" type="radio" value="day">
                <label for="day-mode">День</label>
                <input id="week-mode" v-model="displayMode" type="radio" value="week">
                <label for="week-mode">Неделя</label>
              </div>
              <v-btn
                class="mobile calendar-controls__button"
                depressed
                flat
                small
                @click.stop="addMonth(1)"
              >
                <v-icon>navigate_next</v-icon>
              </v-btn>
            </div>
          </VLayout>
          <VLayout row justify-space-between class="calendar-controls__days">
            <div 
              v-for="(day, dayIndex) in selectedWeek" 
              :key="dayIndex" 
              :class="{ 'calendar-controls__day': true, 'selected': day.dateKey === selectedDate }"
              @click="goDate(day.dateKey)"
            >
              <div>{{ day.display }}</div>
              <div class="calendar-controls__dow">
                {{ dow[dayIndex] }}
              </div>
            </div> 
          </VLayout>          
        </div>
        <VLayout 
          v-if="businessEmployees && !businessEmployees.length" 
          class="visit-log__no-employees"
          align-center 
          justify-space-between 
          row 
          fill-height
        >
          <div>У вас нет ни одного мастера.</div>
          <MainButton class="button_attractive" @click="$router.push({
            name: 'employeeProfile',
            params: { id: $route.params.id, employee: 'new' }
          })"
          >
            Создать мастера
          </MainButton>
        </VLayout>
        
        <div v-if="selectedEmployee && selectedEmployee.j" :class="['main-table', { 'one-day': displayMode === 'day' }]">
          <div class="week-controls">
            <v-btn
              class="week-controls__button"
              depressed
              flat
              small
              @click.stop="changeWeek(-1)"
            >
              <v-icon>navigate_before</v-icon>
            </v-btn>
            <v-btn
              class="week-controls__button"
              depressed
              flat
              small
              @click.stop="changeWeek(1)"
            >
              <v-icon>navigate_next</v-icon>
            </v-btn>
          </div>
          <div class="employees">
            <button type="button" class="employees__menu" @click="showEmployeeSelection = true" />
            <div 
              v-for="employee in businessEmployees" 
              :key="employee.id" 
              :class="['employee', { 
                selected: selectedEmployee === employee, 
                disabled: !employee.j.services || !employee.j.services.length 
              }]"
              @click="selectedEmployee = employee"
            >
              <Avatar
                class="employee__avatar"
                :name="employee.j.name"
                :src="employee.j.image"
                size="44px"
              />
              <div class="employee__badge">
                <h2 class="employee__title">
                  <span>{{ employee.j.name && employee.j.name.length > 70? employee.j.name.substring(0, 70) + '...' : employee.j.name }}</span>
                </h2>
                <div v-if="employee.j.category" class="employee__subtitle">
                  {{ employee.j.category }}
                </div>
              </div>
            </div>
          </div>
          <div row class="main-table__times">
            <CalendarDayColumn
              v-for="(day, i) in selectedWeek"
              v-show="day.dateKey === selectedDate || displayMode === 'week'"
              :key="selectedEmployee.j.name + day.dateKey"
              :class="{ desktop: day.dateKey !== selectedDate, selected: day.dateKey === selectedDate }"
              :show-time="!i || day.dateKey === selectedDate"
              :day="day"
              :now="now"
              :holiday="isHoliday(day.dateKey)"
              :visits="dayVisits(day.dateKey, selectedEmployee)"
              :employee-schedule="isIrregularDay(day.dateKey)? isIrregularDay(day.dateKey).schedule : selectedEmployee.j.schedule.data[i]"
              :display-from="displayTimes.start"
              :display-to="displayTimes.end"
              @onSlotClick="createVisit"
              @onDayEdit="onDayEdit"
              @makeDayOffTry="notifyHasVisits = true"
            />
          </div>
        </div>
      </div>
      
      <div v-show="showEmployeeSelection" class="modal-content">
        <div class="modal-content__header">
          <v-btn
            class="controls__button"
            depressed
            flat
            small
            @click.stop="showEmployeeSelection = false"
          >
            <v-icon>navigate_before</v-icon>
          </v-btn>
          <h2 class="modal-content__heading">
            Выберите мастера
          </h2>
        </div>
        
        <div class="modal-content__body">
          <Accordion>
            <template slot="heading">
              <div>Все мастера</div>
            </template>
            <template slot="content">
              <AppCheckbox
                v-for="(category, i) in empCategories"
                :id="category"
                :key="i"
                :checked="selectedEmpGroups.includes(category)"
                :label="category"
                name="employee_category"
                :value="category"
                @change="onGroupsChange(category, $event)"
              />
            </template>
          </Accordion>
          <div
            v-for="category in selectedEmpGroups"
            :key="category"
            class="filter-results__group"
          >
            <template v-if="businessEmployees.some(e => e.j && e.j.category === category)">
              <div class="filter-results__group-name">
                {{ category ? category : '' }}
              </div>
              <div class="filter-results__cards">
                <div v-for="(employee, i) in businessEmployees" :key="i">
                  <EmployeeCard
                    v-if="employee.j.category === category"
                    :employee="employee"
                    :services-count="employee.j.services ? employee.j.services.length : 0"
                    @calendarClick="selectedEmployee = employee; showEmployeeSelection = false"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    
    <VisitEdit
      v-if="currentVisit"
      :id="currentVisit.id"
      :visible="edit"
      :business-info="businessInfo"
      :employees="businessEmployees.filter(e => e.j.services && e.j.services.length)"
      :employee="selectedEmployee"
      :visit="currentVisit"
      :page="editVisitPage"
      @onSave="onVisitSave"
      @delete="onDelete"
      @close="edit=false; currentVisit = null; selectVisit(null)"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Api from '@/api/backend'
import MainButton from '@/components/common/MainButton.vue'
import Accordion from '@/components/common/Accordion.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import Avatar from '@/components/avatar/Avatar.vue'
import CalendarDayColumn from '@/components/calendar/CalendarDayColumn.vue'
import EmployeeCard from '@/components/employee/EmployeeCard.vue'
import { 
  ceilMinutes, 
  dateISOInLocalTimeZone, 
  formatDate, 
  hyphenStrToDay, 
  getWeek, 
  visitInit 
} from '@/components/calendar/utils'
import VisitEdit from '@/components/calendar/VisitEdit.vue'
import { makeAlert } from '@/api/utils'
import Visit from '@/classes/visit'
import { setInterval, clearInterval } from 'timers'

import calendarMixin from '@/mixins/calendar'

export default {
  components: { Accordion, AppCheckbox, Avatar, EmployeeCard, MainButton, CalendarDayColumn, VisitEdit },
  mixins: [ calendarMixin ],
  data () {
    return {
      businessInfo: {},
      currentVisit: undefined,
      displayMode: 'week', /* day or week */
      dow: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      edit: false,
      editVisitPage: undefined,
      isLoading: false,
      now: new Date(),
      selectedEmployee: {},
      selectedEmpGroups: [],
      notifyHasVisits: false,
      formActions: [
        { label: 'Добавить запись', action: 'newVisit', default: true }
      ],
      showEmployeeSelection: false,
      timerId: null,
      visits: [],
      irregularDays: []
    }
  },
  computed: {
    ...mapState({
      businessEmployees: state => state.business.businessEmployees
    }),
    ...mapGetters(['businessSchedule', 'selectedVisit']),
    empCategories () { // todo make a mixin
      return [
        ...new Set(
          this.businessEmployees &&
            this.businessEmployees.map(x => x.j && x.j.category)
        )
      ].sort((a, b) => (a < b ? -1 : 1))
    },
    selectedDateObj () {
      return hyphenStrToDay(this.selectedDate)
    },
    selectedWeek () {
      if (!this.selectedDateObj) return []

      const date = this.selectedDateObj.date

      return getWeek(date.getFullYear(), date.getMonth(), this.selectedDateObj.display)
    },
    displayTimes () {
      const schedule = this.selectedEmployee.j.schedule.data
      let start = schedule && schedule.find(day => !!day[0])[0]
      let end = schedule && schedule.find(day => !!day[1])[1]

      //todo disable 'Журнал Записи' in Navigation if no businessSchedule, businessEmployees or businessServices
      schedule.forEach(day => {
        if (!day[0] || !day[1]) {
          return
        }
        if (day[0] < start) {
          start = day[0]
        }
        if (day[1] > end) {
          end = day[1]
        }
      })

      return { start, end }
    }
  },
  watch: {
    '$route.params': {
      handler: 'fetchData',
      deep: true
    },
    businessEmployees: 'initEmployee',
    selectedVisit () {
      if (this.selectedVisit) {
        this.currentVisit = this.selectedVisit
        this.edit = true
      }
    },
    selectedWeek: {
      handler: 'fetchData',
      deep: true
    },
    selectedEmployee: {
      handler: 'getIrregularDays',
      deep: true
    }
  },
  mounted () {
    this.initEmployee()
    // TODO проверить, не утекает ли память
    this.fetchData()
    this.$root.$on('onAction', this.onAction)
    this.timerId = setInterval(this.updateStatus, 60 * 1000)
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.onAction)
    clearInterval(this.timerId)
  },
  methods: {
    ...mapActions(['alert', 'setActions', 'setBusiness', 'selectVisit']),
    changeWeek (vector) {
      let dt = new Date(this.actualDate)

      dt.setDate(dt.getDate() + 7*vector)
      this.goDate(formatDate(dt))
      this.setDates()
    },
    createVisit (date) {
      let visit = visitInit({ ts_begin: dateISOInLocalTimeZone(ceilMinutes(new Date())) })
      
      if (date) {
        visit.ts_begin = date.toISOString()
      }  
      this.selectVisit(visit)
    },
    fetchData () {
      if (!this.$route || !this.$route.params || !this.$route.params.id) return
      this.setActions(this.formActions)

      if (!this.selectedWeek) return

      const sunday = this.selectedWeek[6]
      const nextMonday = new Date(sunday.date)

      nextMonday.setDate(sunday.date.getDate() + 1)
      this.isLoading = true
      Api()
        .get(`/visit?salon_id=eq.${this.$route.params.id}&ts_begin=gt.${this.selectedWeek[0].dateKey}&ts_begin=lt.${formatDate(nextMonday)}`)
        .then(({ data }) => {
          this.visits = data.map(v => new Visit(v))
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getIrregularDays () {
      if (!this.selectedEmployee || !this.selectedWeek) {
        return
      }
      const sunday = this.selectedWeek[6]
      const nextMonday = new Date(sunday.date)

      nextMonday.setDate(sunday.date.getDate() + 1)
      Api() 
        .get(`/business_calendar?business_id=eq.${this.selectedEmployee.id}&changed=eq.true&dt=gt.${this.selectedWeek[0].dateKey}&dt=lt.${formatDate(nextMonday)}`)
        .then(({ data }) => {
          this.irregularDays = data.map(x => ({ date: x.dt, schedule: x.j.schedule, employeeId: x.business_id }))
        })
    },
    initEmployee () {
      this.selectedEmployee = this.businessEmployees && this.businessEmployees.find(e => e.j.services && e.j.services.length)
    },
    onAction () {
      this.createVisit()
    },
    onDayEdit ({ day, isDayOff }) {
      const isWorkingDay = day => day && day[0] && day[1]
      const averageDay = this.selectedEmployee.j.schedule
        ? this.selectedEmployee.j.schedule.data.find(isWorkingDay)
        : this.businessSchedule.data.find(isWorkingDay)

      Api()
        .patch(`/business_calendar?business_id=eq.${this.selectedEmployee.id}&dt=eq.${day.dateKey}`,
          {
            j: { schedule: isDayOff? averageDay: [] }
          })
        .then(() => {
          this.getIrregularDays()
        })
    },
    onGroupsChange (category, selected) {
      if (selected) {
        this.selectedEmpGroups.push(category)
      } else {
        const i = this.selectedEmpGroups.indexOf(category)

        if (i > -1) {
          this.selectedEmpGroups.splice(i, 1)
        }
      }
    },
    onSelectEmployee (payload) {
      this.selectedEmployee = payload
    },
    onVisitSave (payload) {
      //todo move saving into Visit class 
      this.editVisitPage = undefined
      this.sendData(payload)
        .then(() => {
          this.edit = false
          this.selectVisit(null)
        })
        .catch(err => {
          this.alert(makeAlert(err))
          if (
            err.response &&
            err.response.data &&
            err.response.data.code === '23P01'
          ) {
            this.editVisitPage = 1
          }
        })
    },
    onDelete () { 
      this.edit = false
      Api()
        .delete(`visit?id=eq.${this.currentVisit.id}`)
        .then(() => {
          this.currentVisit = null
          this.selectVisit(null)
          this.fetchData()
        })
        .catch(err => {
          this.alert(makeAlert(err))})
    },
    sendData (data) {
      if (data && data.id) {
        return Api()
          .patch(`visit?id=eq.${data.id}`, data)
          .then(() => this.fetchData())
      } else {
        return Api()
          .post('visit', data)
          .then(() => this.fetchData())
      }
    },
    updateStatus () {
      this.now = new Date()
    },
  }
}
</script>

<style lang="scss">
  @import '../assets/styles/common';
  %round-arrow-button {
    float: left;
    min-width: 0;
    width: 24px;
    height: 24px;
    margin: 0;
    border: 1px solid rgba(137, 149, 175, 0.1);
    border-radius: 50%;
    color: #8995AF;
    
    i {
      font-size: 19px;
    }
  }
  .visit-log {
    .v-progress-linear {
      margin: 0;
    }
    .header {
      display: none;
      justify-content: space-between;
      @media only screen and (min-width : $desktop) {
        display: flex;
        padding-right: 40px;
      }
      
      &__info {
        display: flex;
        min-height: 58px;
        flex-grow: 1;
        align-items: center;
      }
    }

    .calendar-controls {
      background-color: #fff;
      border-bottom: 1px solid rgba(137, 149, 175, 0.2);
      @media only screen and (min-width : $desktop) {
        padding: 0 38px;
      }

      &__left {
        flex-grow: 1;
        display: flex;
        align-items: center;
      } 
      &__container {
        height: 44px;
        @media only screen and (min-width : $desktop) {
          height: 40px;
        }
      }
      &__button {
        width: 55px;
        box-sizing: border-box;
        min-width: 0;
        @media only screen and (min-width : $desktop) {
          width: 24px;
          padding: 0;
          margin: 8px 14px;
        }

        i {
          @media only screen and (min-width : $desktop) {
            font-size: 19px;
          }
        }
      }
      &__heading {
        padding-left: 5px;
        font-family: Roboto Slab;
        font-size: 18px;
        color: #07101C;
        text-transform: capitalize;
      }
      &__toggle { 
        background: rgba(137, 149, 175, 0.1);
        border-radius: 20px;  
        input {
          display: none;
          &:checked + label {
            background: #5699FF;
            color: #fff;
          }
        }
         label {
          position: relative;
          display: inline-block;
          width: 120px;
          line-height: 22px;
          cursor: pointer;  
          background: transparent;
          text-align: center;
          color: #8995AF;
          border-radius: 20px;
          transition: color 0.4s, background-color 0.4s;
        }
      }
      &__days {
        padding: 0 35px;
        @media only screen and (min-width : $desktop) {
          display: none;
        }
      }
      &__day {
        padding: 14px 12px;
        &.selected {
          background-color: #5699FF;
          border-radius: 4px;
          * {
            color: #fff;
          }
        }
      }
      &__dow {
        margin-top: 9px;
        font-weight: bold;
      }
    }

    .mobile {
      @media only screen and (min-width : $desktop) {
        display: none;
      }
    }
    .desktop {
      display: none;
      @media only screen and (min-width : $desktop) {
        display: block;
      }
    }

    &__no-employees {
      padding: 12px 0;
      background-color: #fff;
    }
    &__info-list {
      display: flex; 
      flex-grow: 1;
      max-width: 772px;
      justify-content: space-between;
      list-style: none;
      padding: 0 4% 0 56px;
    }
    &__info-item {
      font-size: 12px; 
      &:before {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 4px;
        content: '';
        border-left: 2px solid #fff;
        background-color: #fff;
      }
      &._missed:before {
        border-color: #EF4D37;
      }
      &._cancelled:before {
        border-color: #8995AF;
      }
      &._day-off:before {
        background-color: rgba(137, 149, 175, 0.1);
        border-color: transparent;
      }
      &._break:before {
        background: url('../assets/images/svg/cup.svg') left center no-repeat;
        border-color: transparent;
      }
    }

    .main-table {
      position: relative;
      @media only screen and (min-width : $desktop) {
        display: flex;
        overflow: auto;
      }

      &__times { 
        padding-left: 58px;
        @media only screen and (min-width : $desktop) {
          display: flex;
          width: 100%;
          max-width: 1040px;
          padding-left: 70px;
        }
      }

      &.one-day .day-column.selected {
        width: 100%;
        .day-column__header {
          background-color: #fff;
        }
        .time-mark {
          display: block;
        }
      }
    }

    .day-column {
      &__header { 
        display: none;
        @media only screen and (min-width : $desktop) {
          display: block;      
        }
      }
      .time-mark {
        display: none;
      }

      &:first-child .time-mark {
        @media only screen and (min-width : $desktop) {
          display: block;      
        }
      }
      &.selected .time-mark {
        @media only screen and (max-width : $desktop) {
          display: block;      
        }
      }
    }

    .week-controls {
      display: none;
      position: absolute;
      z-index: 1;
      left: 0;
      width: 128px;
      height: 82px;
      padding-left: 52px;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      box-shadow: -4px 2px 8px rgba(137, 149, 175, 0.1);
      @media only screen and (min-width : $desktop) {
        display: flex;
      }
      &__button {
        @extend %round-arrow-button
      }
    }

    .employees {
      display: flex;
      align-items: center;
      padding: 18px;
      background-color: #fff;
      @media only screen and (min-width : $desktop) {
        display: block;
        width: 55px;
        padding: 100px 8px 0;
      }

      &__menu {
        width: 24px;
        height: 24px;
        background: url('../assets/images/svg/dots.svg') center no-repeat;
        outline: none;
        margin-right: 36px;
        @media only screen and (min-width : $desktop) {
          display: none;
          margin: 0 7.5px;
        }
      }
    }
    .employee {
      display: none;
      margin: 12px 0;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      @media only screen and (min-width : $desktop) {
        display: flex;
        width: 40px;
        height: 40px;
        padding: 7px;
        justify-content: center;
        border-radius: 50%;
        &.selected {
          background-color: #5699FF;
          .v-avatar {
            border: 1px solid rgba(255, 255, 255, 0.35);
          }
        }
      }

      &__avatar {
        @media only screen and (min-width : $desktop) {
          width: 24px !important;
          height: 24px !important;
        }
      }
      &__badge {
        max-width: 184px;
        padding-left: 12px;
        @media only screen and (min-width : $desktop) {
          display: none;
        }
      }
      &__title {
        font-weight: bold;
        font-size: 16px;
        color: #07101C;
        text-transform: capitalize;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &__subtitle {
        font-weight: normal;
        font-size: 12px;
        color: #8995AF;
      }
      &.selected {
        display: flex;
      }
      &.disabled {
        opacity: .35;
        pointer-events: none;
      }
    }

  }

  .modal-content { 
    &__header {
      display: flex;
      align-items: center;
      padding: 53px 12px 12px 17px;
      background-color: #fff;
    }
    &__heading {
      font-family: Roboto Slab;
      font-weight: normal;
      font-size: 24px;
      color: #07101C;
    }
    &__body {
      padding: 28px 30px;
    }

    .controls__button {
      @extend %round-arrow-button;
      margin-right: 15px;
    }
    .accordion__header,
    .accordion__container {
      background-color: #fff;
    }
    .accordion._expanded .accordion__header {
      border-bottom-color: rgba(137, 149, 175, 0.1);
    }
    .accordion__container {
      padding-bottom: 15px;
    }
    .checkbox__label {
      margin-bottom: 10px;
    }
    .filter-results__group-name {
      padding-left: 25px;
    }
    .delete-button {
      display: none;
    }
  }
</style>
