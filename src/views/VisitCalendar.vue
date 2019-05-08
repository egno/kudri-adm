<template>
  <div class="visit-log">
    <div class="header">
      <div class="header__info">
        <ul class="info">
          <li class="info__item">
            В процессе/Завершен
          </li>
          <li class="info__item">
            Не пришел
          </li>
          <li class="info__item">
            Отмена
          </li>
          <li class="info__item">
            Выходной
          </li>
          <li class="info__item">
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
        class=""
      >
        <v-btn
          class="cal-next-prev"
          depressed
          flat
          small
          @click.stop="addMonth(-1)"
        >
          <v-icon>navigate_before</v-icon>
        </v-btn>
        <div class="">
          {{ dateMonthHeader }}
        </div>
        <v-btn
          class="cal-next-prev"
          depressed
          flat
          small
          @click.stop="addMonth(1)"
        >
          <v-icon>navigate_next</v-icon>
        </v-btn>
      </VLayout>
    </div>
    <div class="days">
      <div class="employees">
        <div class="employees__menu" />
        <div v-if="selectedEmployee && selectedEmployee.j">
          <Avatar
            class="employee-card__avatar"
            :name="selectedEmployee.j.name"
            :src="selectedEmployee.j.image"
            size="44px"
          />
          <div class="employee-card__badge">
            <h2 class="employee-card__title">
              <span>{{ selectedEmployee.j.name && selectedEmployee.j.name.length > 70? selectedEmployee.j.name.substring(0, 70) + '...' : selectedEmployee.j.name }}</span>
            </h2>
            <div v-if="selectedEmployee.j.category" class="employee-card__subtitle">
              {{ selectedEmployee.j.category }}
            </div>
          </div>
        </div>
      </div>
      <VLayout row>
        <CalendarDayColumn
          v-for="(day, i) in selectedWeek"
          :key="day.dateKey"
          class=""
          :show-time="!i"
          :day="day"
          :holiday="isHoliday(day.dateKey)"
          :visits="dayVisits(day.dateKey, selectedEmployee)"
          :schedule="getDateSchedule(day.dateKey)"
          :display-from="showTimes[0]"
          :display-to="showTimes[1]"
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
import calendarMixin from '@/mixins/calendar'
import Avatar from '@/components/avatar/Avatar.vue'
import CalendarDayColumn from '@/components/calendar/CalendarDayColumn.vue'
import { hyphenStrToDay, getWeek, visitInit } from '@/components/calendar/utils'
import VisitEdit from '@/components/calendar/VisitEdit.vue'
import { makeAlert } from '@/api/utils'
import Visit from '@/classes/visit'

export default {
  components: { Avatar, MainButton, CalendarDayColumn, /*VCalendar,*/ VisitEdit },
  mixins: [ calendarMixin ],
  data () {
    return {
      businessInfo: {},
      currentVisit: undefined,
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
    ...mapGetters(['businessId']),
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
    fetchData () {
      if (!this.businessId) return
      this.setActions(this.formActions)

      if (!this.selectedWeek) return

      Api()
        .get(`/visit?salon_id=eq.${this.businessId}&ts_begin=gt.${this.selectedWeek[0].dateKey}&ts_begin=lt.${this.selectedWeek[6].dateKey}`)
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
      display: flex;
      justify-content: space-between;
    }
    .calendar-controls {
      .v-btn {
        width: 55px;
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
        display: flex;
      }
    }

    .days {
      padding-left: 58px;
    }
  }
</style>
