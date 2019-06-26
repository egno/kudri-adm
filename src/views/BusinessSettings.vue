<template>
  <PageLayout
    :is-edit-mode="true"
    :is-edit-visible="false"
    :template="{ headerText: 'Настройки', buttonText: '' }"
    class="businesscard-form settings"
  >
    <template slot="content">
      <AppTabs v-model="activeTab">
        <v-tab
          :key="0"
          ripple
        >
          Уведомления
        </v-tab>
        <v-tab
          :key="1"
          ripple
        >
          Оператор рассылки
        </v-tab>
        <v-tab
          :key="2"
          ripple
        >
          Журнал сообщений
        </v-tab>
      </AppTabs>
      <div :class="['tab-content', 'log', { wide: activeTab === 2 }]">
        <v-form ref="form">
          <div
            v-show="activeTab === 0"
            class="infocard _edit"
          >
            <div class="infocard__content">
              <v-layout
                align-left
                column
              >
                <v-flex pb-3>
                  <h3>Настройте необходимые вам события рассылки уведомлений</h3>
                </v-flex>
                <v-flex
                  v-for="(event, i) in businessSettings.notifications.events"
                  :key="i"
                >
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      xs12
                      md8
                    >
                      <v-switch
                        v-model="event.enabled"
                        :label="event.title"
                        color="blue"
                      />
                    </v-flex>
                    <v-flex
                      v-if="event.enabled "
                      offset-xs1
                      xs11
                      sm8
                    >
                      <v-card flat>
                        <v-card-text v-if="typeof event.phone !== 'undefined'">
                          <PhoneEdit
                            :phone="event.phone"
                            label="Телефон для уведомлений"
                            @onEdit="event.phone = $event"
                          />
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <MainButton
                color="success"
                class="button save-info"
                @click.native.prevent="save"
              >
                Сохранить
              </MainButton>
            </div>
          </div>
          <div
            v-show="activeTab === 1"
            class="infocard _edit"
          >
            <div class="infocard__content">
              <ProviderSettings
                :provider="businessSettings && businessSettings.notifications && businessSettings.notifications.provider"
                @change="businessSettings.notifications.provider = $event; save()"
              />
            </div>
          </div>
          <div>
            <v-data-table
              v-show="activeTab === 2"
              :headers="headers"
              :items="items"
              :loading="isLoading"
              :pagination.sync="pagination"
              :total-items="totalItems"
              class="elevation-0 sms"
              sort-icon="mdi-menu-down"
              hide-actions
              must-sort
            >
              <template
                slot="items"
                slot-scope="props"
              >
                <td class="sms__event-name">
                  {{ props.item.name }}
                </td>
                <td class="sms__receiver">
                  <div class="sms__receiver-phone">
                    {{ props.item.receiver.phone | phoneFormat }}
                  </div>
                  <div class="sms__receiver-operator">
                    {{ props.item.receiver.operator }}
                  </div>
                </td>
                <td class="sms__total">
                  <div class="sms__total-price">
                    {{ props.item.totalPrice }} рублей
                  </div>
                  <div class="sms__length">
                    {{ props.item.length }} SMS
                  </div>
                </td>
                <td>
                  <div>ID {{ props.item.numberId }}</div>
                  <div class="sms__time">
                    {{ getTime(props.item.time) }}
                  </div>
                </td>
                <td>
                  <v-tooltip
                    v-if="props.item.status.code === 'not_delivered'"
                    top
                  >
                    <template v-slot:activator="{ on }">
                      <div class="sms__status not_delivered" v-on="on">
                        Не доставлено
                      </div>
                    </template>
                    <span>{{ props.item.status.display }}</span>
                  </v-tooltip>

                  <div v-else :class="['sms__status', { [props.item.status.code]: true }]">
                    {{ props.item.status.display }}
                  </div>
                </td>
                <td>
                  <div class="sms__update" @click="update(props.item.id)" />
                </td>
              </template>
            </v-data-table>
          </div>
        </v-form>
      </div>
    </template>
  </PageLayout>
</template>

<script>
import BusinessSettings from '@/classes/business_settings'
import { mapGetters } from 'vuex'
import PhoneEdit from '@/components/common/PhoneEdit.vue'
import MainButton from '@/components/common/MainButton.vue'
import AppTabs from '@/components/common/AppTabs.vue'
import PageLayout from '@/components/common/PageLayout.vue'
import ProviderSettings from '@/components/provider/ProviderSettings.vue'
import { displayRESTDate, displayRESTTime } from '@/components/calendar/utils'

export default {
  components: { AppTabs, PhoneEdit, MainButton, PageLayout, ProviderSettings },
  data () {
    return {
      activeTab: 0,
      businessSettings: new BusinessSettings(),
      headers: [
        { text: 'Событие', value: 'name' },
        { text: 'Телефон получателя', value: 'receiver->phone' },
        { text: 'Стоимость', value: 'totalPrice', class: '' },
        { text: 'Идентификатор', value: 'numberId', },
        { text: 'Статус сообщения', value: 'status->code', },
        { text: 'Обновить все', value: '', sortable: false, width: '80px', class: 'sms__update' }
      ],
      items: [
        {
          id: "b2177622-8e5b-11e9-b72c-eb1d767cd701",
          numberId: 1234567890,
          name: 'Запрос Клиенту на подтверждение номера телефона',
          receiver: {
            phone: '71005001213',
            operator: 'МТС'
          },
          length: 2,
          time: '2019-05-06T18:00:00',
          status: {
            code: 'sent',
            display: 'Отправлено'
          },
          totalPrice: 12
        },
        {
          id: "b2177622-8e5b-11e9-b72c-eb1d767cd702",
          numberId: 1234567890,
          name: 'О новой онлайн-записи',
          receiver: {
            phone: '71005001213',
            operator: 'Мегафон Сибирь'
          },
          length: 2,
          time: '2019-05-06T18:00:00',
          status: {
            code: 'delivered',
            display: 'Доставлено'
          },
          totalPrice: 12
        },
        {
          id: "b2177622-8e5b-11e9-b72c-eb1d767cd703",
          numberId: 1234567890,
          name: 'Об отмене онлайн-записи',
          receiver: {
            phone: '71005001213',
            operator: 'Мегафон Сибирь'
          },
          length: 2,
          time: '2019-05-06T18:00:00',
          status: {
            code: 'delivered',
            display: 'Доставлено'
          },
          totalPrice: 12
        },
        {
          id: "b2177622-8e5b-11e9-b72c-eb1d767cd704",
          numberId: 1234567890,
          name: 'Напоминание о предстоящем визите',
          receiver: {
            phone: '71005001213',
            operator: 'Мегафон Сибирь'
          },
          length: 2,
          time: '2019-05-06T18:00:00',
          status: {
            code: 'delivered',
            display: 'Доставлено'
          },
          totalPrice: 12
        },
        {
          id: "b2177622-8e5b-11e9-b72c-eb1d767cd705",
          numberId: 1234567890,
          name: 'Денежные средства заканчиваются',
          receiver: {
            phone: '71005001213',
            operator: 'Мегафон Сибирь'
          },
          length: 2,
          time: '2019-05-06T18:00:00',
          status: {
            code: 'not_delivered',
            display: 'Номер телефона абонента недоступен'
          },
          totalPrice: 12
        },
        {
          id: "b2177622-8e5b-11e9-b72c-eb1d767cd706",
          numberId: 1234567890,
          name: 'Денежные средства заканчиваются',
          receiver: {
            phone: '71005001213',
            operator: 'Мегафон Сибирь'
          },
          length: 2,
          time: '2019-05-06T18:00:00',
          status: {
            code: 'not_delivered',
            display: 'Абонент с таким номером не существует'
          },
          totalPrice: 12
        },
        {
          id: "b2177622-8e5b-11e9-b72c-eb1d767cd707",
          numberId: 1234567890,
          name: 'Рекламное сообщение',
          receiver: {
            phone: '71005001213',
            operator: 'Мегафон Сибирь'
          },
          length: 2,
          time: '2019-05-06T18:00:00',
          status: {
            code: 'delivered',
            display: 'Доставлено'
          },
          totalPrice: 12
        }
      ],
      isLoading: false,
      pagination: { rowsPerPage: 20 },
      totalItems: 3
    }
  },
  computed: {
    ...mapGetters(['businessId'])
  },
  watch: {
    businessId: 'load'
  },
  mounted () {
    this.load()
    const updateElement = this.$el.querySelector('th.sms__update')

    if (updateElement) {
      updateElement.addEventListener('click', this.updateAll)
    }
  },
  beforeDestroy () {
    const updateElement = this.$el.querySelector('th.sms__update')

    if (updateElement) {
      updateElement.removeEventListener('click', this.updateAll)
    }
  },
  methods: {
    load () {
      if (!this.businessId) return
      this.businessSettings.load(this.businessId)
    },
    getTime (ts) {
      return `${displayRESTDate(ts)} ${displayRESTTime(ts)}`
    },
    save () {
      this.businessSettings.save()
    },
    update (id) {
      console.log(id)
    },
    updateAll () {
      console.log('sdlfjsjdf')
    }
  }
}
</script>

<style lang="scss">
@import '../assets/styles/settings';
@import '../assets/styles/businesscard-form';

.settings {
  .page-layout__content {
    background-color: #fff;
  }
  .v-tabs__item {
    padding: 0 10px;
  }
  .tab-content {
    @media only screen and (min-width: $desktop) {
      padding-left: 127px;
    }
    &.wide {
      @media only screen and (min-width: $desktop) {
        padding-left: 0;
      }
    }
    &.log {
      position: relative;
      padding-left: 210px;
      padding-top: 36px;
      overflow-x: auto;
      background-color: rgba(137, 149, 175, 0.1);;
    }
    .infocard._emp-serv {
      max-width: 100%;
      width: auto;
      .infocard__content {
        max-width: 100%;
      }
    }
  }

  .sms {
    * {
      color: #07101C;
      font-size: 14px;
    }
    &__event-name {
      position: absolute;
      left: 0;
      width: 210px;
      height: 88px;
      font-weight: bold;
    }
    &__receiver-phone {
      font-weight: bold;
    }
    &__receiver-operator {
      margin-top: 5px;
      color: #8995AF;
    }
    &__length {
      font-size: 12px;
      color: #8995AF;
    }
    &__time {
      font-size: 12px;
      color: #8995AF;
    }
    &__status {
      white-space: nowrap;

      &:before {
        display: inline-block;
        vertical-align: sub;
        width: 16px;
        height: 16px;
        margin-right: 5px;
        content: '';
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }

      &.sent {
        color: #8995AF;
        &:before {
          background-image: url('../assets/images/svg/clock_opacity_1.svg');
        }
      }
      &.delivered {
        color: #5BCD5E;
        &:before {
          width: 19px;
          background-image: url('../assets/images/delivered.png');
        }
      }
      &.not_delivered {
        color: #EF4D37;
        &:before {
          background-image: url('../assets/images/error.png');
        }
        &:after {
          display: inline-block;
          vertical-align: middle;
          width: 14px;
          height: 14px;
          margin-left: 5px;
          content: '';
          background: url('../assets/images/svg/question.svg') center no-repeat;
        }
      }
    }
    &__update {
      text-align: center;
      cursor: pointer;

      &:after {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('../assets/images/update.png') center/contain no-repeat;
        content: '';
        opacity: 0.5;
      }
    }
    thead {
      background-color: rgba(137, 149, 175, 0.2);
      tr:first-child {
        height: 40px;
        border-bottom: none;
        th {
          color: #8995AF !important;
          font-size: 12px !important;
          &:first-child {
            position: absolute;
            left: 0;
            width: 210px;
            height: 40px;
            display: flex;
            align-items: center;
            padding-left: 35px;
            background-color: rgba(137, 149, 175, 0.1);
            @media only screen and (min-width: $desktop) {
              padding-left: 56px !important;
            }
          }
          &.sortable i {
            color: #8995AF !important;
            vertical-align: top;
          }
          &.sms__update:after {
            margin-left: 5px;
            opacity: 1;
          }
        }
      }
    }
    tbody {
      tr {
        height: 88px;
        border-bottom: 1px solid #f3f4f7 !important;
        &:hover {
          background-color: #fff !important;
        }
        &:first-child {
          .sms__event-name {
            height: 89px;
          }
          @-moz-document url-prefix() {
            .sms__event-name {
              height: 88px;
            }
          }
        }
      }
      td {
        /*padding: 18px 24px !important;*/
        &:first-child {
          padding: 18px 10px 18px 35px !important;
          background-color: #fff;
          border-bottom: 1px solid #f3f4f7;
          @media only screen and (min-width: $desktop) {
            padding-left: 56px !important;
          }
        }
      }

    }

  }
}
</style>
