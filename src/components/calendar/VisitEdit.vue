<template>
  <VDialog
    :value="visible"
    content-class="right-attached-panel businesscard-form" transition="slide"
    @input="$emit('close')"
  >
    <VForm class="right-attached-panel__container">
      <button type="button" class="right-attached-panel__close" @click="$emit('close')" />
      <div class="right-attached-panel__header">
        Создать запись
      </div>
      <!--<div class="right-attached-panel__field-block">
        <VSelect
          v-model="type"
          :items="types"
          label="Тип записи"
        />
      </div>-->
      <template>
        <!-- <div class="right-attached-panel__field-block">
          <VSelect
            v-model="position"
            :items="empCategories"
            label="Должность"
          />
        </div> -->
        <div class="right-attached-panel__field-block">
          <!--todo filter employees by selected service if any -->
          <VSelect
            v-model="selectedEmployee"
            :items="position? employees.filter(e => e.j.category === position) : employees"
            :item-text="e => e.j.name"
            return-object
            label="имя и фамилия мастера"
          />
        </div>
      </template>
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
            locale="ru-RU"
            no-title
            first-day-of-week="1"
          />
        </v-menu>
      </div>
      <div class="right-attached-panel__field-block">
        <TimeEdit
          enabled="!showSwitch || switchValue"
          :time="selectedTime"
          @onEdit="selectedTime = $event"
        />
      </div>

      <div v-if="message">
        {{ message }}
      </div>
      <div class="right-attached-panel__field-block _client-name">
        <VTextField
          v-if="visit.j"
          ref="clientName"
          v-model="visit.j.client.name"
          label="ИМЯ И ФАМИЛИЯ КЛИЕНТА"
          :rules="[() => !!visit.j.client.name || 'Это поле обязательно для заполнения']"
          required
          @input="onInputName"
        />
      </div>
      <div class="right-attached-panel__field-block">
        <PhoneEdit
          v-if="visit.j"
          :phone="visit.j.client.phone"
          :removable="false"
          @onEdit="onPhoneEdit($event)"
        />
      </div>
      <div class="right-attached-panel__field-block _reminder">
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
        <v-radio-group v-model="visit.j.color" column>
          <v-radio
            color="#DFC497"
            value="#DFC497"
          />
          <v-radio 
            color="#F3AA57"
            value="#F3AA57"
          />
          <v-radio 
            color="#85CA86"
            value="#85CA86"
          />
          <v-radio 
            color="#49C9B7"
            value="#49C9B7"
          />
          <v-radio 
            color="#5A96DF"
            value="#5A96DF"
          />
          <v-radio 
            color="#F36B6B"
            value="#F36B6B"
          />
          <v-radio 
            color="#F37F6B"
            value="#F37F6B"
          />
          <v-radio 
            color="#DF8CB2"
            value="#DF8CB2"
          />
          <v-radio 
            color="#B88AB2"
            value="#B88AB2"
          />
          <v-radio 
            color="#8589DF"
            value="#8589DF"
          />
        </v-radio-group>
      </div>
      <div class="right-attached-panel__buttons">
        <button type="button" class="right-attached-panel__save" :class="{ _disabled: saveDisabled }" @click="onSave">
          Сохранить
        </button>
        <button type="button" class="right-attached-panel__cancel" @click="$emit('close')">
          Отмена
        </button>
      </div>
    </VForm>
  </VDialog>
</template>

<script>
import PhoneEdit from '@/components/common/PhoneEdit.vue'
import TimeEdit from '@/components/TimeEdit.vue'
import {
  dateInLocalTimeZone,
  formatDate,
  formatTime,
  visitInit,
  hyphensStringToDate
} from '@/components/calendar/utils'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { PhoneEdit, TimeEdit },
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
    }
  },
  data () {
    return {
      active: 0,
      buttonCaptions: {
        next: 'Продолжить',
        save: 'Сохранить'
      },
      categoryOthersName: 'Прочие',
      error: '',
      message: '',
      position: null,
      reminders: [{
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
      serviceFilter: '',
      serviceHeaders: [
        { text: 'Услуга', value: 'name' },
        { text: 'Продолжительность', value: 'duration' },
        { text: 'Стоимость', value: 'price' }
      ],
      type: null,
      types: ['К мастеру', 'На услугу']
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices,
    }),
    ...mapGetters(['apiTimeZone', 'businessId', 'businessServiceCategories']),
    // empCategories () {
    //   return [
    //     ...new Set(
    //       this.employees &&
    //       this.employees.map(x => x.j && x.j.category)
    //     )
    //   ].filter(c => !!c).sort((a, b) => (a < b ? -1 : 1))
    // },
    duration () {
      const reducer = (accumulator, currentService) => accumulator + currentService.j.duration

      return this.selectedServices.reduce(reducer, 0)
    },
    tz () {
      return this.apiTimeZone
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
    saveDisabled () {
      return !this.visit.j.client
        || !this.visit.j.client.name 
        || !this.visit.j.client.phone 
        || !this.selectedServices 
        || !this.selectedServices.length 
        || !this.selectedDate 
        || !this.selectedTime
    }
  },
  watch: {
    visit: 'setSelectedValues',
    page: 'setPage'
  },
  mounted () {
    this.setSelectedValues()
  },
  methods: {
    onPhoneEdit (payload) {
      this.visit.j.client.phone = payload
    },
    onInputName (val) {
      if (!val) {
        return
      }
      const match = val.match(/[а-яА-ЯёЁ ]+/g)

      val = match? match[0] : ''
      this.visit.j.client.name = val
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
      this.visit.ts_begin = ts1.toJSON().slice(0, -1)
      this.visit.ts_end = ts2.toJSON().slice(0, -1)

      this.visit.j.services = this.selectedServices

      this.$emit('onSave', this.visit)
    },
    setClient (client) {
      if (client && (typeof client === 'object')) {
        const {
          id, 
          j
        } = client
        this.visit.j.client.id = id
        this.visit.j.client.name = j.name.fullname
        this.visit.j.client.phone = j.phone
      } else {
        this.visit.j.client.name = client
      }
    },
    setPage () {
      if (this.page !== undefined) {
        this.active = this.page
        this.message = 'На это время записаться нельзя. Выберите другое время'
      }
    },
    setSelectedValues () {
      if (this.visit.ts_begin) {
        let ts1 = new Date(this.visit.ts_begin)
        this.selectedDate = formatDate(ts1)
        this.selectedTime = formatTime(ts1)
      } else {
        this.selectedDate = ''
        this.selectedTime = ''
      }
      this.active = 0
    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/styles/right-attached-panel";

.table-select {
  color: #555;
  transition: all 0.5s ease-out;
}
.table-select:hover {
  background: #eee;
}
.table-selected {
  background: #ddd;
}
.scrolled {
  overflow: auto;
  max-height: 21em;
}
.right-attached-panel {
  ._service,
  ._client-name,
  ._reminder {
    position: relative;
  }
}
</style>
