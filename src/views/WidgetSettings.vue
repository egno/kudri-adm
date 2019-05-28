<template>
  <PageLayout
    :is-edit-mode="true"
    :is-edit-visible="false"
    :template="{ headerText: 'Онлайн запись', buttonText: '' }"
    class="businesscard-form"
  >
    <template slot="content">
      <AppTabs v-model="activeTab">
        <v-tab
          :key="0"
          ripple
        >
          Виджет на сайт
        </v-tab>
        <v-tab
          :key="1"
          ripple
        >
          Запись по ссылке
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
                <v-flex>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      pa-3
                      sm6
                    >
                      <div>
                        <span class="font-weight-bold ">Виджет</span>
                        <span>
                          — эффективный способ получать записи прямо с сайта компании или личного портфолио. Подходит как для компьютера, так и для смартфона. Универсальный стильный дизайн, удобная навигация, SMS-напоминания накануне записи.
                        </span>
                      </div>
                    </v-flex>
                    <v-flex
                      pa-3
                      sm6
                    >
                      <div>
                        <v-img src="/img/widget01.png" />
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <WidgetButtonSettings />
                </v-flex>
              </v-layout>
            </div>
          </div>
          <div
            v-show="activeTab === 1"
            class="infocard _edit"
          />
        </v-form>
      </div>
    </template>
  </PageLayout>
</template>

<script>
import BusinessSettings from '@/classes/business_settings'
import { mapGetters } from 'vuex'
import AppTabs from '@/components/common/AppTabs.vue'
import PageLayout from '@/components/common/PageLayout.vue'
import WidgetButtonSettings from '@/components/WidgetButtonSettings.vue'

export default {
  components: { AppTabs, PageLayout, WidgetButtonSettings },
  data () {
    return {
      activeTab: 0,
      businessSettings: new BusinessSettings()
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
  },
  methods: {
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
@import '../assets/styles/settings';
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
