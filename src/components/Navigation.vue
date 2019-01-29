<template>
  <VNavigationDrawer
    disable-resize-watcher
    app
    width="240"
    :dark="!isBusinessCard"
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
          :alt="name"
        >
        <span>{{ name }}</span>
      </VToolbarTitle>
      <!--<VSpacer />-->
      <!--<VToolbarSideIcon @click="navBar()" />-->
    </VToolbar>
    
    
    
    
    <VList>
      <VCalendar />
      <VListTile
        v-for="item in menu"
        :key="item.title"
        :to="item.route.name"
      >
        <VListTileContent>
          <VListTileTitle>{{ item.title }}</VListTileTitle>
        </VListTileContent>
        <VListTileAction>
          {{ item.count }}
        </VListTileAction>
        <div
          v-if="$route.path === '/' + item.route.name"
          class="add-btn"
        >
          <v-icon>
            add
          </v-icon>
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
      logo: 'https://lh3.googleusercontent.com/Ax2wQYxjDITuZEpc6K9EDYPG7C839tb4PApia4Tmf18u8XehB-twqhVgDVPgxxExkr4=s180',
      menu: [
        {
          title: 'Сотрудники',
          count: '12',
          route: { name: 'businessCardEmployee', id: this.$route.params.id }
        },
        {
          title: 'Услуги',
          count: '12',
          route: { name: 'businessCardService', id: this.$route.params.id }
        },
        {
          title: 'Клиенты',
          count: '12',
          route: { name: 'businessCardClients', id: this.$route.params.id }
        },
        {
          title: 'Филиалы',
          count: '12',
          route: { name: 'businessCardFilal', id: this.$route.params.id }
        },
        {
          title: 'Информация',
          count: '12',
          route: { name: 'businessCard', id: this.$route.params.id }
        },
        {
          title: 'Галерея',
          count: '12',
          route: { name: 'businessCardGallery', id: this.$route.params.id }
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['appTitle', 'loggedIn', 'token', 'navBarVisible']),
    businessId() {
      return this.$route && this.$route.params && this.$route.params.id;
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
  .v-navigation-drawer>.v-list:not(.v-list--dense) .v-list__tile {
    padding-right: 0;
  }
  .v-list__tile {
    padding-right: 0!important;
  }
  .add-btn {
    width: 40px;
    height: 100%;
    background: #EF4D37;
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
