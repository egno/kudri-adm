<template>
  <v-layout id="home-menu" justify-start row class="home-menu">
    <button type="button" :class="['home-menu__activator', { active: isMenuVisible }]" @click="isMenuVisible = !isMenuVisible">
      <span>МЕНЮ</span>
    </button>

    <div :class="['home-menu__items', { active : isMenuVisible }]">
      <a 
        v-if="$route.name === 'home'" 
        v-smooth-scroll href="/#about" 
        :class="{ current: $route.hash && $route.hash === '#about' }"
      >
        О ПРОЕКТЕ
      </a>
      <router-link v-else :to="{ name: 'home', hash: '#about' }" :class="{ current: $route.hash && $route.hash === '#about' }">
        О ПРОЕКТЕ
      </router-link>
      <router-link :to="{ name: 'faq' }" :class="{ current: $route.name === 'faq' }">
        ПРОДУКТ
      </router-link>
      <router-link :to="{ name: 'news' }" :class="{ current: $route.name === 'news' }">
        НОВОСТИ
      </router-link>
    </div>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      isMenuVisible: false,
    }
  } 
}
</script>

<style lang="scss">

  @import '../../assets/styles/common';
  .home-menu {
    margin: 30px 0 50px;
    padding-left: 20px;
    align-items: center;
    @media only screen and (min-width : $tablet) {
      padding-left: 28px;
    }
    @media only screen and (min-width : $desktop) {
      display: none;
    }
    &__activator {
      height: 35px;
      padding-left: 40px;
      background: url('../../assets/images/svg/home_menu.svg') center left no-repeat #fff;
      outline: none;

      @media only screen and (min-width : $tablet) {
        display: none;
      }

      span {
        display: block;
        width: 55px;
        margin-left: 10px;
        transition: width 0.3s;
        overflow: hidden;
        font-weight: 900;
        font-size: 14px;
        @media only screen and (min-width : 414px) {
          font-size: 16px;
        }
      }
      &.active {
        width: 40px;
        background: url('../../assets/images/svg/home_menu_open.svg') center left no-repeat #fff;
        @media only screen and (min-width : 414px) {
          width: auto;
        }

        span {
          width: 0;
        }
      }
    }
    &__items {
      display: flex;
      width: 0;
      overflow: hidden;
      align-items: center;
      transition: width 0.3s;
      @media only screen and (min-width : $tablet) {
        width: auto;
      }
      a {
        margin-right: 12px;
        white-space: nowrap;
        color: #07101C;
        text-transform: uppercase;
        text-decoration: none;
        font-weight: 700;
        font-size: 14px;
        line-height: 34px;
        border-bottom: 1px solid transparent;
        @media only screen and (min-width : 414px) {
          margin-right: 24px;
          font-size: 16px;
        }
        @media only screen and (min-width : $tablet) {
          padding: 0 8px;
        }
        &.current {
          color: #BA9462;
          @media only screen and (min-width : $tablet) {
            border-bottom-color: #BA9462;
          }
          @media only screen and (min-width : $desktop) {
            display: none;
          }
        }
      }
      &.active {
        width: 85%;
      }
    }
    .v-menu__content {
      width: 100%;
    }
    .v-list {
      display: flex;
    }
  }
</style>

  
