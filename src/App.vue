<template>
  <VApp app>
    <top-bar />
    <Navigation @onAction="onAction" />
    <VContent app>
      <RouterView />
    </VContent>
    <Alerts />
    <SendMessage :edit="messageWindow" />
    <ManagerProfileModal :show="profileDrawer" />
  </VApp>
</template>

<script>
import ManagerProfileModal from '@/components/manager/ManagerProfileModal.vue';
import Navigation from '@/components/Navigation.vue';
import TopBar from '@/components/TopBar.vue';
import Alerts from '@/components/Alerts.vue';
import SendMessage from '@/components/SendMessage.vue';
import router from '@/router';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Alerts,
    Navigation,
    SendMessage,
    TopBar,
    ManagerProfileModal
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
      'messageWindow',
      'profileDrawer',
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

<style lang="scss">
  #app {
    .title {
      font-size: 18px!important;
    }
    .headline,.title {
    }
    .v-btn.success {
      width: 240px;
      height: 56px;
      background: linear-gradient(270deg, #C9A15D -9.86%, #BA9462 103.49%);
      &:hover {
        background: #07101C!important;
      }
      &:active {
        background: #142941!important;
      }
    }
    .v-text-field {
      input, label {
        text-align: center;
        max-width: 100%;
        width: 100%;
        text-transform: uppercase!important;
        font-size: 13px;
        &.v-label--active {
          opacity: 1;
          font-size: 13px;
          color: #07101C!important;
          transform: scale(1) translateY(-18px);
        }
      }
      label {
        color: #07101C;
        opacity: 0.35;
        letter-spacing: 25%;
      }
      input {
        color: #07101C;
      }
      .v-input__slot {
        &:before {
          border-color: #8995AF;
        }
      }
    }
  }
  #app {
    .title {
      font-size: 18px!important;
    }
  }
  .v-toolbar {
    z-index: 10;
  }
  .v-navigation-drawer {
    z-index: 11;
  }
</style>