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
      <div class="right-attached-panel__field-block">
        <VSelect
          v-model="type"
          :items="types"
          label="Тип записи"
        />
      </div>
      <template v-if="type === 'К мастеру'">
        <div class="right-attached-panel__field-block">
          <VSelect
            v-model="position"
            :items="empCategories"
            label="Должность"
          />
        </div>
        <div v-if="type === 'К мастеру'" class="right-attached-panel__field-block">
          <VSelect
            v-model="selectedEmployee"
            :items="position? employees.filter(e => e.j.category === position) : employees"
            :item-text="e => e.j.name"
            return-object
            label="имя и фамилия мастера"
          />
        </div>
      </template>
      <div v-if="type==='На услугу' || selectedEmployee " class="right-attached-panel__field-block _service">
        <VSelect
          v-model="selectedServices"
          :items="selectedEmployee? selectedEmployee.j.services : businessServices"
          :item-text="service => service.name.length > 30? service.name.substring(0, 30) + '...' : service.name"
          :required="true"
          return-object
          multiple
          chips
          deletable-chips
          label="ВЫБЕРИТЕ УСЛУГУ"
          attach=".right-attached-panel__field-block._service"
          @select="selectedServices = $event"
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
      <div class="right-attached-panel__field-block">
        <VTextField
          v-if="visit.j"
          v-model="visit.j.client.name"
          label="Имя"
          prepend-icon="account_box"
          :rules="[() => !!visit.j.client.name || 'Это поле обязательно для заполнения']"
          required
        />
      </div>
      <div class="right-attached-panel__field-block">
        <PhoneEdit
          v-if="visit.j"
          :phone="visit.j.client.phone"
          @onEdit="onPhoneEdit($event)"
        />
      </div>
      <div class="right-attached-panel__buttons">
        <button type="button" class="right-attached-panel__save" :class="{ _disabled: false }" @click="onSave">
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
    businessInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    employee: { type: String, default: '' },
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
      selectedEmployee: null,
      selectedDate: null,
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
    ...mapGetters(['apiTimeZone', 'businessServiceCategories']),
    empCategories () {
      return [
        ...new Set(
          this.employees &&
          this.employees.map(x => x.j && x.j.category)
        )
      ].filter(c => !!c).sort((a, b) => (a < b ? -1 : 1))
    },
    duration () {
      const services = this.businessServices.filter(s => this.selectedServices.includes(s.id))
      const reducer = (accumulator, currentService) => accumulator + currentService.j.duration

      return services.reduce(reducer, 0)
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
    onSave () {
      const duration = this.duration
      const ts1 = dateInLocalTimeZone(
        new Date(`${this.selectedDate} ${this.selectedTime}`)
      )
      let ts2 = new Date()
      ts2.setTime(ts1.getTime() + 60000 * duration)
      this.visit.business_id = this.selectedEmployee.id
      this.visit.j.duration = duration
      this.visit.ts_begin = ts1.toJSON().slice(0, -1)
      this.visit.ts_end = ts2.toJSON().slice(0, -1)

      this.visit.j.services = this.selectedServices

      this.$emit('onSave', this.visit)
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
</style>
