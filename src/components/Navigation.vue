<template>
  <VNavigationDrawer
    v-model="visible"
    app
    :dark="!mini"
    mobile-break-point="1000"
    width="240"
    :mini-variant.sync="mini"
    :mini-variant-width="48"
    class="navigation"
    @input="onInput($event)"
  >
    <VToolbar
      flat
      :dark="!mini"
      height="55"
      class="pa-0"
    >
      <VList class="px-3">
        <v-list-tile-content>
          <v-list-tile-title
            overflow-hidden
            @click="goHome()"
          >
            <span class="title">
              {{ defaultAppTitle }}
            </span>
          </v-list-tile-title>
        </v-list-tile-content>
      </VList>
      <v-list-tile-action
        v-if="isManagerMenu"
        class="title-action"
      >
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon
            v-if="!mini"
            class="blind"
          >
            arrow_back
          </v-icon>
          <v-icon v-else>
            menu
          </v-icon>
        </v-btn>
      </v-list-tile-action>
      <!-- <VBtn
        :class="{ back: !mini, equal: mini, invisible: !isManagerMenu}"
        :dark="!mini"
        icon
        @click.stop="(isManagerMenu) ? mini = !mini : visible = !visible"
      />-->
    </VToolbar>

    <VCalendar v-if="!isManagerMenu" />
    <AddMenu v-if="loggedIn && isManagerMenu" />
    <VList v-if="!mini">
      <nav-powered-item
        v-for="item in menu"
        v-show="item.show"
        :key="item.title"
        :item="item"
        @onAction="onAction"
      />
    </VList>
    <v-spacer />
    <div
      v-if="!mini"
      class="blue-link help-link"
      @click="openMessageWindow"
    >
      Сообщить о проблеме
    </div>
  </VNavigationDrawer>
</template>

<script>
import AddMenu from '@/components/AddMenu.vue';
import NavPoweredItem from '@/components/NavPoweredItem.vue';
import VCalendar from '@/components/calendar/VCalendar.vue';
import router from '@/router';
import { mapActions, mapGetters } from 'vuex';
import { isBusinessCard } from '@/utils';

export default {
  components: { AddMenu, NavPoweredItem, VCalendar },
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
      return (
        (this.userRole === 'manager' || this.userRole === 'admin') &&
        !this.isBusinessCard
      );
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
}
.navigation.theme--dark,
.v-toolbar.theme--dark {
  background-color: var(--v-secondary-base);
}
.title-action {
  position: absolute;
  right: 0;
  height: 100%;
  width: 40px;
}
.blind {
  opacity: 0.2;
}
</style>
