<template>
  <VNavigationDrawer
    v-model="visible"
    app
    dark
    mobile-break-point="1000"
    width="240"
    :mini-variant.sync="mini"
    :mini-variant-width="40"
    class="navigation"
    @input="onInput($event)"
  >
    <VToolbar
      flat
      color="secondary"
    >
      <VToolbarTitle
        overflow-hidden
        @click="goHome()"
      >
        <span>{{ defaultAppTitle }}</span>
      </VToolbarTitle>
      <VBtn
        :class="{ back: !mini, equal: mini, invisible: !isManagerMenu}"
        icon
        @click.stop="(isManagerMenu) ? mini = !mini : visible = !visible"
      />
    </VToolbar>

    <VCalendar v-if="!isManagerMenu" />
    <AddMenu v-if="loggedIn && isManagerMenu" />
    <VList>
      <v-hover
        v-for="item in menu"
        v-show="item.show"
        :key="item.title"
      >
        <v-card
          v-if="item.show"
          slot-scope="{ hover }"
          class="menu-item-card"
          color="rgba(0,0,0,0)"
          flat
        >
          <div class="menu-item-container">
            <div class="menu-item-left">
              <VListTile :to="item.route">
                <VListTileContent>
                  <VListTileTitle class="body-1">
                    {{ item.title }}
                  </VListTileTitle>
                </VListTileContent>
                <VListTileAction>
                  <span
                    v-if="item.count"
                    class="list-item--count"
                  >
                    {{ item.count }}
                  </span>
                </VListTileAction>
              </VListTile>
            </div>
            <div
              v-show="item.action && ($route.name === (item.route && item.route.name) || hover)"
              class="add-btn"
              @click="onAction(item.action)"
            >
              <v-icon color="white">
                add
              </v-icon>
            </div>
          </div>
        </v-card>
        <div v-else />
      </v-hover>
    </VList>
    <v-spacer />
    <div
      class="blue-link help-link"
      @click="openMessageWindow"
    >
      Сообщить о проблеме
    </div>
  </VNavigationDrawer>
</template>

<script>
import AddMenu from '@/components/AddMenu.vue';
import VCalendar from '@/components/calendar/VCalendar.vue';
import router from '@/router';
import { mapActions, mapGetters } from 'vuex';
import { isBusinessCard } from '@/utils';

export default {
  components: { AddMenu, VCalendar },
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapGetters([
      'actualDate',
      'business',
      'businessInfo',
      'businessIsSalon',
      'businessServiceCount',
      'defaultAppTitle',
      'loggedIn',
      'navigationMini',
      'token',
      'navigationVisible',
      'userRole'
    ]),
    routeBisinessId() {
      return this.$route && this.$route.params && this.$route.params.id;
    },
    businessLink() {
      return this.business;
    },
    clientsCount() {
      return (
        this.businessInfo && this.businessInfo.j && this.businessInfo.j.clients
      );
    },
    employeesCount() {
      return (
        this.businessInfo &&
        this.businessInfo.j &&
        this.businessInfo.j.employees
      );
    },
    filialsCount() {
      return (
        this.businessInfo && this.businessInfo.j && this.businessInfo.j.filials
      );
    },
    galleryCount() {
      return (
        this.businessInfo && this.businessInfo.j && this.businessInfo.j.gallery
      );
    },
    isBusinessCard() {
      return isBusinessCard(this.$route.name);
    },
    isCompany() {
      return this.business && this.userRole === 'business';
    },
    isManagerMenu() {
      return !this.isBusinessCard;
    },
    menu() {
      return [
        {
          title: 'Мои компании',
          icon: 'business',
          route: { name: 'myBusinessList' },
          show: this.loggedIn && this.isManagerMenu
        },
        {
          title: 'Все компании',
          icon: 'business',
          route: { name: 'businessList' },
          show: !this.loggedIn || this.isManagerMenu
        },
        {
          title: 'Сотрудники',
          count: this.employeesCount,
          route: {
            name: 'businessCardEmployee',
            params: { id: this.businessLink }
          },
          show: this.loggedIn && !this.isManagerMenu && this.businessIsSalon,
          action: {
            label: 'Добавить сотрудника',
            action: 'newEmployee',
            to: {
              name: 'employeeFull',
              params: { id: this.businessLink, employee: 'new' }
            },
            default: true
          }
        },
        {
          title: 'Услуги',
          count: this.businessServiceCount,
          route: {
            name: 'businessCardService',
            params: { id: this.businessLink }
          },
          show: this.loggedIn && !this.isManagerMenu,
          action: {
            label: 'Добавить услугу',
            action: 'newService',
            default: true
          }
        },
        {
          title: 'Клиенты',
          count: this.clientsCount,
          route: {
            name: 'businessCardClients',
            params: { id: this.businessLink }
          },
          show: this.loggedIn && !this.isManagerMenu,
          action: {
            label: 'Добавить клиента',
            action: 'newClient',
            default: true
          }
        },
        {
          title: 'Филиалы',
          count: this.filialsCount,
          route: {
            name: 'businessCardFilal',
            params: { id: this.businessLink }
          },
          show: this.loggedIn && !this.isManagerMenu && this.businessIsSalon,
          action: {
            label: 'Добавить филиал',
            action: 'newFilial',
            default: true
          }
        },
        {
          title: 'Информация',
          count: undefined,
          route: {
            name: 'businessCard',
            params: { id: this.businessLink }
          },
          show: this.loggedIn && !this.isManagerMenu
        },
        {
          title: 'Галерея',
          count: null,
          route: {
            name: 'businessCardGallery',
            params: { id: this.businessLink }
          },
          show: this.loggedIn && !this.isManagerMenu
        }
      ];
    },
    mini: {
      get() {
        return this.navigationMini;
      },
      set(val) {
        this.setNavigationMini(val);
      }
    },
    services() {
      return (
        this.business &&
        this.businessInfo &&
        this.businessInfo.j &&
        this.businessInfo.j.services
      );
    },
    visible: {
      get() {
        return this.navigationVisible;
      },
      set(val) {
        this.setNavigationVisible(val);
      }
    }
  },
  watch: {
    token: 'loadUserInfo',
    routeBisinessId: 'loadBusiness',
    actualDate: 'loadBusiness'
  },
  mounted() {
    this.loadBusiness();
  },
  methods: {
    ...mapActions([
      'navBar',
      'setNavigationVisible',
      'loadDayVisits',
      'loadUserInfo',
      'openMessageWindow',
      'setAppTitle',
      'setBusiness',
      'setNavigationMini'
    ]),
    doNothing() {
      console.log('');
    },
    loadBusiness() {
      this.setBusiness(this.routeBisinessId);
      if (!this.actualDate) return;
      const month = this.actualDate.replace(/\d{2}$/, '01');
      this.loadDayVisits({
        business: this.routeBisinessId,
        month: month
      });
    },
    goHome() {
      router.push({ name: 'home' });
    },
    onAction(action) {
      console.log(action);
      if (action && action.to) {
        this.$router.push(action.to);
        return;
      }
      this.$emit('onAction', action.action);
    },
    onInput(event) {
      this.navBar(event);
    }
  }
};
</script>

<style lang="scss">
.v-navigation-drawer {
  .add-menu-list-mini {
    display: none;
  }
  &.v-navigation-drawer--mini-variant {
    background: #fff !important;
    overflow: visible;
    .add-menu-list-mini {
      display: block;
      width: 40px;
      height: 40px;
      background: accent url('../assets/plus-w.svg') no-repeat center center;
      background-size: 24px;
      cursor: pointer;
      position: absolute;
      top: 55px;
      .items {
        display: none;
        position: absolute;
        left: 100%;
        & > div {
          padding: 0 10px;
        }
        a {
          color: #fff;
          text-decoration: none;
          white-space: nowrap;
        }
      }
      &:hover {
        .items {
          display: block;
          background: linear-gradient(180.22deg, #333c54 0.06%, #4a5d6d 85.63%);
          padding: 10px 0;
          & > div {
            &:hover {
              background: rgba(137, 149, 175, 0.2);
              cursor: pointer;
            }
          }
        }
      }
    }
    .v-list,
    .help-link,
    .v-toolbar__title {
      display: none !important;
    }
  }
  .v-btn {
    &.back,
    &.equal {
      position: absolute;
      right: 19px;
      top: 50%;
      margin-top: 0;
      margin-bottom: 0;
      transform: translateY(-50%);
    }
  }
  &.navigation {
    background-color: var(--v-secondary-base);
    .invisible {
      display: none;
    }

    .help-link {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      cursor: pointer;
    }
    .v-list {
      background: transparent;
      padding: 0;
      .list-item--count {
        padding-right: 24px;
      }
      .v-list__tile--link {
        color: #fff !important;
        font-weight: 400 !important;
        height: 40px;
        &:hover {
          background-color: rgba(137, 149, 175, 0.2);
        }
      }
      .menu-item-container {
        display: flex;
      }
      .menu-item-left {
        flex-grow: 1;
      }
    }
    .v-toolbar,
    .v-toolbar__content {
      height: 56px !important;
    }

    .v-list__tile {
      padding-right: 0 !important;
      padding-left: 40px;
    }
    .theme--light.v-toolbar {
      background: transparent;
    }
    .add-btn {
      width: 40px;
      height: 40px;
      background: #ef4d37;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
.v-navigation-drawer > .v-list:not(.v-list--dense) .v-list__tile {
  padding-right: 0;
}
</style>
