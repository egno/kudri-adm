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
      <!-- <router-link :to="{ name: 'news' }">
          НОВОСТИ
        </router-link> -->
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
      display: none;
    }
    &__activator {
      height: 35px;
      padding-left: 40px;
      background: url('../../assets/images/svg/home_menu.svg') center left no-repeat #fff;
      font-weight: 400;
      font-size: 16px;
      outline: none;

      span {
        display: block;
        width: 55px;
        margin-left: 10px;
        transition: width 0.3s;
        overflow: hidden;
        font-weight: bold;
        font-size: 16px;
      }
      &.active {
        background: url('../../assets/images/svg/home_menu_open.svg') center left no-repeat #fff;

        span {
          width: 0;
        }
      }
    }
    &__items {
      width: 0;
      height: 16px;
      overflow: hidden;
      transition: width 0.3s;
      a {
        margin-right: 24px;
        color: #07101C;
        text-transform: uppercase;
        text-decoration: none;
        &.current {
          color: #BA9462;
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

  
