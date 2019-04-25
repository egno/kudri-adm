<template>
  <VCard flat>
    <AppTabs
      v-model="active"
      fixed-tabs
    >
      <v-tab
        key="t-0"
        ripple
      >
        <v-layout column>
          <v-flex>Услуга</v-flex>
          <v-flex class="caption text-none grey--text">
            {{ visit.j && visit.j.services && visit.j.services[0] && visit.j.services[0].name }}
          </v-flex>
        </v-layout>
      </v-tab>
      <v-tab
        key="t-1"
        ripple
      >
        <v-layout column>
          <v-flex>Дата и время</v-flex>
          <v-flex class="caption text-none grey--text">
            {{ displaySelectedTime }}
          </v-flex>
        </v-layout>
      </v-tab>
      <v-tab
        key="t-2"
        ripple
      >
        <v-layout column>
          <v-flex>Клиент</v-flex>
          <v-flex class="caption text-none grey--text">
            {{ displayClient }}
          </v-flex>
        </v-layout>
      </v-tab>
      <v-tab-item key="ti-0">
        <VCard flat>
          <v-card-text>
            <v-layout column>
              <v-flex>
                <v-layout row>
                  <v-flex>
                    <VSelect
                      v-model="selectedCategory"
                      :items="businessServiceCategories"
                      clearable
                      label="Категория"
                    />
                  </v-flex>
                  <v-flex>
                    <VTextField
                      v-model="serviceFilter"
                      label="Поиск услуги"
                      clearable
                    />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex class="scrolled">
                <v-layout column>
                  <v-flex
                    v-for="(service, i) in filteredServices"
                    :key="i"
                    class="table-select"
                    py-2
                    px-1
                    @click="visit.j.services=[service]"
                  >
                    <v-layout row>
                      <v-flex xs10>
                        {{ service.name }}
                      </v-flex>
                      <v-flex
                        xs1
                        text-xs-center
                      >
                        {{ service.duration ? service.duration + ' мин.' : '-' }}
                      </v-flex>
                      <v-flex
                        xs1
                        text-xs-right
                      >
                        {{ service.price }}
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </VCard>
      </v-tab-item>
      <v-tab-item key="ti-1">
        <VCard flat>
          <v-card-text>
            <v-layout row>
              <v-flex>
                <v-date-picker
                  v-model="selectedDate"
                  locale="ru-RU"
                  no-title
                  first-day-of-week="1"
                />
              </v-flex>
              <v-flex>
                <v-time-picker
                  v-model="selectedTime"
                  format="24hr"
                />
              </v-flex>
              <v-flex />
            </v-layout>
          </v-card-text>
          <v-card-text v-if="message">
            {{ message }}
          </v-card-text>
        </VCard>
      </v-tab-item>
      <v-tab-item key="ti-2">
        <VCard flat>
          <v-card-text>
            <VTextField
              v-if="visit.j"
              v-model="visit.j.client.name"
              label="Имя"
              prepend-icon="account_box"
              :rules="[() => !!visit.j.client.name || 'Это поле обязательно для заполнения']"
              required
            />
            <PhoneEdit
              v-if="visit.j"
              :phone="visit.j.client.phone"
              @onEdit="onPhoneEdit($event)"
            />
          </v-card-text>
        </VCard>
      </v-tab-item>
    </AppTabs>
    <VCardActions>
      <VSpacer />
      <VBtn
        color="primary"
        @click="onNextButton"
      >
        {{ tabButtonCaption }}
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script>
import PhoneEdit from '@/components/common/PhoneEdit.vue'
import AppTabs from '@/components/common/AppTabs.vue'
import {
  dateInLocalTimeZone,
  formatDate,
  formatTime,
  visitInit
} from '@/components/calendar/utils'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { AppTabs, PhoneEdit },
  props: {
    id: { type: String, default: '' },
    businessInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    employee: { type: String, default: '' },
    visit: {
      type: Object,
      default () {
        return visitInit()
      }
    },
    page: { type: Number, default: null },
    master: {
      type: Object,
      default () {
        return {}
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
      tabsLength: 3,
      message: '',
      selectedCategory: '',
      selectedDate: null,
      selectedTime: null,
      serviceFilter: '',
      serviceHeaders: [
        { text: 'Услуга', value: 'name' },
        { text: 'Продолжительность', value: 'duration' },
        { text: 'Стоимость', value: 'price' }
      ]
    }
  },
  computed: {
    ...mapState({
      businessServices: state => state.business.businessServices,
    }),
    ...mapGetters(['apiTimeZone', 'businessServiceCategories']),
    isLastTab () {
      return this.active === this.tabsLength - 1
    },
    displayClient () {
      if (!this.visit.j) {
        return ''
      }
      return this.visit.j.client.name || this.visit.j.client.phone
    },
    displaySelectedTime () {
      if (!this.selectedDate) {
        return null
      }
      return `${this.selectedDate} ${
        this.selectedTime ? this.selectedTime : ''
      }`
    },
    duration () {
      return (
        this.visit &&
        this.visit.j &&
        this.visit.j.services &&
        this.visit.j.services.reduce(
          (acc, val) => parseInt(val.duration) || 60,
          0
        )
      )
    },
    filteredServices () {
      return this.businessServices && this.businessServices.filter(
        x =>
          (!this.selectedCategory || x.category === this.selectedCategory) &&
          (!this.serviceFilter ||
            x.name.toUpperCase().indexOf(this.serviceFilter.toUpperCase()) + 1)
      )
    },
    tabButtonCaption () {
      return this.isLastTab
        ? this.buttonCaptions.save
        : this.buttonCaptions.next
    },
    tz () {
      return this.apiTimeZone
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
    nextTab () {
      const active = parseInt(this.active)
      this.active = (active + 1) % this.tabsLength
    },
    onNextButton () {
      if (this.isLastTab) {
        this.onSave()
      } else {
        this.nextTab()
      }
    },
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
      this.visit.business_id = this.employee || this.businessInfo.id
      this.visit.j.duration = duration
      this.visit.ts_begin = ts1.toJSON().slice(0, -1)
      this.visit.ts_end = ts2.toJSON().slice(0, -1)
      this.visit.j.master = this.master.id
      this.$emit('onSave', this.visit)
    },
    setPage () {
      if (this.page !== undefined) {
        this.active = this.page
        this.message = 'На это время записаться нельзя. Выберите другое время'
      }
    },
    setSelectedValues () {
      // console.log(this.tz);
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

<style>
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
