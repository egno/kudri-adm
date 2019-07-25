<template>
  <div class="home-menu">
    <button
      type="button"
      :class="{ 'hamburger-menu': true, active: menuActive }"
      @click="menuActive = !menuActive"
    />

    <v-dialog v-model="menuActive" content-class="content" fullscreen hide-overlay internal-activator attach=".home-menu">
      <Links />
    </v-dialog>
  </div>
</template>

<script>
  import Links from '@/components/home/Links.vue'

  export default {
    name: 'HomeMenu',
    components: {
      Links,
    },
    data () {
      return {
        menuActive: false
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/styles/common';

  .home-menu {
    .hamburger-menu {
      width: 28px;
      height: 24px;
      margin-right: 20px;
      background: url('../../assets/images/svg/menu.svg') center/contain no-repeat;
      outline: none;
      &.active {
        background: url('../../assets/images/svg/cross.svg') center/14px no-repeat;
      }
    }

    .content {
      /*position: fixed;
      left: 0;
      right: 0;*/
      top: 80px;
      height: calc(100vh - 80px);
      background-color: rgba(255,255,255,0.9);
      box-shadow: none;
      @media only screen and (min-width : $desktop) {
        top: 146px;
        height: calc(100vh - 146px);
      }
    }
  }



</style>
