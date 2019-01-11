<template>
  <VCard flat>
    <v-tabs
      v-model="active"
      fixed-tabs
    >
      <v-tab
        key="0"
        ripple
      >
        <v-layout column>
          <v-flex>Услуга</v-flex>
          <v-flex class="caption text-none grey--text">
            {{ item.client.service.name }}
          </v-flex>
        </v-layout>
      </v-tab>
      <v-tab
        key="1"
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
        key="2"
        ripple
      >
        Клиент
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
                      :items="categories"
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
                    @click="item.client.service=service"
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
        </VCard>
      </v-tab-item>
      <v-tab-item key="ti-2">
        <VCard flat>
          <v-card-text>
            <VTextField
              v-model="item.client.name"
              label="Имя"
              prepend-icon="account_box"
              :rules="[() => !!item.client.name || 'Это поле обязательно для заполнения']"
              required
            />
            <PhoneEdit
              phone="item.client.phone"
              @onEdit="onPhoneEdit($event)"
            />
          </v-card-text>
        </VCard>
      </v-tab-item>
    </v-tabs>
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
import PhoneEdit from '@/components/business/PhoneEdit.vue';
import { visitInit } from '@/components/calendar/utils';

export default {
  components: { PhoneEdit },
  props: {
    businessInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    item: {
      type: Object,
      default() {
        return visitInit();
      }
    }
  },
  data() {
    return {
      active: 0,
      buttonCaptions: {
        next: 'Продолжить',
        save: 'Сохранить'
      },
      categoryOthersName: 'Прочие',
      tabsLength: 3,
      selectedCategory: '',
      selectedDate: null,
      selectedTime: null,
      serviceFilter: '',
      serviceHeaders: [
        { text: 'Услуга', value: 'name' },
        { text: 'Продолжительность', value: 'duration' },
        { text: 'Стоимость', value: 'price' }
      ]
    };
  },
  computed: {
    isLastTab() {
      return this.active === this.tabsLength - 1;
    },
    categories() {
      return [...new Set(this.services.map(x => x.category))];
    },
    displaySelectedTime() {
      if (!this.selectedDate) {
        return null;
      }
      return `${this.selectedDate} ${
        this.selectedTime ? this.selectedTime : ''
      }`;
    },
    filteredServices() {
      return this.services.filter(
        x =>
          (!this.selectedCategory || x.category === this.selectedCategory) &&
          (!this.serviceFilter ||
            x.name.toUpperCase().indexOf(this.serviceFilter.toUpperCase()) + 1)
      );
    },
    services() {
      if (!(this.businessInfo && this.businessInfo.j)) {
        return [];
      }
      return this.businessInfo.j.services.map(x => {
        x.category = x.category || this.categoryOthersName;
        return x;
      });
    },
    tabButtonCaption() {
      return this.isLastTab
        ? this.buttonCaptions.save
        : this.buttonCaptions.next;
    }
  },
  methods: {
    nextTab() {
      const active = parseInt(this.active);
      this.active = (active + 1) % this.tabsLength;
    },
    onNextButton() {
      if (this.isLastTab) {
        this.onSave();
      } else {
        this.nextTab();
      }
    },
    onPhoneEdit(payload) {
      this.item.client.phone = payload;
    },
    onSave() {
      const duration = parseInt(this.item.client.service.duration) || 60;
      const ts1 = new Date(`${this.selectedDate} ${this.selectedTime}`);
      let ts2 = new Date();
      ts2.setTime(ts1.getTime() + 60000 * duration);
      console.log(ts1, ts2, duration);
      this.item.business_id = this.businessInfo.id;
      this.item.client.service.duration = duration;
      this.item.ts_begin = ts1.toISOString();
      this.item.ts_end = ts2.toISOString();
      this.$emit('onSave', this.item);
    }
  }
};
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
