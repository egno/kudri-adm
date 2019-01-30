<template>
  <VNavigationDrawer
    disable-resize-watcher
    app
    width="240"
    @input="onInput($event)"
  >
    <VToolbar flat>
      <VToolbarTitle
        overflow-hidden
        @click="goHome()"
      >
        <span>{{ appTitle }}</span>
      </VToolbarTitle>
      <!--<VSpacer />-->
      <!--<VToolbarSideIcon @click="navBar()" />-->
    </VToolbar>

    <VList>
      <VCalendar v-if="!isManagerMenu" />
      <VListTile
        v-for="item in menu"
        v-show="item.show"
        :key="item.title"
        :to="item.route"
      >
        <VListTileContent>
          <VListTileTitle>{{ item.title }}</VListTileTitle>
        </VListTileContent>
        <VListTileAction>{{ item.count }}</VListTileAction>
        <div
          v-show="$route.name === (item.route && item.route.name) && (item.action)"
          class="add-btn"
          @click="onAction(item.action)"
        >
          <v-icon>add</v-icon>
        </div>
      </VListTile>
    </VList>
    <v-spacer />
    <VList>
      <VListTile @click="openMessageWindow">
        <VListTileContent>
          <VListTileTitle>Техподдержка</VListTileTitle>
        </VListTileContent>
      </VListTile>
    </VList>
  </VNavigationDrawer>
</template>

<script>
import VCalendar from '@/components/calendar/VCalendar.vue';
import router from '@/router';
import Api from '@/api/backend';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: { VCalendar },
  data() {
    return {
      business: {},
      name: 'Business Name',
    };
  },
  computed: {
    ...mapGetters(['appTitle', 'loggedIn', 'token', 'navBarVisible']),
    businessId() {
      return this.$route && this.$route.params && this.$route.params.id;
    },
    clientsCount() {
      return this.business && this.business.j && this.business.j.clients;
    },
    employeesCount() {
      return this.business && this.business.j && this.business.j.employees;
    },
    filialsCount() {
      return this.business && this.business.j && this.business.j.filials;
    },
    isBusinessCard() {
      const businessCards = [
        'businessCard',
        'businessCardClients',
        'businessCardEmployee',
        'businessCardFilal',
        'businessCardGallery',
        'businessCardService',
        'businessVisit',
        'employeeCard'
      ];
      return businessCards.some(x => x === this.$route.name);
    },
    isCompany() {
      return this.$store.state.userInfo.role === 'business';
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
          show: this.loggedIn && !this.isCompany
        },
        {
          title: 'Все компании',
          icon: 'business',
          route: { name: 'businessList' },
          show: !this.loggedIn || !this.isCompany
        },
        {
          title: 'Сотрудники',
          count: this.employeesCount,
          route: { name: 'businessCardEmployee', id: this.$route.params.id },
          show: this.loggedIn && !this.isManagerMenu,
          action: {
            label: 'Добавить сотрудника',
            action: 'newEmployee',
            default: true
          }
        },
        {
          title: 'Услуги',
          count: this.servicesCount,
          route: { name: 'businessCardService', id: this.$route.params.id },
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
          route: { name: 'businessCardClients', id: this.$route.params.id },
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
          route: { name: 'businessCardFilal', id: this.$route.params.id },
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
          route: { name: 'businessCard', id: this.$route.params.id },
          show: this.loggedIn && this.isCompany
        },
        {
          title: 'Галерея',
          count: '12',
          route: { name: 'businessCardGallery', id: this.$route.params.id },
          show: this.loggedIn && this.isCompany
        }
      ];
    },
    services() {
      return this.business && this.business.j && this.business.j.services;
    },
    servicesCount() {
      return this.services && this.services.length;
    }
  },
  watch: {
    token: 'loadUserInfo',
    businessId: 'getBusiness'
  },
  methods: {
    ...mapActions([
      'navBar',
      'loadUserInfo',
      'openMessageWindow',
      'setAppTitle'
    ]),
    getBusiness() {
      Api()
        .get(`business?id=eq.${this.businessId}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.business = res;
          return res;
        })
        .then(res => res.j.name)
        .then(res => this.setAppTitle(res))
        .catch(this.setAppTitle());
    },
    goHome() {
      router.push({ name: 'home' });
    },
    onAction(action) {
      console.log(action);
      this.$emit('onAction', action.action);
    },
    onInput(event) {
      this.navBar(event);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-navigation-drawer > .v-list:not(.v-list--dense) .v-list__tile {
  padding-right: 0;
}
.v-list__tile {
  padding-right: 0 !important;
}
.add-btn {
  width: 40px;
  height: 100%;
  background: #ef4d37;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}

</style>
