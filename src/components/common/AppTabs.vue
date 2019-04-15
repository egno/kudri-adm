<template>
  <v-tabs
    :value="value"
    color="grey lighten-4"
    slider-color="primary"
    class="app-tabs"
    @change="$emit('input', $event)"
  >
    <slot />
  </v-tabs>
</template>

<script>
export default {
  props: {
    value: { type: Number, default: 0 }
  }
}
</script>

<style lang="scss">
  @import '../../assets/styles/common';
  .app-tabs {
    .v-tabs__wrapper {
      padding-left: 48px;
      background-color: #fff;
      @media only screen and (min-width : $desktop) {
        padding-left: 122px;
      }

    }
    .v-tabs__container {
      max-width: 524px;
    }
    .v-window {
      max-width: 524px;
      margin: 0 auto;
      background-color: #fff;

      @media only screen and (min-width : $desktop) {
        margin-left: 120px;
      }
    }
    .schedule-edit__heading {
      margin-top: 0;
    }
  }

</style>
