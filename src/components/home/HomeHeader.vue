<template>
  <VToolbar
    class="home-header"
    app
    flat
    fixed
  >
    <div class="home-header__logo" />

    <VToolbarItems>
      <div class="home-header__desktop">
        <a v-smooth-scroll href="#about">О ПРОЕКТЕ</a>
        <a v-smooth-scroll href="#faq">ПРОДУКТ</a>
        <a v-smooth-scroll href="#news">НОВОСТИ</a>
      </div>
      <div class="home-header__right">
        <v-btn flat class="home-header__button _register" @click="$router.push({ name: 'register' })">
          <div class="home-header__icon _register" />
          <div class="home-header__tablet-text">
            ПОПРОБУЙТЕ БЕСПЛАТНО
          </div>
        </v-btn>
        <v-btn flat class="home-header__button" @click="$router.push({ name: 'login' })">
          <div class="home-header__desktop">
            ВХОД
          </div>
          <div class="home-header__icon _login" />
        </v-btn>
      </div>
    </VToolbarItems>
  </VToolbar>
</template>

<script>
  export default {
    name: 'HomeHeaderVue'
  }
</script>

<style lang="scss">
  @import '../../assets/styles/common';

  .home-header {
    height: 55px;
    box-sizing: content-box;
    padding-top: 18px;
    background-color: #fff !important;

    @media only screen and (min-width : $tablet) {
      padding-top: 23px;
    }
    @media only screen and (min-width : $desktop) {
      padding-top: 39px;
    }
    &__logo {
      width: 63px;
      height: 36px;
      background: url('../../assets/images/svg/logo_dark.svg') center/contain no-repeat;
      @media only screen and (min-width : $tablet) {
        width: 94px;
      }
      svg {
        max-width: 100%;
      }
    }
    &__desktop {
      display: none;
      @media only screen and (min-width : $desktop) {
        display: flex;
        width: 50%;
        justify-content: space-between;
      }
    }
    &__right {
      height: 100%;
    }
    &__tablet-text {
      display: none;
      @media only screen and (min-width : $tablet) {
        display: inline;
        margin-left: 10px;
      }
    }
    &__icon {
      width: 24px;
      height: 24px;
      background-position: center top;
      background-repeat: no-repeat;
      &._register {
        background-image: url('../../assets/images/svg/user.svg');
      }
      &._login {
        background-image: url('../../assets/images/svg/lock.svg');

      }
    }
    &__button:first-child {
      border-right: 2px solid #07101C;
    }
    .v-toolbar__content {
      height: 55px !important;
    }
    .v-toolbar__items {
      flex-grow: 1;
      height: 55px;
      justify-content: flex-end;
      align-items: center;
      padding-top: 2px;
      box-sizing: border-box;
      @media only screen and (min-width : $desktop) {
        justify-content: space-between;
        margin-left: 96px;
      }
    }
    .v-btn {
      .home-header__desktop {
        @media only screen and (min-width : $desktop) {
          margin-right: 10px;
        }
      }
    }
    a {
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;   
      color: #07101C;
    }
  }
</style>
