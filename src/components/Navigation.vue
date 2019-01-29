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
        <img
          class="logo"
          :src="logo"
          :alt="logo"
        >
        <span>{{ appTitle }}</span>
      </VToolbarTitle>
      <!--<VSpacer />-->
      <!--<VToolbarSideIcon @click="navBar()" />-->
    </VToolbar>

    <VList>
      <VCalendar />
      <VListTile
        v-for="item in menu"
        :key="item.title"
        :to="item.route"
      >
        <VListTileContent>
          <VListTileTitle>{{ item.title }}</VListTileTitle>
        </VListTileContent>
        <VListTileAction>{{ item.count }}</VListTileAction>
        <div
          v-show="$route.name === item.route.name"
          class="add-btn"
        >
          <v-icon>add</v-icon>
        </div>
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
      logo:
        'https://lh3.googleusercontent.com/Ax2wQYxjDITuZEpc6K9EDYPG7C839tb4PApia4Tmf18u8XehB-twqhVgDVPgxxExkr4=s180'
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
    isCompany() {
      return this.business && this.business.type !== 'P';
    },
    isManagerMenu() {
      return !this.isBusinessCard;
    },
    menu() {
      return [
        {
          title: 'Сотрудники',
          count: this.employeesCount,
          route: { name: 'businessCardEmployee', id: this.$route.params.id }
        },
        {
          title: 'Услуги',
          count: this.servicesCount,
          route: { name: 'businessCardService', id: this.$route.params.id }
        },
        {
          title: 'Клиенты',
          count: this.clientsCount,
          route: { name: 'businessCardClients', id: this.$route.params.id }
        },
        {
          title: 'Филиалы',
          count: this.filialsCount,
          route: { name: 'businessCardFilal', id: this.$route.params.id }
        },
        {
          title: 'Информация',
          count: undefined,
          route: { name: 'businessCard', id: this.$route.params.id }
        },
        {
          title: 'Галерея',
          count: '12',
          route: { name: 'businessCardGallery', id: this.$route.params.id }
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
    ...mapActions(['navBar', 'loadUserInfo', 'setAppTitle']),
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
.v-toolbar__content {
}
.v-toolbar__title {
  display: flex;
  padding-left: 16px;
  align-items: center;
}
.logo {
  margin-right: 10px;
  max-width: 31px;
  max-height: 31px;
}
</style>
