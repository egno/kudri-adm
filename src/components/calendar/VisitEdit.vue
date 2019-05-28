<template>
  <VDialog
    :value="visible"
    content-class="right-attached-panel businesscard-form visit-edit" transition="slide"
    @input="$emit('close')"
  >
    <VForm ref="visitEditForm" class="right-attached-panel__container">
      <button type="button" class="right-attached-panel__close" @click="$emit('close')" />
      <div class="right-attached-panel__header">
        {{ visit.id? 'Изменить запись' : 'Создать запись' }}
      </div>
      <template v-if="!visit.id || !visit.j.client.phone">
        <input
          id="express"
          v-model="expressRecord"
          type="checkbox"
          value="express"
          class="filters__item right-attached-panel__sex"
        >
        <label for="express" class="right-attached-panel__checkbox-label">Экспресс-запись</label>
      </template>
      <div class="right-attached-panel__field-block">
        <!--todo filter employees by selected service if any -->
        <VSelect
          v-model="selectedEmployee"
          :items="employees"
          :item-text="e => e.j.name"
          return-object
          label="имя и фамилия мастера"
        />
      </div>
      <div class="right-attached-panel__field-block _service">
        <VSelect
          v-model="selectedServices"
          :items="selectedEmployee? businessServices.filter(s => s.j.employees && s.j.employees.includes(selectedEmployee.id)) : businessServices"
          :item-text="service => service.name.length > 30? service.name.substring(0, 30) + '...' : service.name"
          :required="true"
          return-object
          multiple
          chips
          deletable-chips
          label="ВЫБЕРИТЕ УСЛУГУ"
          attach=".right-attached-panel__field-block._service"
        />
      </div>
      <div class="right-attached-panel__field-block">
        <div class="right-attached-panel__field-name">
          Дата и время начала визита
        </div>
        <VLayout row justify-space-between>
          <v-menu>
            <template v-slot:activator="{ on }">
              <button
                type="button"
                v-on="on"
              >
                {{ selectedDayFormatted }}
              </button>
            </template>
            <v-date-picker
              v-model="selectedDate"
              :allowed-dates="allowedDates"
              locale="ru-RU"
              no-title
              first-day-of-week="1"
              @change="selectedTime = ''"
            />
          </v-menu>
          <div v-if="selectedTime" class="visit-edit__time">
            <div>{{ selectedTime }}</div>
            <button type="button" class="visit-edit__clear" @click="selectedTime = ''; message = ''; loadFreeTimes()" /> 
          </div>
        </VLayout>
      </div>
      <div v-if="!selectedTime" class="visit-edit__time-selection">
        <TimeSelect
          :selected-time="selectedTime"
          :times="freeTimes"
          @selectedTime="selectedTime = $event"
        />
      </div>

      <div v-if="message" class="error-message error--text">
        {{ message }}
      </div>
      <div v-if="!expressRecord" class="right-attached-panel__field-block _client-name">
        <VTextField
          v-if="visit.j"
          ref="clientName"
          :value="name"
          label="ИМЯ И ФАМИЛИЯ КЛИЕНТА"
          :rules="[() => !!name || 'Это поле обязательно для заполнения']"
          required
          @input="onInputName"
        />
      </div>
      <div v-if="!expressRecord" class="right-attached-panel__field-block">
        <PhoneEdit
          v-if="visit.j"
          :phone="phone"
          :removable="false"
          label="телефон"
          placeholder=""
          @onEdit="onPhoneEdit($event)"
        />
      </div>
      <div v-if="visit.id" class="right-attached-panel__field-block _reminder">
        <v-switch
          v-if="visit.isFuture"
          v-model="visit.status"
          label="Клиент подтвердил запись"
          color="#5BCD5E"
          value="confirmed"
        />
        <v-switch
          v-if="!visit.isFuture"
          v-model="visit.status"
          label="Клиент не пришел"
          color="#EF4D37"
          value="unvisited"
        />
        <v-switch
          v-if="visit.isFuture"
          v-model="visit.status"
          label="Клиент отменил запись"
          color="#8995AF"
          value="canceled"
        />
      </div>
      <div v-if="!expressRecord" class="right-attached-panel__field-block _reminder">
        <VSelect
          v-model="visit.j.remind"
          :items="reminders"            
          label="напоминание"
          attach=".right-attached-panel__field-block._reminder"
        />
      </div>
      <div class="right-attached-panel__field-block">
        <v-textarea
          v-model="visit.j.notes"
          label="Комментарий"
          maxlength="500" 
          counter="500"
          auto-grow
          rows="1"
        />
      </div>
      <div class="right-attached-panel__field-block">
        <div class="right-attached-panel__field-name">
          Цветовое выделение
        </div>
        <div class="visit-edit__colors">
          <div v-for="color in colors" :key="color" class="visit-edit__color-block">
            <input :id="color" v-model="visit.j.color" type="radio" :value="`#${color}`">
            <label :for="color" class="visit-edit__color-label">
              <div :style="{ background: `#${color}` }" />
            </label>
          </div>
        </div>
      </div>
      <div class="right-attached-panel__buttons">
        <button type="button" class="right-attached-panel__save" :class="{ _disabled: saveDisabled }" @click="onSave">
          Сохранить
        </button>
        <button type="button" class="right-attached-panel__cancel" @click="$emit('close')">
          Отмена
        </button>
        <button 
          v-if="visit.status === 'canceled' || visit.status === 'unvisited' || visit.displayStatus === 'Завершен'" 
          type="button" 
          class="right-attached-panel__delete" 
          @click="$emit('delete')"
        >
          Удалить запись 
        </button>
      </div>
    </VForm>
  </VDialog>
</template>

<script>
import PhoneEdit from '@/components/common/PhoneEdit.vue'
import TimeSelect from '@/components/calendar/TimeSelect.vue'
import {
  dateInLocalTimeZone,
  formatDate,
  formatTime,
  visitInit,
  hyphensStringToDate
} from '@/components/calendar/utils'
import { mapState, mapGetters, mapActions } from 'vuex'
import Api from '@/api/backend'
import { isEqual } from 'lodash'
import { makeAlert } from '@/api/utils'

export default {
  components: { PhoneEdit, TimeSelect },
  model: {
    prop: 'visible',
    event: 'close'
  },
  props: {
    id: { type: String, default: '' },
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    visit: {
      type: Object,
      default () {
        return visitInit()
      }
    },
    page: { type: Number, default: null },
    employees: { type: Array,
      default () {
        return []
      }
    },
    employee: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      active: 0,
      colors: ['DFC497', 'F3AA57', '85CA86', '49C9B7', '5A96DF', 'F36B6B', 'F37F6B', 'DF8CB2', 'B88AB2', '8589DF'],
      error: '',
      expressRecord: false,
      freeTimes: [],
      message: '', 
      name: '',
      phone: '',
      reminders: [
        {
          value: 60, 
          text: 'За час'
        }, {
          value: 180, 
          text: 'За 3 часа'
        }, {
          value: 360, 
          text: 'За 6 часов'
        }, {
          value: 720, 
          text: 'За 12 часов'
        }, {
          value: 1440, 
          text: 'За сутки'
        }, {
          value: null, 
          text: 'Не напоминать'
        }
      ],
      selectedDate: null,
      selectedEmployee: null,
      selectedServices: [],
      selectedTime: null,
      lastFreeTimesRequest: {}
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices,
    }),
    ...mapGetters(['businessId', 'businessServiceCategories']),
    duration () {
      const reducer = (accumulator, currentService) => accumulator + currentService.j.duration

      return this.selectedServices.reduce(reducer, 0)
    },
    selectedDayFormatted () {
      if (!this.selectedDate) return ''
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }
      return hyphensStringToDate(this.selectedDate).toLocaleString("ru",options)
    }, 
    hasPhone () {  
      return this.phone.length >= 10
    }, 
    saveDisabled () {
      return this.message
        || (!this.expressRecord && this.name.length < 3)
        || (!this.expressRecord && !this.hasPhone)
        || !(this.visit.j.client
        && this.selectedServices 
        && this.selectedServices.length 
        && this.selectedDate 
        && this.selectedTime)
    }, 
    todayString () {
      return formatDate(new Date())
    }
  },
  watch: {
    visit: 'setSelectedValues',
    page: 'setPage',
    employee () {
      if (this.employee.j.services && this.employee.j.services.length) { 
        this.selectedEmployee = this.employee
        this.loadFreeTimes() 
      }
    },
    selectedDate: 'loadFreeTimes',
    'selectedServices.length': 'loadFreeTimes'
  },
  mounted () {
    this.setSelectedValues()
  },
  methods: {
    ...mapActions(['alert']),
    allowedDates (dateStr) {
      return dateStr > this.todayString
    },
    loadFreeTimes () {
      if (!(this.businessId && this.selectedDate)) return

      let params = {
        dt: `${this.selectedDate}${this.selectedTime? 'T' + this.selectedTime + ':00': ''}`,
        business_id: this.businessId
      }

      if (this.selectedEmployee) {
        params.employee_id = this.selectedEmployee.id
      }
      if (this.selectedServices.length) {
        params.duration = this.duration
      }
      if (isEqual(this.lastFreeTimesRequest, params)) {
        return
      }
      this.lastFreeTimesRequest = params
      this.message = ''
      this.loadingTimes = true
      Api()
        .post("rpc/free_times", params)
        .then(({ data }) => {
            this.freeTimes = data
            if (!this.freeTimes.length) {
              this.message = 'На эту дату или время записаться нельзя. Выберите другую дату или время'

              if (this.selectedServices.length > 1) {
                this.message += ', или уменьшите количество услуг'
              }
            }
          }
        )
        .catch(err => {
          this.alert(makeAlert(err))
        })
        .finally(() => {
          this.loadingTimes = false
        })
    },
    onPhoneEdit (payload) {
      this.phone = payload
    },
    onInputName (val) {
      if (!val) {
        return
      }
      const match = val.match(/[а-яА-ЯёЁ ]+/g)

      val = match? match[0] : ''
      this.name = val
      this.$refs.clientName.lazyValue = val
    },
    onSave () {
      const duration = this.duration
      const ts1 = dateInLocalTimeZone(
        new Date(`${this.selectedDate} ${this.selectedTime}`)
      )
      let ts2 = new Date()
      ts2.setTime(ts1.getTime() + 60000 * duration) 
      this.visit.business_id = this.selectedEmployee? this.selectedEmployee.id : this.businessId
      this.visit.j.duration = duration
      this.visit.j.client.name = this.expressRecord? null : this.name.trim()
      this.visit.j.client.phone = this.expressRecord? null : this.phone.trim()
      this.visit.ts_begin = ts1.toJSON().slice(0, -1)
      this.visit.ts_end = ts2.toJSON().slice(0, -1)

      this.visit.j.services = this.selectedServices
      if (!this.visit.j.color) {
        this.visit.j.color = '#' + this.colors[Math.floor(Math.random() * this.colors.length)]
      }

      this.$emit('onSave', this.visit)
    },
    setPage () {
      if (this.page !== undefined) {
        this.active = this.page
        this.message = 'На эту дату или время записаться нельзя. Выберите другую дату или время'
        if (this.selectedServices.length > 1) {
          this.message += ', или уменьшите количество услуг'
        }
      }
    },
    setSelectedValues () {
      this.$refs.visitEditForm.resetValidation()
      if (this.visit.ts_begin) {
        let ts1 = new Date(this.visit.ts_begin)
        this.selectedDate = formatDate(ts1)
        this.selectedTime = formatTime(ts1)
      } else {
        this.selectedDate = ''
        this.selectedTime = ''
      }
      this.active = 0
      if (this.visit.services && this.visit.services.length) {
        const visitServices = this.visit.services.map(s => s.id)

        this.selectedServices = this.businessServices.filter(s => visitServices.includes(s.id))
      } else {
        this.selectedServices = []
      }

      if (this.visit.j && this.visit.j.master) {
        this.selectedEmployee = this.employees.find(e => e.id === this.visit.j.master.id)
      } else if (this.employee.j.services && this.employee.j.services.length) { 
        this.selectedEmployee = this.employee 
      } 
      if (this.visit.clientName) {
        this.name = this.visit.clientName
      } else {
        this.name = ''
      }
      if (this.visit.clientPhone) {
        this.phone = this.visit.clientPhone
      } else {
        this.phone = ''
      }
      if (this.visit.id && !this.visit.clientPhone) {
        this.expressRecord = true
      }
      this.loadFreeTimes()
    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/styles/right-attached-panel";
.visit-edit.right-attached-panel {
  ._service,
  ._client-name,
  ._reminder {
    position: relative;
  }

  input[type="radio"] {
    display: none;
    &:checked + label {
      background-color: rgba(137, 149, 175, 0.2);
    }
  }
  .visit-edit__colors {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 10px;
    margin-top: 20px;
  }
  .visit-edit__color-label {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin: 0 6px;
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;
    &>div {
      height: 24px;
      border-radius: 50%;
    }
  }
  .visit-edit__time-selection {
    margin-top: 30px;
  }
  .visit-edit__time {
    display: flex;
    margin-left: 10px;
  }
  .visit-edit__clear {
    width: 16px;
    height: 16px;
    margin-left: 7px;
    cursor: pointer;
    background: url('../../assets/images/svg/cross.svg') center no-repeat;
  }
  .right-attached-panel__buttons {
    margin-top: 50px;
  }
  .right-attached-panel__checkbox-label {
    margin: 28px auto 20px;
    padding: 0 50px;
    height: 24px;
    line-height: 24px;
  }
  .error-message {
    margin-top: 10px;
  }
}
</style>
