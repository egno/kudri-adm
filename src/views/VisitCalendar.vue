<template>
  <div class="visit-log">
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
          :class="{ button_disabled: false }"
          class="button_attractive"
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
    </div>
    <div class="main-table">
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
        <div class="employees__menu" />
        <div v-if="selectedEmployee && selectedEmployee.j" class="employee">
          <Avatar
            class="employee__avatar"
            :name="selectedEmployee.j.name"
            :src="selectedEmployee.j.image"
            size="44px"
          />
          <div class="employee__badge">
            <h2 class="employee__title">
              <span>{{ selectedEmployee.j.name && selectedEmployee.j.name.length > 70? selectedEmployee.j.name.substring(0, 70) + '...' : selectedEmployee.j.name }}</span>
            </h2>
            <div v-if="selectedEmployee.j.category" class="employee__subtitle">
              {{ selectedEmployee.j.category }}
            </div>
          </div>
        </div>
      </div>
      <VLayout v-if="selectedEmployee && selectedEmployee.j" row class="main-table__times">
        <CalendarDayColumn
          v-for="(day, i) in selectedWeek"
          v-show="!i || displayMode === 'week'"
          :key="day.dateKey"
          :class="{ desktop: i }"
          :show-time="!i"
          :day="day"
          :holiday="isHoliday(day.dateKey)"
          :visits="dayVisits(day.dateKey, selectedEmployee)"
          :schedule="selectedEmployee.j.schedule.data[i]"
          :display-from="businessSchedule && businessSchedule.data && businessSchedule.data[i][0]"
          :display-to="businessSchedule && businessSchedule.data && businessSchedule.data[i][1]"
          @onSlotClick="onSlotClick"
        />
      </VLayout>
    </div>

    <VisitEdit
      v-if="currentVisit"
      :id="currentVisit.id"
      :visible="edit"
      :business-info="businessInfo"
      :employees="businessEmployees.filter(e => !!e.j.services)"
      :visit="currentVisit"
      :page="editVisitPage"
      @onSave="onVisitSave"
      @onDelete="onDelete(-1)"
      @close="edit=false; currentVisit = null"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Api from '@/api/backend'
import MainButton from '@/components/common/MainButton.vue'
import Avatar from '@/components/avatar/Avatar.vue'
import CalendarDayColumn from '@/components/calendar/CalendarDayColumn.vue'
import { formatDate, hyphenStrToDay, getWeek, visitInit } from '@/components/calendar/utils'
import VisitEdit from '@/components/calendar/VisitEdit.vue'
import { makeAlert } from '@/api/utils'
import Visit from '@/classes/visit'

import calendarMixin from '@/mixins/calendar'

export default {
  components: { Avatar, MainButton, CalendarDayColumn, /*VCalendar,*/ VisitEdit },
  mixins: [ calendarMixin ],
  data () {
    return {
      businessInfo: {},
      currentVisit: undefined,
      displayMode: 'week', /* day or week */
      edit: false,
      editVisitPage: undefined,
      selectedEmployee: {},
      newVisit: false,
      formActions: [
        { label: 'Добавить запись', action: 'newVisit', default: true }
      ],
      visits: []
    }
  },
  computed: {
    ...mapState({
      businessEmployees: state => state.business.businessEmployees
    }),
    ...mapGetters(['businessId', 'businessSchedule']),
    selectedDateObj () {
      return hyphenStrToDay(this.selectedDate)
    },
    selectedWeek () {
      if (!this.selectedDateObj) return []

      const date = this.selectedDateObj.date

      return getWeek(date.getFullYear(), date.getMonth(), this.selectedDateObj.display)
    }
  },
  watch: {
    '$route.params': {
      handler: 'fetchData',
      deep: true
    },
  },
  mounted () {
    // TODO проверить, не утекает ли память
    this.$root.$on('onAction', this.onAction)
    setTimeout(() => {
      this.fetchData()
      this.selectedEmployee = this.businessEmployees && this.businessEmployees[0]
    }, 2000)
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.onAction)
  },
  methods: {
    ...mapActions(['alert', 'setActions', 'setBusiness']),
    changeWeek (vector) {
      let dt = new Date(this.actualDate)

      dt.setDate(dt.getDate() + 7*vector)
      this.goDate(formatDate(dt))
    },
    fetchData () {
      if (!this.businessId) return
      this.setActions(this.formActions)

      if (!this.selectedWeek) return

      const sunday = this.selectedWeek[6]
      const nextMonday = new Date()

      nextMonday.setDate(sunday.date.getDate() + 1)

      Api()
        .get(`/visit?salon_id=eq.${this.businessId}&ts_begin=gt.${this.selectedWeek[0].dateKey}&ts_begin=lt.${formatDate(nextMonday)}`)
        .then(({ data }) => {
          this.visits = []
          data.forEach(v => this.visits.push(new Visit(v)))
        })


      /*if (this.selectedDate) {
        this.setActualDate(this.selectedDate)
      }
      const path = `visit?salon_id=eq.${this.businessId}`
      Api()
        .get(path)
        .then(res => res.data)
        .then(res => {
          this.visits = res
          this.setDateVisits()
        })*/

    },
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.newVisit = true
      }
    },
    onSelectEmployee (payload) {
      this.selectedEmployee = payload
    },
    onSlotClick (date) {
      this.currentVisit = visitInit()
      this.currentVisit.ts_begin = date.toISOString()
      this.edit = true
    },
    onVisitSave (payload) {
      this.editVisitPage = undefined
      this.sendData(payload)
        .then(() => {
          this.edit = false
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
    onDelete (id) {
      // todo check id
      this.edit = false
      Api()
        .delete(`visit?id=eq.${id}`)
        .then(() => {
          this.fetchData()
        })
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
  }
}
</script>

<style lang="scss">
  @import '../assets/styles/common';

  .visit-log {
    .header {
      display: none;
      justify-content: space-between;
      @media only screen and (min-width : $desktop) {
        display: flex;
      }
      
      &__info {
        display: flex;
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
    }

    .mobile {
      @media only screen and (min-width : $desktop) {
        visibility: hidden;  
        position: absolute;
        z-index: -1;
      }
    }
    .desktop {
      visibility: hidden; 
      position: absolute;
      z-index: -1;
      @media only screen and (min-width : $desktop) {
        visibility: visible;
        position: relative;
        z-index: auto;
      }
    }

    &__info-list {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      list-style: none;
      padding: 0 calc((100% - 630px) / 5) 0 56px;
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
      }

      &__times {
        padding-left: 58px;
        @media only screen and (min-width : $desktop) {
          padding-left: 70px;
        }
      }
    }

    .week-controls {
      display: none;
      position: absolute;
      left: 0;
      width: 125px;
      height: 82px;
      padding-left: 55px;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      box-shadow: -6px 2px 8px rgba(137, 149, 175, 0.1);
      @media only screen and (min-width : $desktop) {
        display: flex;
      }
      button {
        float: left;
        min-width: 0;
        width: 24px;
        height: 24px;
        border: 1px solid rgba(137, 149, 175, 0.1);
        border-radius: 50%;
        color: #8995AF;
      }
    }
    .employees {
      padding: 18px;
      background-color: #fff;
      @media only screen and (min-width : $desktop) {
        width: 55px;
        padding: 100px 8px 0;
      }
    }
    .employee {
      display: flex;
      justify-content: flex-start;
      align-items: center;

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
    }

  }
</style>
