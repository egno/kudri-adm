<template>
  <VApp app>
    <top-bar />
    <Navigation @onAction="onAction" />
    <VContent app>
      <RouterView />
    </VContent>
    <Alerts />
    <SendMessage :edit="messageWindow" />
    <UserProfileModal :show="profileDrawer" />
  </VApp>
</template>

<script>
import UserProfileModal from '@/components/user/UserProfileModal.vue';
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
    UserProfileModal
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
  .v-btn {
    &.success {
      width: 240px;
      height: 56px;
      box-shadow: none !important;
      background: linear-gradient(270deg, #c9a15d -9.86%, #ba9462 103.49%);
      &:hover {
        background: #07101c !important;
        box-shadow: none !important;
      }
      &:active {
        background: #142941 !important;
        box-shadow: none !important;
      }
      .v-ripple__container {
        display: none !important;
      }
    }
    &.avatar {
      box-shadow: none !important;
    }
  }
  .v-text-field {
    input,
    label {
      max-width: 100%;
      width: 100%;
      text-transform: uppercase !important;
      font-size: 13px;
      &.v-label--active {
        opacity: 1;
        font-size: 13px;
        color: #07101c !important;
        transform: scale(1) translateY(-18px);
      }
    }
    &.centered-input {
      input,
      label {
        text-align: center;
      }
    }
    label {
      color: #07101c;
      opacity: 0.35;
      letter-spacing: 25%;
    }
    input {
      color: #07101c;
    }
    .v-input__slot {
      &:before {
        border-color: #8995af;
      }
    }
    &.workmode {
      width: 34px;
      height: 24px;
      padding: 0;
      margin: 0;
      overflow: hidden;
      .v-input__slot {
        &:before,
        &:after {
          display: none;
        }
      }
    }
  }
}
#app {
  .title {
    font-size: 18px !important;
  }
  .workmode-wrap {
    margin: 0;
    padding-left: 7px;
    padding-right: 7px;
    height: 24px;
    border-left: 1px solid #8995af;
    border-right: 1px solid #8995af;
    width: 95px;
    display: flex;
    justify-content: space-between;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 7px;
      height: 1px;
      background: #8995af;
      top: 58%;
      left: 45%;
    }
    .close {
      width: 10px;
      height: 10px;
      background: url('./assets/close.svg');
      position: absolute;
      right: -18px;
      top: 8px;
    }
  }
}
.v-toolbar {
  z-index: 10;
}
.v-navigation-drawer {
  z-index: 11;
}
</style>