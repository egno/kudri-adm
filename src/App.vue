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
    this.loadServiceGroups();
    this.checkDate();
    this.loadEmployeeCategories();
    this.loadEmployeePositions();
  },
  methods: {
    ...mapActions([
      'loadApiTime',
      'loadEmployeeCategories',
      'loadEmployeePositions',
      'loadFromStorage',
      'loadServiceList',
      'loadServiceGroups',
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
  .blue-link {
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    line-height: normal;
    font-size: 13px;
    color: #5699ff;
  }
  .v-menu__content {
    box-shadow: none;
    border: 1px solid rgba(137, 149, 175, 0.1);
  }
  .topbar {
    box-shadow: none;
    border-bottom: 1px solid rgba(137, 149, 175, 0.1);
    .v-toolbar__content {
      background: #fff;
    }
  }
  .v-btn {
    .v-ripple__container {
      display: none !important;
    }
    &.success {
      width: 240px;
      height: 56px;
      box-shadow: none !important;
      background: linear-gradient(270deg, #c9a15d -9.86%, #ba9462 103.49%);
      transition: none;
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
    &.delete {
      width: 20px;
      min-width: 20px;
      max-width: 20px;
      height: 20px;
      background: url('assets/del.svg') no-repeat center center;
      background-size: 12px 20px;
      &:before {
        display: none;
      }
      &:hover {
        background: url('assets/delh.svg') no-repeat center center;
      }
    }
    &.transparent {
      color: #8995af;
      box-shadow: none !important;
      background: transparent;
      text-transform: none;
      height: 20px;
      .v-ripple__container {
        display: none !important;
      }
      &:before {
        display: none;
      }
      &:hover {
        box-shadow: none !important;
        background: transparent;
      }
      &.add {
        padding-left: 22px;
        &:after {
          content: '';
          position: absolute;
          left: 0;
          top: 1px;
          background: url('assets/plus.svg') no-repeat center center;
          width: 16px;
          height: 16px;
          background-size: 12px 20px;
        }
      }
      &.v-btn--disabled {
        background: transparent !important;
      }
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
        height: 1.7em;
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
    max-width: 95px;
    display: flex;
    justify-content: space-between;
    position: relative;
    .v-input--is-focused {
      border-bottom: 1px solid #5699ff !important;
    }
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
.span-main-text {
  padding-left: 0.5em;
}
</style>