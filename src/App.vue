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
import UserProfileModal from '@/components/user/UserProfileModal.vue'
import Navigation from '@/components/Navigation.vue'
import TopBar from '@/components/TopBar.vue'
import Alerts from '@/components/Alerts.vue'
import SendMessage from '@/components/SendMessage.vue'
import router from '@/router'
import { mapActions, mapGetters } from 'vuex'
import { setTimeout, clearTimeout } from 'timers'

export default {
  metaInfo () {
    return {
      title: this.title
    }
  },
  name: 'App',
  components: {
    Alerts,
    Navigation,
    SendMessage,
    TopBar,
    UserProfileModal
  },
  data () {
    return {
      tokenTimerId: undefined
    }
  },
  computed: {
    ...mapGetters([
      'actions',
      'actualDate',
      'appTitle',
      'businessName',
      'navBarVisible',
      'messageWindow',
      'profileDrawer',
      'userID',
      'userRole'
    ]),
    defaultAction () {
      if (!this.actions) {
        return
      }
      return this.actions.filter(x => x['default'])[0]
    },
    title () {
      if (!this.appTitle) {
        return 'UNO'
      }
      if (this.businessName) {
        return `${this.appTitle}. ${this.businessName}`
      }
      if (this.userRole) {
        return `${this.appTitle} ${this.userRole}`
      }
      return this.appTitle
    }
  },
  mounted () {
    this.loadApiTime()
    this.setActions()
    this.loadFromStorage()
    this.loadServiceList()
    this.loadServiceGroups()
    this.checkDate()
    this.loadEmployeeCategories()
    this.loadEmployeePositions()
    this.tokenTimer()
  },
  methods: {
    ...mapActions([
      'loadApiTime',
      'loadEmployeeCategories',
      'loadEmployeePositions',
      'loadFromStorage',
      'loadServiceList',
      'loadServiceGroups',
      'refreshToken',
      'setActions',
      'setActualDate',
      'navBar'
    ]),
    checkDate () {
      this.setActualDate()
    },
    goHome () {
      router.push({ name: 'home' })
    },
    onAction (payload) {
      this.$root.$emit('onAction', payload)
    },
    tokenTimer () {
      let vm = this
      clearTimeout(this.tokenTimerId)
      this.tokenTimerId = setTimeout(function () {
        vm.refreshToken()
        vm.tokenTimer()
      }, 1000*60*45)
    }
  }
}
</script>

<style lang="scss">
  @import './assets/styles/common';

#app {
  .main-cont {
    padding: 40px 56px;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  .mb-35 {
    margin-bottom: 35px;
  }
  .topsearch {
    padding-left: 24px;
    background: url('assets/images/svg/search.svg') no-repeat left 0px center;
    background-size: 24px;
    font-family: Lato;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    font-size: 11px;
    .v-label {
      top: 10px;
    }
    .v-input--is-focused {
      .v-input__slot {
        &:after {
          display: none !important;
        }
      }
    }
    .v-input__slot {
      &:after {
        display: none !important;
      }
      &:before {
        display: none !important;
      }
    }
  }
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
    z-index: 5;
    box-shadow: none;
    border-bottom: 1px solid #f4f5f7; // rgba(137, 149, 175, 0.1);
    .v-toolbar__content {
      background: #fff;
      padding-right: 0;
    }
  }
  .v-btn {
    box-shadow: none !important;
    &:hover {
      &:before {
        display: none;
      }
    }
    .v-ripple__container {
      display: none !important;
    }
    &.back {
      width: 16px;
      height: 16px;
      background: url('assets/back.svg') no-repeat center center;
    }
    &.equal {
      width: 16px;
      height: 16px;
      border-radius: 0;
      background: url('assets/equal.svg') no-repeat center center;
      &:hover {
        &:before {
          display: none;
        }
      }
    }
    &.close {
      width: 16px;
      height: 16px;
      border-radius: 0;
      background: url('assets/close.svg') no-repeat center center;
    }
    &.success {
      width: 240px;
      height: 56px;
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
      font-weight: normal;
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
        margin-left: 0;
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
  .v-select__slot {
    position: relative;

    .v-input__icon {
      height: 22px;
    }

    .v-input__append-inner {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin-top: -2px;
      display: flex;
      align-items: center;
      .mdi-menu-down:before {
        content: '';
        width: 10px;
        height: 6px;
        background: url('./assets/images/down.png') center no-repeat;
      }
    }
  }
  .v-input__slot {
    margin-bottom: 3px;
  }
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

  .section-add-button {
    margin-right: 16px;
    background: url('./assets/images/svg/plus-white.svg') no-repeat center/16px #EF4D37;
    span {
      display: none;
    }
    @media only screen and (min-width : $desktop) {
      background-image: none;
      span {
        display: inline;
      }
    }
  }

  .filter-results {
    padding-left: 5px;
    &__group-name {
      margin: 40px 0 32px;
      padding-right: 11px;
      font-family: Roboto Slab, serif;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      color: #07101C;
    }

    &__cards {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
.filters {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 0;
  &__item {
    @extend %filter
  }
}

.v-text-field {
  .v-input--is-focused {
    border-bottom: 1px solid #5699ff !important;
  }
  textarea {
    font-family: Lato;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    font-size: 13px;
    color: #07101c;
    &::placeholder {
      color: rgba(7, 16, 28, 0.35) !important;
      font-size: 13px;
    }
  }
  .v-text-field__prefix {
    padding-top: 5px;
    font-size: 13px;
    font-family: Lato;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
  }
  input,
  label {
    padding-bottom: 2px;
    max-width: 100%;
    width: 100%;
    font-size: 14px;
    font-family: Lato;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    &.v-label--active {
      opacity: 1;
      font-size: 11px;
      color: rgba(7, 16, 28, 0.35) !important;
      transform: scale(1) translateY(-18px);
    }
  }
  input {
    color: #07101c;
  }
  &.centered-input {
    text-transform: uppercase !important;
    input,
    label {
      text-align: center;
      &.v-label--active {
        text-align: center;
        font-size: 11px;
      }
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
  &.workmode {
    width: 34px;
    height: 24px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    margin-top: -1px;
    &.error--text {
      input {
        color: #ef4d37;
      }
    }
    .v-input__slot {
      &:before,
      &:after {
        display: none;
      }
    }
  }
}

.v-tooltip__content {
  background: linear-gradient(142.11deg, #536976 -29.81%, #292e49 136.3%);
  box-shadow: 1px 2px 7px rgba(0, 0, 0, 0.04);
  padding: 15px 20px;
  .text-secondary {
    line-height: 17px;
    color: rgba(255, 255, 255, 0.5);
  }
  .text-primary {
    line-height: 24px;
  }
}
.v-input--selection-controls .v-input__slot {
  margin-bottom: 0 !important;
}

.v-navigation-drawer {
  z-index: 11;
}
.span-main-text {
  padding-left: 0.5em;
}

.fill-height .flex {
  display: flex;
}
.fill-height .flex .v-card {
  flex: 1 1 auto;
}
.hidden-button:hover {
  text-decoration: underline;
  cursor: pointer;
}
.v-breadcrumbs {
  padding-left: 0;
}
.v-breadcrumbs__item {
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: normal;
  color: #07101C;
}
.v-breadcrumbs .v-breadcrumbs__divider {
  border: 1px solid #8995AF;
  border-radius: 50%;
  background: #8995AF;
  padding: 0 !important;
  margin: 0 8px;
}
.v-breadcrumbs__item--disabled {
  color: #8995AF;
}
.v-counter {
  order: -1;
  font-size: 14px;
}
.v-chip__close .v-icon {
  color: transparent !important;
  background: url('./assets/images/svg/cross.svg') center no-repeat transparent;
  opacity: 1;
  &:before {
    width: 20px;
    height: 20px;
    content: '';
  }
}
.v-select .v-chip {
  background: rgba(137, 149, 175, 0.1);
}

</style>
