<template>
  <VNavigationDrawer
    touchless
    disable-resize-watcher
    disable-route-watcher
    permanent
    app
    width="240"
    :mini-variant.sync="mini"
    :mini-variant-width="40"
    class="navigation"
    @input="onInput($event)"
  >
    <VToolbar flat>
      <VToolbarTitle
        overflow-hidden
        @click="goHome()"
      >
        <span>{{ defaultAppTitle }}</span>
      </VToolbarTitle>
      <VBtn
        :class="{ back: !mini, equal: mini}"
        icon
        @click.stop="mini = !mini"
      />
    </VToolbar>

    <VList>
      <VCalendar v-if="!isManagerMenu" />
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
                  <VListTileTitle>{{ item.title }}</VListTileTitle>
                </VListTileContent>
                <VListTileAction>
                  <span class="list-item--count">
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
import VCalendar from '@/components/calendar/VCalendar.vue';
import router from '@/router';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: { VCalendar },
  data() {
    return {
      name: 'Business Name',
      mini: false
    };
  },
  computed: {
    ...mapGetters([
      'business',
      'businessInfo',
      'businessServiceCount',
      'defaultAppTitle',
      'loggedIn',
      'token',
      'navBarVisible',
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
      const businessCards = [
        'businessCard',
        'businessCardClients',
        'businessCardEmployee',
        'businessCardFilal',
        'businessCardGallery',
        'businessCardServiceGallery',
        'businessCardEmployeeGallery',
        'businessCardService',
        'businessVisit',
        'employeeCard',
        'employeeFull',
        'employeeGallery'
      ];
      return businessCards.some(x => x === this.$route.name);
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
          show: this.loggedIn && !this.isManagerMenu,
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
          show: this.loggedIn && !this.isManagerMenu,
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
          count: this.galleryCount,
          route: {
            name: 'businessCardGallery',
            params: { id: this.businessLink }
          },
          show: this.loggedIn && !this.isManagerMenu
        }
      ];
    },
    services() {
      return (
        this.business &&
        this.businessInfo &&
        this.businessInfo.j &&
        this.businessInfo.j.services
      );
    }
  },
  watch: {
    token: 'loadUserInfo',
    routeBisinessId: 'loadBusiness'
  },
  mounted() {
    this.loadBusiness();
  },
  methods: {
    ...mapActions([
      'navBar',
      'loadUserInfo',
      'openMessageWindow',
      'setAppTitle',
      'setBusiness'
    ]),
    loadBusiness() {
      this.setBusiness(this.routeBisinessId);
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
  &.v-navigation-drawer--mini-variant {
    background: #fff !important;
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
    display: flex;
    flex-direction: column;
    z-index: 5;
    background: linear-gradient(180.36deg, #142941 0.06%, #07101c 85.63%);
    @media only screen and (max-width: 1024px) {
      &.v-navigation-drawer--mini-variant {
        width: 56px !important;
        height: 56px !important;
        overflow: hidden !important;
        border-bottom: 1px solid rgba(137, 149, 175, 0.1);
        .v-btn.equal {
          margin: 0 !important;
        }
      }
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
      .v-list__tile--active {
        background-color: rgba(137, 149, 175, 0.4);
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
