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
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: normal;
      color: #07101C;
    }

    &__text {
      margin: 36px auto 0;
      font-family: Lato;
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
        min-width: 130px;
        height: 56px;
        padding: 0 14px;
        font-family: Roboto Slab;
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: normal;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        transition: background-color 0.4s 0s, color 0.4s 0s;
        outline: none;
        @media only screen and (min-width : 1160px) {
          padding: 0 28px;
        }
      }
    }

    &__left {
      color: #8995AF;
      &:hover {
        color: #07101C;
      }
    }

    &__right {
      color: #FFFFFF;
      background: linear-gradient(270deg, #C9A15D -9.86%, #BA9462 103.49%);
      &:hover {
        background: #07101C;
      }
    }
  }
</style>


