<template>
  <button v-show="visible" type="button" class="delete-button" v-bind="$attrs" @mousedown="$emit('delete')">
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0H4V2H0V4H12V2H8V0ZM0 6H12V20H0V6Z" fill="#ffffff" fill-opacity="0.7" />
    </svg>
  </button>
</template>
<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: true
      },
    },
  }
</script>
<style lang="scss">
  @import '../../assets/styles/common';
  @import '../../assets/styles/icon';
  .delete-button {
    @include uno-icon();
    @extend %vertical-align;
    background-color: transparent;
    justify-content: center;
    &:hover {
      path {
        fill-opacity: 1;
      }
    }
  }
</style>
