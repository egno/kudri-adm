<template>
  <div class="branches">
    <v-layout class="branches__breadcrumbs">
      <slot name="breadcrumbs" />
    </v-layout>
    <v-layout
      class="branches__header"
      row
      fill-height
      align-center
      justify-space-between
    >
      <v-flex
        class="branches__heading"
        xs12
      >
        <h1 class="branches__h1">
          Филиалы
        </h1>
      </v-flex>
      <v-flex>
        <main-button
          class="button_attractive add-branch"
          @click="$emit('add')"
        >
          <span>Создать филиал</span>
        </main-button>
      </v-flex>
    </v-layout>
    <v-layout
      justify-start
      align-start
      class="branches__content"
    >
      <slot name="content" />
    </v-layout>
  </div>
</template>

<script>
  import MainButton from '@/components/common/MainButton.vue'

  export default {
    components: { MainButton },
  }
</script>

<style lang="scss">
  @import '../../assets/styles/common';

  .branches {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding-right: 0;

    &__breadcrumbs {
      flex-grow: 0;
      padding-left: 48px;
      @media only screen and (min-width : $desktop) {
        padding-left: 127px;
      }
    }

    &__header {
      flex-grow: 0;
      padding: 44px 0;
      background: #fff;
    }

    &__heading {
      padding-left: 48px;
      @media only screen and (min-width : $desktop) {
        padding-left: 127px;
      }
    }

    &__h1 {
      font: 24px Roboto Slab, Times New Roman, Times, serif;
    }

    &__content {
      display: flex;
      flex-grow: 1;
      padding: 56px 0 0 48px;
      background: #f4f5f7;
      @media only screen and (min-width : $desktop) {
        padding-left: 103px;
      }
    }
  }
  .add-branch {
    margin-right: 16px;
    background: url('../../assets/images/svg/plus-white.svg') no-repeat center #EF4D37;
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
</style>
