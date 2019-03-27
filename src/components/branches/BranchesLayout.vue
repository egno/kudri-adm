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
    <v-layout class="branches__content" wrap>
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

  @mixin tag-active () {
    color: #fff;
    background: rgba(137, 149, 175, 0.35);
    transition: color, background-color 0.4s 0s;
  }
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
      padding: 40px 0 0 48px;
      align-content: flex-start;
      background: #f4f5f7;
      @media only screen and (min-width : $desktop) {
        padding-left: 103px;
      }
    }

    &__cities {
      width: 100%;
      margin-bottom: 60px;
    }

    &__city {
      padding: 0 24px;
      margin-right: 24px;
      background: rgba(137, 149, 175, 0.1);
      border-radius: 14px;
      font-family: $roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 28px;
      text-align: center;
      color: #8995AF;
      cursor: pointer;

      &._active {
        @include tag-active()
      }
      &:hover {
        @include tag-active()
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
