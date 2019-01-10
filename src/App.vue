<template>
  <VApp app>
    <TopBar
      app
      @onAction="onAction"
    />
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
    ...mapGetters([
      'actions',
      'actualDate',
      'appTitle',
      'navBarVisible',
      'userID'
    ]),
    defaultAction() {
      if (!this.actions) {
        return;
      }
      return this.actions.filter(x => x['default'])[0];
    }
  },
  mounted() {
    this.setActions();
    this.loadFromStorage();
    this.loadUserInfo();
    this.loadServiceList();
    this.checkDate();
  },
  methods: {
    ...mapActions([
      'loadFromStorage',
      'loadServiceList',
      'loadUserInfo',
      'setActions',
      'setActualDate',
      'navBar'
    ]),
    checkDate() {
      if (!this.actualDate) {
        // let date = new Date();
        // this.setActualDate(formatDate(date));
      }
    },
    goHome() {
      router.push({ name: 'home' });
    },
    onAction(payload) {
      this.$root.$emit('onAction', payload);
    }
  }
};
</script>
