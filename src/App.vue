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
    this.loadApiTime();
    this.setActions();
    this.loadFromStorage();
    this.loadUserInfo();
    this.loadServiceList();
    this.checkDate();
  },
  methods: {
    ...mapActions([
      'loadApiTime',
      'loadFromStorage',
      'loadServiceList',
      'loadUserInfo',
      'setActions',
      'setActualDate',
      'navBar'
    ]),
    checkDate() {
      this.setActualDate();
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

<style>
.v-toolbar {
  z-index: 10;
}
.v-navigation-draver {
  z-index: 11;
}
</style>