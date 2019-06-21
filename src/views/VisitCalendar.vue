<template>
  <div class="visit-log">
    <v-progress-linear
      :active="isLoading"
      height="2"
      indeterminate
      color="#5699FF"
    />
    <div v-show="!isLoading">      
      <div v-show="!showMobileMenu">
        <div class="header">
          <VLayout row align-center class="calendar-controls__right">
            <router-link
              :disabled="selectedDateObj.dateKey === todayString"
              class="calendar-controls__today"
              :to="{ name: 'visitCalendar', params: { id: businessId, date: todayString } }"
            >
              Сегодня
            </router-link>
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
          </VLayout>
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
            <VLayout row align-center class="calendar-controls__right">
              <router-link
                :disabled="selectedDateObj.dateKey === todayString"
                class="calendar-controls__today"
                :to="{ name: 'visitCalendar', params: { id: businessId, date: todayString } }"
              >
                Сегодня
              </router-link>
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
            </VLayout>
          </VLayout>
          <VLayout>
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
            <VLayout row justify-space-between class="calendar-controls__days _desktop">
              <div
                v-for="(day, dayIndex) in selectedWeek"
                :key="dayIndex"
                :class="{ 'calendar-controls__day': true, 'selected': day.dateKey === selectedDate }"
                @click="goDate(day.dateKey)"
              >
                <!--todo make a component -->
                <div class="calendar-controls__number">
                  {{ day.display }}
                </div>
                <div class="calendar-controls__dow">
                  <span class="mobile">{{ dow[dayIndex] }}</span>
                  <span class="desktop">{{ day.date.toLocaleString('ru-RU', { weekday: 'long' }) }}</span>
                </div>
              </div>
            </VLayout>
          </VLayout>
          <div v-if="dates.length" class="calendar-controls__dates-container mobile">
            <carousel :pagination-enabled="false" :min-swipe-distance="25" :per-page="1">
              <slide v-for="(week, weekIndex) in dates" :key="weekIndex">
                <VLayout row justify-space-between class="calendar-controls__days">
                  <div
                    v-for="(day, dayIndex) in week"
                    :key="dayIndex"
                    :class="{ 'calendar-controls__day': true, 'selected': day.dateKey === selectedDate }"
                    @click="goDate(day.dateKey)"
                  >
                    <!--todo make a component -->
                    <div class="calendar-controls__number">
                      {{ day.display }}
                    </div>
                    <div class="calendar-controls__dow">
                      <span class="mobile">{{ dow[dayIndex] }}</span>
                      <span class="desktop">{{ day.date.toLocaleString('ru-RU', { weekday: 'long' }) }}</span>
                    </div>
                  </div>
                </VLayout>
              </slide>
            </carousel>
          </div>
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
          <div class="employees">
            <button type="button" class="employee-menu-trigger" @click="showMobileMenu = true" />
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
          <div class="main-table__desktop-menu desktop">
            <div class="employees-selection">
              <v-menu
                v-model="showDesktopMenu"
                :close-on-content-click="false"
                min-width="182"
                max-width="200"
                offset-x
                attach=".main-table__desktop-menu .employees-selection"
              >
                <template v-slot:activator="{ on }">
                  <div class="employee-menu-trigger" v-on="on" />
                </template>
                <div class="employees-selection__menu">
                  <!--<div :class="['employees-selection__item']" @click="toggleAll">
                    Все мастера
                  </div>-->
                  <v-expansion-panel>
                    <v-expansion-panel-content
                      v-for="category in employeesCategories"
                      :key="category"
                      :hide-actions="true"
                    >
                      <template v-slot:header>
                        <VLayout
                          align-center
                          justify-space-between
                        >
                          <div>{{ category }} {{ groupedEmployees[category].length }}</div>
                          <AppCheckbox
                            :id="category"
                            :checked="groupedEmployees[category].length === visibleEmployees.filter(e => e.j.category === category).length"
                            label=""
                            :value="category"
                            @click.native.stop
                            @change="onGroupsChange(category, $event)"
                          />
                        </VLayout>
                      </template>

                      <VLayout
                        v-for="(emp, i) in groupedEmployees[category]"
                        :key="emp.id"
                        justify-space-between
                        class="employees-selection__item"
                      >
                        <div>{{ emp.j.name }}</div>
                        <AppCheckbox
                          :id="emp.j.name + i"
                          :checked="visibleEmployees.some(e => e.id === emp.id)"
                          label=""
                          :value="emp.id"
                          @click.native.stop
                          @change="changeVisibleEmployees(emp, $event)"
                        />
                      </VLayout>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </div>
              </v-menu>
            </div>
          </div>
          <template v-if="displayMode === 'day'">
            <div row class="main-table__times">
              <CalendarDayColumn
                v-for="employee in businessEmployees"
                v-show="visibleEmployees.some(e => e.id === employee.id)"
                :key="employee.id"
                :employee="employee"
                :class="{ desktop: employee.id !== selectedEmployee.id, selected: employee.id === selectedEmployee.id }"
                :show-time="true"
                :day="selectedDateObj"
                :now="now"
                :holiday="isHoliday(selectedDate, employee)"
                :visits="dayVisits(selectedDate, employee)"
                :employee-schedule="getIrregularDay(selectedDate, employee)? getIrregularDay(selectedDate, employee).schedule : employee.j.schedule.data[selectedDOW]"
                :display-from="displayTimes.start"
                :display-to="displayTimes.end"
                @onSlotClick="createVisit"
                @onBreakClick="createBreak"
                @onDayEdit="onDayEdit"
                @makeDayOffTry="notifyHasVisits = true"
              />
            </div>
          </template>
          <template v-else>
            <VLayout row>
              <div row class="main-table__times">
                <CalendarDayColumn
                  v-for="(day, i) in selectedWeek"
                  v-show="day.dateKey === selectedDate || displayMode === 'week'"
                  :key="selectedEmployee.j.name + day.dateKey"
                  :employee="!i? selectedEmployee : {}"
                  :class="{ desktop: day.dateKey !== selectedDate, selected: day.dateKey === selectedDate }"
                  :show-time="!i || day.dateKey === selectedDate"
                  :day="day"
                  :now="now"
                  :holiday="isHoliday(day.dateKey, selectedEmployee)"
                  :visits="dayVisits(day.dateKey, selectedEmployee)"
                  :employee-schedule="getIrregularDay(day.dateKey, selectedEmployee)? getIrregularDay(day.dateKey, selectedEmployee).schedule : selectedEmployee.j.schedule.data[i]"
                  :display-from="displayTimes.start"
                  :display-to="displayTimes.end"
                  @onSlotClick="createVisit"
                  @onBreakClick="createBreak"
                  @onDayEdit="onDayEdit"
                  @makeDayOffTry="notifyHasVisits = true"
                />
              </div>
              <div class="main-table__employees-switch" />
            </VLayout>
          </template>
        </div>
      </div>
      
      <div v-show="showMobileMenu" class="modal-content">
        <div class="modal-content__header">
          <v-btn
            class="controls__button"
            depressed
            flat
            small
            @click.stop="showMobileMenu = false"
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
                v-for="(category, i) in employeesCategories"
                :id="category"
                :key="i"
                :checked="selectedCategories.includes(category)"
                :label="category"
                name="employee_category"
                :value="category"
                @change="onGroupsChange(category, $event)"
              />
            </template>
          </Accordion>
          <div
            v-for="category in selectedCategories"
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
                    @calendarClick="selectedEmployee = employee; showMobileMenu = false"
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
      :company-id="businessInfo.parent? businessInfo.parent : businessId"
      :employees="businessEmployees.filter(e => e.j.services && e.j.services.length)"
      :employee="selectedEmployee"
      :visit="currentVisit"
      :page="editVisitPage"
      @onSave="onVisitSave"
      @delete="onDelete"
      @close="edit=false; currentVisit = null; selectVisit(null)"
    />
    <Modal
      :visible="showSuccessModal"
      :template="{
        header: 'Запись создана',
        rightButton: 'Понятно'
      }"
      content-class="modal-notification"
      @rightButtonClick="closeModal"
      @close="closeModal"
    >
      <template slot="text">
        <div class="modal-notification__content">
          Запись на <b>{{ successTemplate.date }} {{ successTemplate.time }}</b> к мастеру <b>{{ successTemplate.master }}</b> успешно создана.
        </div>
      </template>
    </Modal>
    <Modal
      :visible="notifyHasVisits"
      :template="{
        header: 'На этот день есть записи!',
        rightButton: 'Понятно'
      }"
      content-class="modal-notification"
      @rightButtonClick="notifyHasVisits = false"
      @close="notifyHasVisits = false"
    >
      <template slot="text">
        <div class="modal-notification__content">
          Прежде чем изменить рабочее время, вам необходимо удалить или изменить время записи.
        </div>
      </template>
    </Modal>
    <BreakEdit
      v-if="selectedEmployee"
      :work-break="currentBreak"
      :start-time="currentBreak && currentBreak.ts_begin"
      :end-time="currentBreak && currentBreak.ts_end"
      :notes-prop="currentBreak && currentBreak.j.notes"
      :visible="showEditBreak"
      :employee-id="selectedEmployee.id"
      :employee-visits="visits.filter(v => v.business_id === selectedEmployee.id)"
      @inputStart="currentBreak.ts_begin = $event"
      @inputEnd="onInputBreakEnd"
      @inputNotes="addNotesToBreak"
      @saved="fetchData"
      @close="onCloseBreakEdit"
    />
  </div>
</template>

<script>
import Api from '@/api/backend'
import MainButton from '@/components/common/MainButton.vue'
import Accordion from '@/components/common/Accordion.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import Avatar from '@/components/avatar/Avatar.vue'
import CalendarDayColumn from '@/components/calendar/CalendarDayColumn.vue'
import EmployeeCard from '@/components/employee/EmployeeCard.vue'
import BreakEdit from '@/components/calendar/BreakEdit.vue'
import Modal from '@/components/common/Modal'
import VisitEdit from '@/components/calendar/VisitEdit.vue'
import Visit from '@/classes/visit'
import { Carousel, Slide } from 'vue-carousel'
import { mapState, mapActions, mapGetters } from 'vuex'
import { makeAlert } from '@/api/utils'
import { setInterval, clearInterval } from 'timers'
import { employeesCategorized } from '@/mixins/employee'
import calendarMixin from '@/mixins/calendar'
import {
  ceilMinutes,
  dateISOInLocalTimeZone,
  formatDate,
  hyphenStrToDay,
  hyphensStringToDate,
  visitInit
} from '@/components/calendar/utils'

export default {
  components: {
    Accordion,
    AppCheckbox,
    Avatar,
    BreakEdit,
    EmployeeCard,
    MainButton,
    Modal,
    CalendarDayColumn,
    VisitEdit,
    Carousel,
    Slide },
  mixins: [ calendarMixin, employeesCategorized ],
  data () {
    return {
      currentBreak: undefined,
      currentVisit: undefined,
      displayMode: 'day', /* day or week */
      dow: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      edit: false,
      editVisitPage: undefined,
      isLoading: false,
      now: new Date(),
      selectedEmployee: {},
      visibleEmployees: [],
      notifyHasVisits: false,
      formActions: [
        { label: 'Добавить запись', action: 'newVisit', default: true }
      ],
      showEditBreak: false,
      showDesktopMenu: false,
      showMobileMenu: false,
      showSuccessModal: false,
      successTemplate : {
        master: '',
        date: '',
        time: ''
      },
      timerId: null,
      visits: [],
      irregularDays: []
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices
    }),
    ...mapGetters(['businessSchedule', 'selectedBreak', 'selectedVisit', 'businessInfo']),
    groupedEmployees () {
      let obj = {}

      this.businessEmployees.forEach(emp => {
        if (!emp.j || !emp.j.category) {
          return
        }
        const category = emp.j.category

        if (!obj[category]) {
          obj[category] = []
        }

        if (!obj[category].includes(emp)) {
          obj[category].push(emp)
        }
      })

      return obj
    },
    selectedDOW () {
      return this.selectedWeek.findIndex(day => day.dateKey === this.selectedDate)
    },
    selectedDateObj () {
      return hyphenStrToDay(this.selectedDate)
    },
    selectedWeek () {
      if (!this.selectedDate) return []

      return this.getWeek()
    },
    displayTimes () {
      const selectedEmployeeSchedule = this.selectedEmployee.j.schedule.data
      let start = selectedEmployeeSchedule && selectedEmployeeSchedule.find(day => !!day[0])[0]
      let end = selectedEmployeeSchedule && selectedEmployeeSchedule.find(day => !!day[1])[1]

      if (this.displayMode === 'day') {
        this.businessEmployees.forEach(employee => {
          const schedule = employee.j.schedule.data

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
        })
      } else {
        selectedEmployeeSchedule.forEach(day => {
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
      }

      return { start, end }
    },
    todayString () {
      return formatDate(this.now)
    }
  },
  watch: {
    '$route.params': {
      handler: 'fetchData',
      deep: true
    },
    businessEmployees: 'initEmployee',
    businessServices: 'initEmployee',
    selectedBreak () {
      if (this.selectedBreak) {
        this.currentBreak = { ...this.selectedBreak, j: { ...this.selectedBreak.j } }
        this.showEditBreak = true
      } else {
        this.currentBreak = null
        this.showEditBreak = false
      }
    },
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
    ...mapActions(['alert', 'setActions', 'setBusiness', 'selectBreak', 'selectVisit']),
    addNotesToBreak (payload) {
      this.currentBreak.j.notes = payload
    },
    changeVisibleEmployees (employee, selected) {
      if (selected) {
        if (!this.visibleEmployees.some(e => e.id === employee.id)) {
          this.visibleEmployees.push(employee)
        }
      } else {
        const i = this.visibleEmployees.findIndex(e => e.id === employee.id)

        if (i > -1) {
          this.visibleEmployees.splice(i, 1)
        }
      }
    },
    changeWeek (vector) {
      let dt = new Date(this.selectedDate)

      dt.setDate(dt.getDate() + 7*vector)
      this.goDate(formatDate(dt))
      this.setDates()
    },
    closeModal () {
      this.showSuccessModal = false
      this.successTemplate = {
        master: '',
        date: '',
        time: ''
      }
    },
    createBreak (date) {
      let newBreak = visitInit({
        ts_begin: dateISOInLocalTimeZone(date),
        business_id: this.selectedEmployee.id,
        j: {
          type: 'break'
        }
      })

      this.selectBreak(newBreak)
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
        .get(`/business_calendar?business_id=eq.${this.selectedEmployee.id}&changed=eq.true&dt=gte.${this.selectedWeek[0].dateKey}&dt=lt.${formatDate(nextMonday)}`)
        .then(({ data }) => {
          this.irregularDays = data.map(x => ({ date: x.dt, schedule: x.j.schedule, employeeId: x.business_id }))
        })
    },
    getWeek () {
      const includesDay = day => day.dateKey === this.selectedDate

      return this.dates.find(week => week.some(includesDay))
    },
    initEmployee () {
      if (!this.businessEmployees || !this.businessEmployees.length ||
        !this.businessServices || !this.businessServices.length) {
        return
      }
      const serviceWithEmployee = this.businessServices && this.businessServices.find(s =>  s.j.employees && s.j.employees.length)

      if (!serviceWithEmployee) {
        return
      }
      for (let id of serviceWithEmployee.j.employees) {
        const employee = this.businessEmployees.find(e => e.id === id)

        if (employee) {
          this.selectedEmployee = employee
          break
        }
      }

      this.businessEmployees.forEach(employee => {
        if (!this.visibleEmployees.some(emp => emp.id === employee.id)) {
          this.visibleEmployees.push(employee)
          if (!this.selectedCategories.includes(employee.j.category)) {
            this.selectedCategories.push(employee.j.category)
          }
        }
      })
    },
    onAction () {
      this.createVisit()
    },
    onCloseBreakEdit () {
      this.showEditBreak = false
      setTimeout(() => {
        this.selectBreak(null)
      }, 300)
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
        if (!this.selectedCategories.includes(category)) {
          this.selectedCategories.push(category)
        }
      } else {
        const i = this.selectedCategories.indexOf(category)

        if (i > -1) {
          this.selectedCategories.splice(i, 1)
        }
      }
      this.groupedEmployees[category].forEach(e => this.changeVisibleEmployees(e, selected))
    },
    onInputBreakEnd (payload) {
      const time = payload.substring(11,16)
      const endOfWorkDay = this.displayTimes.end

      this.currentBreak.ts_end = (time <= endOfWorkDay)? payload : `${payload.substring(0, 10)}T${endOfWorkDay}`
    },
    onVisitSave (payload) {
      //todo move saving into Visit class

      this.editVisitPage = undefined
      this.successTemplate.date = hyphensStringToDate(payload.ts_begin.substring(0, 10)).toLocaleString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })
      this.successTemplate.time = payload.ts_begin.substring(11, 16)
      this.successTemplate.master = this.selectedEmployee.j.name
      this.sendData(payload)
        .then(() => {
          this.edit = false
          this.selectVisit(null)
          this.showSuccessModal = true
        })
        .then(() => this.fetchData())
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
      } else {
        return Api()
          .post('visit', data)
      }
    },
    swipeRight () {
      this.changeWeek(-1)
    },
    swipeLeft () {
      this.changeWeek(1)
    },
    updateStatus () {
      this.now = new Date()
    },
  }
}
</script>

<style lang="scss">
  @import '../assets/styles/common';
  @import '../assets/styles/day-schedule';

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
    background-color: #e7eaef;
    .v-progress-linear {
      margin: 0;
    }
    .header {
      display: none;
      justify-content: space-between;
      background-color: #fff;
      border-bottom: 1px solid rgba(137, 149, 175, 0.2);
      @media only screen and (min-width : $desktop) {
        display: flex;
        padding: 0 40px 0 127px;
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
      &__left {
        flex-grow: 1;
        display: flex;
        align-items: center;
        @media only screen and (min-width : $desktop) {
          padding-left: 11px;
        }
      }
      &__right {
        flex-grow: 0;
      }
      &__container {
        height: 44px;
        @media only screen and (min-width : $desktop) {
          display: none;
        }
      }
      &__button {
        width: 55px;
        box-sizing: border-box;
        min-width: 0;
        margin: 0;
        @media only screen and (min-width : $desktop) {
          width: 24px;
          padding: 0;
          margin: 8px 5px;
        }

        i {
          @media only screen and (min-width : $desktop) {
            font-size: 19px;
          }
        }
      }
      &__heading {
        font-family: Roboto Slab;
        font-size: 14px;
        color: #07101C;
        text-transform: capitalize;
        @media only screen and (min-width : $tablet) {
          padding-left: 5px;
          font-size: 18px;
        }
      }
      &__today {
        height: 24px;
        padding: 0 25px;
        line-height: 24px;
        border: 1px solid #5699FF;
        border-radius: 16px;
        color: #5699FF;
        text-decoration: none;
        @media only screen and (min-width : $tablet) {
          margin-right: 16px;
          padding: 0 35px;
        }
        &[disabled="disabled"] {
          border-color: rgba(137, 149, 175, 0.2);
          color: rgba(137, 149, 175, 0.35);
          cursor: default;
        }
      }
      &__toggle {
        height: 24px;
        padding: 1px;
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
          padding: 0;
        }
        &._desktop {
          display: none;
          @media only screen and (min-width : $desktop) {
            display: flex;
          }
        }
      }
      &__day {
        padding: 14px 12px;
        @media only screen and (min-width : $desktop) {
          width: 14.28%;
          padding: 14px 20px;
        }
        &.selected {
          background-color: #5699FF;
          border-radius: 4px;
          * {
            color: #fff;
          }
        }
      }
      &__number {
        font-size: 18px;
        font-family: $roboto;
      }
      &__dow {
        margin-top: 9px;
        font-weight: bold;
        text-transform: capitalize;
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

      &__desktop-menu {
        position: relative;
        width: 125px;
        background-color: #fff;
        .employee-menu-trigger {
          height: 80px;
          margin-left: 66px;
        }
      }

      &__times { 
        padding-left: 58px;
        @media only screen and (min-width : $desktop) {
          display: flex;
          width: 100%;
          padding-left: 125px;
        }
      }

      &__employees-switch {
        width: 179px;
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
        @media only screen and (max-width : ($desktop - 1px)) {
          display: block;      
        }
      }
    }

    .week-controls {
      display: none;
      width: 126px;
      height: 82px;
      padding: 0 14px 0 55px;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      @media only screen and (min-width : $desktop) {
        display: flex;
      }
      &__button {
        @extend %round-arrow-button;
        &:hover {
          background-color: rgba(137, 149, 175, 0.1);;
        }
      }
    }

    .employees {
      display: flex;
      align-items: center;
      padding: 18px;
      background-color: #fff;
      @media only screen and (min-width : $desktop) {
        display: none;
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

    .employees-selection {
      height: 80px;
      position: absolute;
      width: 125px;
      background: #fff;
      &__menu {
        width: 182px;
        background-color: #fff;
      }
      &__item {
        padding: 7px 8px 8px 16px;
        border-bottom: 1px solid rgba(137, 149, 175, 0.1);
        &:last-child {
          border: none;
        }
      }
      .v-menu__content {
        overflow: hidden;
      }
      .v-expansion-panel__header {
        min-height: 32px;
        padding: 7px 8px 8px 16px;
        border-bottom: 1px solid rgba(137, 149, 175, 0.1);
        background-color: rgba(137, 149, 175, 0.1);
      }
      .v-expansion-panel__container {
        border: none;
      }
      .v-expansion-panel__container--active .v-expansion-panel__header {
        background-color: #fff;
      }
      .checkbox {
        display: inline-flex;
      }
    }
    .checkbox__label {
      height: 16px;
      margin: 0;
      padding: 0 7px;
      border-radius: 2px;
      border: 1px solid rgba(137, 149, 175, 0.2);
      background-color: #fff;
    }
    .checkbox__input:checked + .checkbox__label {
      background: url('../assets/images/svg/selection.svg') center/10px 8px no-repeat #5699ff;
    }
    .employee-menu-trigger {
      width: 24px;
      height: 24px;
      background: url('../assets/images/svg/dots.svg') center no-repeat;
      outline: none;
      margin-right: 36px;
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

  .modal-notification {
    &__content {
      margin-top: 30px;
    }
    .uno-modal {
      background: url('../assets/images/svg/broken.svg') center 52px no-repeat #fff;
    }
    .uno-modal__header {
      margin-top: 78px;
    }
    .uno-modal__buttons {
      justify-content: center;
    }
    .uno-modal__left {
      display: none;
    }

  }
  

</style>
