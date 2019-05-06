<template>
  <PageLayout
    :is-edit-mode="true"
    :is-edit-visible="false"
    :template="{ headerText: 'Настройки', buttonText: '' }"
    class="businesscard-form"
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
      </AppTabs>
      <div class="tab-content">
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
                        <v-card-text
                          v-if="event.template"
                          class="caption grey--text"
                        >
                          <div class="pb-1">
                            Шаблон уведомления:
                          </div>
                          {{ event.template }}
                        </v-card-text>
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
              <v-layout
                align-left
                column
              >
                <template v-if="businessSettings.notifications && currentProvider">
                  <v-flex>
                    {{ currentProvider.name }}
                  </v-flex>
                  <v-flex v-if="currentProvider.j && currentProvider.j.site">
                    <div class="caption">
                      <a :href="currentProvider.j.site">{{ currentProvider.j.site }}</a>
                    </div>
                  </v-flex>
                  <v-flex
                    v-for="param in params"
                    :key="param.code"
                  >
                    <v-text-field
                      v-model="businessSettings.notifications.provider[param.code]"
                      :label="param.title"
                    />
                  </v-flex>
                </template>

                <v-flex>
                  <v-card
                    flat
                    color="grey lighten-3"
                  >
                    <v-card-title>
                      <v-switch
                        v-model="showProviders"
                        label="Показать список операторов рассылки"
                        color="blue"
                      />
                      <v-card-text v-if="showProviders">
                        <v-layout
                          row
                          wrap
                        >
                          <v-flex
                            v-for="provider in providers"
                            :key="provider.name"
                            pa-2
                          >
                            <v-card
                              :hover="true"
                              class="text-xs-center"
                              flat
                              ripple
                              @click="businessSettings.notifications.provider.name = provider.name"
                            >
                              <v-card-text>{{ provider.name }}</v-card-text>
                              <v-responsive>
                                <v-img
                                  :src="logo(provider)"
                                  :alt="provider.name"
                                />
                              </v-responsive>
                            </v-card>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-layout>
            </div>
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
import Api from '@/api/backend'

export default {
  components: { AppTabs, PhoneEdit, MainButton, PageLayout },
  data () {
    return {
      activeTab: 0,
      businessSettings: new BusinessSettings(),
      providers: [],
      showProviders: false,
      paramsInfo: {
        login: {
          title: 'Логин'
        },
        password: {
          title: 'Пароль'
        },
        key: {
          title: 'Ключ API'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['businessId']),
    currentProvider () {
      return (
        this.businessSettings &&
        this.businessSettings.notifications &&
        this.businessSettings.notifications.provider &&
        this.businessSettings.notifications.provider.name &&
        this.providers &&
        this.providers.find(
          x => x.name === this.businessSettings.notifications.provider.name
        )
      )
    },
    params () {
      return (
        this.currentProvider &&
        this.currentProvider.j &&
        this.currentProvider.j.services &&
        this.currentProvider.j.services.sms &&
        this.currentProvider.j.services.sms.params.map(x => {
          return { ...{ code: x.name }, ...this.paramsInfo[x.name] }
        })
      )
    }
  },
  watch: {
    businessId: 'load'
  },
  mounted () {
    this.load()
    this.loadProviders()
  },
  methods: {
    logo (provider) {
      return (
        provider &&
        provider.j &&
        provider.j.logo &&
        provider.j.logo !== '' &&
        provider.j.logo !== null &&
        `${process.env.VUE_APP_IMAGES}providers/${provider.j.logo}`
      )
    },
    loadProviders () {
      Api()
        .get('sms_providers?order=name')
        .then(res => {
          this.providers = res.data
        })
    },
    load () {
      if (!this.businessId) return
      this.businessSettings.load(this.businessId)
    },
    save () {
      this.businessSettings.save()
    }
  }
}
</script>

<style lang="scss">
@import '../assets/styles/infocard';
@import '../assets/styles/businesscard-form';

.tab-content {
  @media only screen and (min-width: $desktop) {
    padding-left: 127px;
  }
  .infocard._emp-serv {
    max-width: 100%;
    width: auto;
    // padding-right: 40px;
    .infocard__content {
      max-width: 100%;
    }
  }
}
.employee-profile {
  color: #07101c;
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  &__title {
    font-size: 24px;
    &._name {
      text-align: center;
    }
  }
  &__position {
    font-size: 14px;
    color: #8995af;
  }
  .v-avatar {
    margin-bottom: 24px !important;
  }
  .infocard._view {
    @media only screen and (min-width: $tablet) {
      width: 400px;
      margin: 0 auto 10px;
    }
    @media only screen and (min-width: $desktop) {
      margin: 0 10px 10px 0;
    }
  }
  ._view .infocard__content {
    @media only screen and (min-width: $desktop) {
      padding: 40px 60px 60px;
    }
  }
  ._view._services {
    @media only screen and (min-width: 1350px) {
      width: 540px;
    }
  }
}
.employee-profile-edit {
  .infocard__content {
    @media only screen and (min-width: $tablet) {
    }
  }
}
</style>
