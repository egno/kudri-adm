<template>
  <VToolbar
    class="home-header"
    app
    flat
    fixed
    :height="isDesktop? 146 : 91"
  >
    <div class="home-header__logo" />
    <VToolbarItems>
      <div class="home-header__desktop-menu">
        <a 
          v-if="$route.name === 'home'" 
          v-smooth-scroll 
          href="/#about"
          :class="{ current: $route.hash && $route.hash === '#about' }"
        >О ПРОЕКТЕ</a>
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
      <div class="home-header__right">
        <VLayout
          v-if="loggedIn"
          align-center
          justify-center
          class="company-badge"
          @click="goToBusiness"
        >
          <VFlex class="text-truncate company-badge__name">
            {{ badge.j.name }}
          </VFlex>
          <VFlex v-if="badge.j.category" class="company-badge__category">
            {{ badge.j.category }}
          </VFlex>
        </VLayout>
        <v-btn 
          v-else 
          flat 
          :class="['home-header__button _register', { active: !isFirstSectionInView || $route.name === 'faq' }]" 
          @click="$router.push({ name: 'register' })"
        >
          <div class="home-header__icon _register" />
          <div class="home-header__tablet-text">
            ПОПРОБУЙТЕ БЕСПЛАТНО
          </div>
        </v-btn>
        <ProfileMenu v-if="loggedIn" />
        <v-btn v-else flat class="home-header__button _login" @click="$router.push({ name: 'login' })">
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
  import ProfileMenu from '@/components/ProfileMenu.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'HomeHeaderVue',
    components: {
      ProfileMenu,
    },
    data () {
      return {
        firstSection: null,
        isFirstSectionInView: true
      }
    },
    computed: {
      ...mapGetters([
        'loggedIn',
        'myBusinessList'
      ]),
      isDesktop () {
        return window && window.innerWidth > 1159
      },
      badge () {
        if (!this.myBusinessList.length) {
          return {
            j: {
              name: '',
              category: ''
            }
          }
        }
        const company = this.myBusinessList.find(b => b.type === 'C')
        return company? company : this.myBusinessList[0]
      }
    },
    watch: {
      $route: {
        handler: 'checkElement',
        deep: true
      },
    },
    mounted () {
      this.checkElement()
    },
    beforeDestroy () {
      if (this.onScroll) {
        document.removeEventListener('scroll', this.onScroll)
      }
    },
    methods: {
      checkElement () {
        this.$nextTick(() => {
          this.firstSection = document.querySelector('.main-page__first')

          if (this.firstSection) {
            this.onScroll = () => this.isOutOfViewport(this.firstSection)
            this.onScroll()
            document.addEventListener('scroll', this.onScroll)
          }
        })
      },
      goToBusiness () {
        if (this.badge.id) {
          this.$router.push({ name: 'businessCard', params: { id: this.badge.id } })
        }
      },
      isOutOfViewport (elem) {
        if (!elem) {
          return 
        }
        let bounding = elem.getBoundingClientRect()

        this.isFirstSectionInView = bounding.bottom  > 100 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/styles/common';

  .home-header {
    background-color: #fff !important;

    @media only screen and (min-width : $tablet) { 
      padding-top: 5px;
    }
    @media only screen and (min-width : $desktop) {
      padding-top: 0;
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
    &__desktop-menu {
      display: none;
      @media only screen and (min-width : $desktop) {
        display: flex;
        width: 55%;
        justify-content: flex-start;
      }
      a {
        line-height: 37px;
        margin-right: 15%;
        padding: 0 8px;
        border-bottom: 1px solid transparent;
        &:last-child {
          margin-right: 0;
        }
        &.current {
          color: #BA9462;
          border-bottom-color: #BA9462;
        }
      }
    }
    &__right {
      height: 100%;
      display: flex;
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
    &__button {
      padding: 0 30px;
      &._register {
        border-radius: 0;
        border-right: 2px solid #07101C;
        &.active {
          @media only screen and (min-width : $tablet) {
            border-right: none;
            background: linear-gradient(90deg, #C9A15D 0%, #BA9462 100%) #b69768;
            color: #fff;
            .home-header__icon {
              background-image: url('../../assets/images/svg/user_white.svg');
            }
            &:hover {
              background-color: #07101C;
              background-image: none;
            }
          }
        }
      }
      &._login {
        @media only screen and (min-width : $desktop) {
          width: 134px;
        }
      }
    }
    &__desktop {
      display: none;
      @media only screen and (min-width : $desktop) {
        display: block;
        margin-right: 10px;
      }
    }
    .v-toolbar__content {
      max-width: 1496px;
      margin: 0 auto;
      padding-right: 0;
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
        margin-left: 102px;
      }
    }

    a {
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;   
      color: #07101C;
    }
    .company-badge {
      display: flex;
      flex-wrap: wrap;
      max-width: 200px;
      cursor: pointer;
      @media only screen and (min-width : $desktop) {
        max-width: 320px;
      }
    }
    .profile-menu {
      border-left: 2px solid #07101C;
      @media only screen and (min-width : $desktop) {
        width: 136px;
      }
    }
  }
</style>
