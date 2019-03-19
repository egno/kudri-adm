<template>
  <div>
    <input
      id="checkbox"
      :checked="checked"
      v-bind="$attrs" type="checkbox"
      class="checkbox"
      @change="$emit('change', $event.target.checked)"
    >
    <label for="checkbox">{{ label }}</label>
  </div>
</template>
<script>
  export default {
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      label: { type: String, default: '' },
      checked: { type: Boolean, default: false },
    }
  }
</script>
<style lang="scss" scoped>
  .checkbox {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
  .checkbox + label {
    position: relative;
    cursor: pointer;
    min-width: 24px;
    min-height: 12px;
    padding-left: 36px;

    font-family: Lato, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: normal;
    color: #07101C;
  }
  .checkbox + label:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 12px;
    border-radius: 13px;
    background: #CDD1DA;
    box-shadow: inset 0 2px 3px rgba(0,0,0,.2);
    transition: .2s;
  }
  .checkbox + label:after {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 0px 4px rgba(44, 110, 55, 0.2);
    transition: .2s;
  }
  .checkbox:checked + label:before {
    background: #5699FF;
  }
  .checkbox:checked + label:after {
    left: 13px;
  }
</style>
