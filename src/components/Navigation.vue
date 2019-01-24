<template>
  <VNavigationDrawer
    app
    :dark="!isBusinessCard"
    :value="navBarVisible"
    @input="onInput($event)"
  >
    <VToolbar flat>
      <VToolbarTitle
        overflow-hidden
        @click="goHome()"
      >
        {{ appTitle }}
      </VToolbarTitle>
      <VSpacer />
      <VToolbarSideIcon @click="navBar()" />
    </VToolbar>
    <VList>
      <VCalendar v-if="loggedIn && isBusinessCard" />
      <VListTile
        v-for="item in items"
        :key="item.title"
        :to="item.route"
      >
        <VListTileAction>
          <VIcon>{{ item.icon }}</VIcon>
        </VListTileAction>

        <VListTileContent>
          <VListTileTitle>{{ item.title }}</VListTileTitle>
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
      business: {}
    };
  },
  computed: {
    ...mapGetters(['appTitle', 'loggedIn', 'token', 'navBarVisible']),
    businessId() {
      return this.$route && this.$route.params && this.$route.params.id;
    },
    items() {
      return this.menu.filter(x => x.show);
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
      return this.business && this.business.type !== 'P';
    },
    isManagerMenu() {
      return !this.isBusinessCard;
    },
    menu() {
      return [
        {
          title: 'Мой профиль',
          show: this.loggedIn && this.isManagerMenu
        },
        {
          title: 'Сообщения',
          show: this.loggedIn && this.isManagerMenu
        },
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
          title: 'Информация',
          show: this.loggedIn && this.isBusinessCard,
          route: { name: 'businessCard', id: this.$route.params.id }
        },
        {
          title: 'Услуги',
          show: this.loggedIn && this.isBusinessCard,
          route: { name: 'businessCardService', id: this.$route.params.id }
        },
        {
          title: 'Сотрудники',
          show: this.loggedIn && this.isBusinessCard && this.isCompany,
          route: { name: 'businessCardEmployee', id: this.$route.params.id }
        },
        {
          title: 'Клиенты',
          show: this.loggedIn && this.isBusinessCard && this.isCompany,
          route: { name: 'businessCardClients', id: this.$route.params.id }
        },
        {
          title: 'Филиалы',
          show: this.loggedIn && this.isBusinessCard && this.isCompany,
          route: { name: 'businessCardFilal', id: this.$route.params.id }
        },
        {
          title: 'Галерея',
          show: this.loggedIn && this.isBusinessCard,
          route: { name: 'businessCardGallery', id: this.$route.params.id }
        }
      ];
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
