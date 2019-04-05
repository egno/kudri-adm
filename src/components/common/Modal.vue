<template>
  <VDialog :value="visible" max-width="440px" persistent>
    <div class="uno-modal">
      <button type="button" class="uno-modal__close" @click="$emit('close')" />
      <div class="uno-modal__content">
        <div class="uno-modal__header">
          {{ template.header }}
        </div>
        <slot name="text" />
        <div class="uno-modal__buttons">
          <button type="button" class="uno-modal__left" @click="$emit('leftButtonClick'); $emit('close')">
            {{ template.leftButton }}
          </button>
          <button type="button" class="uno-modal__right" @click="$emit('rightButtonClick'); $emit('close')">
            {{ template.rightButton }}
          </button>
        </div>
      </div>
    </div>
  </VDialog>
</template>
<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      template: {
        type: Object,
        default () {
          return {
            header: '',
            text: '',
            leftButton: '',
            rightButton: ''
          }
        }
      }
    },
  }
</script>

<style lang="scss">
  @import "../../assets/styles/common";
  .uno-modal {
    position: relative;
    padding: 30px 30px 25px;
    background-color: #fff;
    text-align: center;
    @media only screen and (min-width : 1160px) {
      padding: 59px 62px 56px;
    }
    &__close {
      position: absolute;
      top: 21px;
      right: 22px;
      width: 14px;
      height: 14px;
      background: url('../../assets/images/svg/cross.svg') center no-repeat;
      outline: none;
    }

    &__header {
      font-family: $lato;
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: normal;
      color: #07101C;
    }

    &__text {
      margin: 36px auto 0;
      font-family: $lato;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: normal;
      color: #07101C;
    }

    &__buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 36px;
      button {
        @extend %button
      }
    }

    &__left {
      color: #8995AF;
      &:hover {
        color: #07101C;
      }
    }

    &__right {
      @extend %gold-gradient;
      color: #FFFFFF !important;
      &:hover {
        background: #07101C;
      }
    }
  }
</style>


