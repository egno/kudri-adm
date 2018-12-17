<template>
  <VApp app>
    <TopBar app />
    <Navigation />
    <VContent app>
      <RouterView />
    </VContent>
  </VApp>
</template>

<script>
import Navigation from '@/components/Navigation.vue';
import TopBar from '@/components/TopBar.vue';
import router from '@/router';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Navigation,
    TopBar
  },
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapGetters(['actions', 'appTitle', 'navBarVisible', 'userID']),
    defaultAction() {
      if (!this.actions) {
        return;
      }
      return this.actions.filter(x => x['default'])[0];
    }
  },
  mounted() {
    this.loadFromStorage();
    this.loadUserInfo();
    this.loadServiceCategories();
    this.loadServiceList();
  },
  methods: {
    ...mapActions([
      'loadFromStorage',
      'loadServiceCategories',
      'loadServiceList',
      'loadUserInfo',
      'navBar'
    ]),
    goHome() {
      router.push({ name: 'home' });
    }
  }
};
</script>
